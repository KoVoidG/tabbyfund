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
  };
  /** Location data */
  location: {
    lat: number;
    lng: number;
    fuzzedLat: number;
    fuzzedLng: number;
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

/**
 * Server action: Submit a rescue report.
 *
 * Photo is already uploaded from the client to Supabase Storage.
 * This action only receives the photo URL (small string), not file data.
 *
 * Flow:
 * 1. Authenticate user
 * 2. Validate photo URL exists
 * 3. Insert case row (using authenticated client — RLS validates reporter_id)
 * 4. Create transport_requests row using service_role
 * 5. Return the new case ID
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

  // 3. Insert case row using authenticated client (RLS validates reporter_id = auth.uid())
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
      fuzzed_lat: input.location.fuzzedLat,
      fuzzed_lng: input.location.fuzzedLng,
      ai_severity: severity,
      ai_condition: input.aiResult.condition,
      ai_confidence: input.aiResult.confidence,
      ai_reasoning: input.aiResult.reasoning,
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

  // 4. Create transport request using service_role (RLS is admin-only for INSERT)
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
