"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAuth } from "@/lib/supabase/auth-helpers";

interface SubmitReportInput {
  /** Public URL of the already-uploaded photo in Supabase Storage */
  photoUrl: string;
  /** Storage path for cleanup on failure (e.g., "{user_id}/{timestamp}.jpg") */
  storagePath: string;
  /** AI analysis result */
  aiResult: {
    severity: string;
    confidence: number;
    condition: string;
    reasoning: string;
    firstAid: string[];
    urgency?: string;
    estimatedRecovery?: string;
    recommendedAction?: string;
    recoveryConfidence?: number;
  };
  /** Location data */
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  /** Additional details */
  details: {
    notes: string;
    approximateAge: string;
    visibleInjuries: string;
    behaviour: string;
  };
  /** Whether the reporter can transport the cat themselves */
  canTransport: boolean;
}

export interface SubmitReportResult {
  success: boolean;
  caseId?: string;
  error?: string;
}

// In-memory rate limiting store for Gemini AI triage
const aiTriageRateLimits = new Map<string, number[]>();
const LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

/**
 * Server action: Analyze a rescue photo using Gemini Vision API.
 */
export async function analyzeRescuePhoto(storagePath: string): Promise<{
  success: boolean;
  result?: {
    condition: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    confidence: number;
    reasoning: string;
    firstAid: string[];
    urgency: string;
    estimatedRecovery: string;
    recommendedAction: string;
    recoveryConfidence: number;
  };
  error?: string;
 }> {
  // 1. Authenticate user
  const user = await requireAuth();
  const userId = user.id;

  // Rate limiting check
  const now = Date.now();
  const userRequests = aiTriageRateLimits.get(userId) || [];
  const recentRequests = userRequests.filter(ts => now - ts < LIMIT_WINDOW_MS);

  if (recentRequests.length >= MAX_REQUESTS) {
    return {
      success: false,
      error: "You've reached the AI analysis limit. Please try again in a few minutes."
    };
  }

  // Record this request
  recentRequests.push(now);
  aiTriageRateLimits.set(userId, recentRequests);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[gemini] GEMINI_API_KEY not configured.");
    return { success: false, error: "AI analysis failed. Please try again." };
  }

  try {
    const supabase = await createClient();
    
    // Download image from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("rescue-photos")
      .download(storagePath);

    if (downloadError || !fileData) {
      console.error("[gemini] Failed to download image:", downloadError?.message);
      return { success: false, error: "AI analysis failed. Please try again." };
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const mimeType = fileData.type || "image/jpeg";

    const { triageImage } = await import("@/lib/gemini");
    const result = await triageImage(buffer, mimeType);

    return { success: true, result };
  } catch (e) {
    console.error("[gemini] Error analyzing image:", e);
    return { success: false, error: "AI analysis failed. Please try again." };
  }
}

/**
 * Server action: Submit a rescue report.
 *
 * Photo is already uploaded from the client to Supabase Storage.
 * This action only receives the photo URL (small string), not file data.
 *
 * Flow:
 * 1. Authenticate user
 * 2. Validate photo URL exists
 * 3. Generate fuzzed coordinates on the server
 * 4. Serialize extra AI assessment fields into the ai_reasoning column
 * 5. Insert case row (using authenticated client — RLS validates reporter_id)
 * 6. Create transport_requests row using service_role
 * 7. Return the new case ID
 *
 * If DB insert fails, attempts to delete the uploaded photo.
 */
export async function submitRescueReport(
  input: SubmitReportInput
): Promise<SubmitReportResult> {
  // 1. Authenticate
  const user = await requireAuth();
  const userId = user.id;

  const supabase = await createClient();
  const serviceClient = createServiceClient();

  // 2. Validate photo URL
  if (!input.photoUrl) {
    return { success: false, error: "Photo is required. Please upload a photo first." };
  }

  // 3. Generate fuzzed coordinates on the server (approx. 400m fuzz)
  const fuzzOffset = () => (Math.random() - 0.5) * 0.008;
  const fuzzedLat = input.location.lat + fuzzOffset();
  const fuzzedLng = input.location.lng + fuzzOffset();

  // 4. Serialize extra Gemini fields into the ai_reasoning text column
  const serializedReasoning = JSON.stringify({
    reasoning: input.aiResult.reasoning,
    urgency: input.aiResult.urgency || "Monitor",
    estimatedRecovery: input.aiResult.estimatedRecovery || "Unknown",
    recommendedAction: input.aiResult.recommendedAction || "No action specified.",
    recoveryConfidence: input.aiResult.recoveryConfidence ?? 50
  });

  // 5. Insert case row using authenticated client (RLS validates reporter_id = auth.uid())
  const severity = normalizeSeverity(input.aiResult.severity);
  const initialCaseStatus = input.canTransport ? "IN_TRANSIT" : "AWAITING_TRANSPORT";

  const { data: caseData, error: caseError } = await supabase
    .from("cases")
    .insert({
      reporter_id: userId,
      photo_url: input.photoUrl,
      description: buildDescription(input),
      status: initialCaseStatus,
      precise_lat: input.location.lat,
      precise_lng: input.location.lng,
      fuzzed_lat: fuzzedLat,
      fuzzed_lng: fuzzedLng,
      ai_severity: severity,
      ai_condition: input.aiResult.condition,
      ai_confidence: input.aiResult.confidence,
      ai_reasoning: serializedReasoning,
      ai_first_aid: input.aiResult.firstAid,
      ai_analyzed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (caseError || !caseData) {
    console.error("[report] Case insert failed:", caseError?.message);
    // Attempt to clean up the uploaded photo
    if (input.storagePath) {
      await supabase.storage.from("rescue-photos").remove([input.storagePath]);
    }
    return { success: false, error: "Failed to create rescue case. Please try again." };
  }

  // 6. Create transport request using service_role (RLS is admin-only for INSERT)
  if (input.canTransport) {
    const { error: transportError } = await serviceClient
      .from("transport_requests")
      .insert({
        case_id: caseData.id,
        status: "CLAIMED",
        claimed_by: userId,
        claimed_at: new Date().toISOString(),
      });

    if (transportError) {
      console.error("[report] Transport (self-claim) failed:", transportError.message);
      await serviceClient.from("cases").delete().eq("id", caseData.id);
      if (input.storagePath) {
        await supabase.storage.from("rescue-photos").remove([input.storagePath]);
      }
      return { success: false, error: "Failed to create transport request. Please try again." };
    }
  } else {
    const { error: transportError } = await serviceClient
      .from("transport_requests")
      .insert({
        case_id: caseData.id,
        status: "OPEN",
      });

    if (transportError) {
      console.error("[report] Transport (open) failed:", transportError.message);
      await serviceClient.from("cases").delete().eq("id", caseData.id);
      if (input.storagePath) {
        await supabase.storage.from("rescue-photos").remove([input.storagePath]);
      }
      return { success: false, error: "Failed to create transport request. Please try again." };
    }
  }

  return { success: true, caseId: caseData.id };
}

// ============================================================
// Helpers
// ============================================================

function normalizeSeverity(severity: string): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  const upper = severity.toUpperCase();
  if (upper === "LOW" || upper === "MEDIUM" || upper === "HIGH" || upper === "CRITICAL") {
    return upper;
  }
  return "MEDIUM";
}

function buildDescription(input: SubmitReportInput): string {
  const parts: string[] = [];
  if (input.details.notes) parts.push(input.details.notes);
  if (input.details.visibleInjuries) parts.push(`Visible injuries: ${input.details.visibleInjuries}`);
  if (input.details.behaviour) parts.push(`Behaviour: ${input.details.behaviour}`);
  if (input.details.approximateAge) parts.push(`Approximate age: ${input.details.approximateAge}`);
  if (input.location.address) parts.push(`Location: ${input.location.address}`);
  return parts.join(". ") || "Rescue case reported.";
}

