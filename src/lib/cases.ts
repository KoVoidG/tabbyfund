import { createClient } from "@/lib/supabase/server";
import type { Tables, Enums } from "@/types/database";

// ============================================================
// Types derived from database schema
// ============================================================

/** A case row from the public_cases view (safe for public display — no precise coords). */
export type PublicCase = NonNullable<Tables<"public_cases">>;

/** A full case row from the cases table (includes precise coords, requires auth). */
export type FullCase = Tables<"cases">;

/** Re-export enums for convenience */
export type CaseStatus = Enums<"case_status">;
export type AiSeverity = Enums<"ai_severity">;

/** Shape returned by getCaseDetail — case + related records */
export interface CaseDetail {
  id: string;
  reporter_id: string;
  photo_url: string;
  description: string;
  status: CaseStatus;
  ai_severity: AiSeverity | null;
  ai_condition: string | null;
  ai_confidence: number | null;
  ai_reasoning: string | null;
  ai_first_aid: string[] | null;
  fuzzed_lat: number;
  fuzzed_lng: number;
  precise_lat?: number | null;
  precise_lng?: number | null;
  created_at: string;
  updated_at: string;
  assigned_vet_id: string | null;
  assigned_vet: { display_name: string; clinic_name: string | null } | null;
  reporter: { display_name: string } | null;
  // Related records (may be null if not yet in that stage)
  transport: {
    status: Enums<"transport_status">;
    claimed_by: string | null;
    claimed_by_profile: { display_name: string } | null;
  } | null;
  vet_quote: {
    quoted_amount: number;
    notes: string | null;
    vet_profile: { display_name: string } | null;
  } | null;
  funding: {
    goal: number;
    total_raised: number;
    donor_count: number;
    is_fully_funded: boolean;
  } | null;
  treatment: {
    treatment_summary: string;
    outcome: Enums<"treatment_outcome">;
    vet_profile: { display_name: string } | null;
    photo_urls: string[] | null;
    ready_for_adoption: boolean;
  } | null;
  foster: {
    caretaker_profile: { display_name: string } | null;
    started_at: string;
    observations: string | null;
    personality: string[] | null;
    status: Enums<"foster_status">;
    caretaker_id: string;
    behaviour_profile_complete: boolean;
  } | null;
  adoption: {
    status: Enums<"adoption_status">;
    personality: string | null;
    medical_notes: string | null;
  } | null;
}

export interface ParsedAIReasoning {
  reasoning: string;
  urgency: string;
  estimatedRecovery: string;
  recommendedAction: string;
  recoveryConfidence: number;
}

/**
 * Helper to parse serialized JSON inside the ai_reasoning column.
 * Falls back to plain text parsing if the column contains legacy raw text.
 */
export function parseAIReasoning(rawReasoning: string | null): ParsedAIReasoning {
  if (!rawReasoning) {
    return {
      reasoning: "",
      urgency: "Monitor",
      estimatedRecovery: "Determined by vet",
      recommendedAction: "Monitor the cat and provide basic care.",
      recoveryConfidence: 50,
    };
  }

  try {
    if (rawReasoning.trim().startsWith("{")) {
      const parsed = JSON.parse(rawReasoning);
      return {
        reasoning:
          typeof parsed.reasoning === "string" && parsed.reasoning.trim()
            ? parsed.reasoning.trim()
            : "",
        urgency:
          typeof parsed.urgency === "string" && parsed.urgency.trim()
            ? parsed.urgency.trim()
            : "Monitor",
        estimatedRecovery:
          typeof parsed.estimatedRecovery === "string" && parsed.estimatedRecovery.trim()
            ? parsed.estimatedRecovery.trim()
            : "Determined by vet",
        recommendedAction:
          typeof parsed.recommendedAction === "string" && parsed.recommendedAction.trim()
            ? parsed.recommendedAction.trim()
            : "Monitor the cat and provide basic care.",
        recoveryConfidence:
          typeof parsed.recoveryConfidence === "number"
            ? parsed.recoveryConfidence
            : 50,
      };
    }
  } catch (e) {
    // Ignore JSON parse error and fallback
  }

  return {
    reasoning: rawReasoning,
    urgency: "Monitor",
    estimatedRecovery: "Determined by vet",
    recommendedAction: "Monitor the cat and provide basic care.",
    recoveryConfidence: 50,
  };
}


// ============================================================
// Query helpers
// ============================================================

/**
 * Terminal statuses that should not appear in the active rescue feed.
 */
const TERMINAL_STATUSES = ["ADOPTED", "SHELTERED", "REUNITED", "CANCELLED", "LOST_CONTACT", "DECEASED"];

/**
 * Get all active public cases for the rescue feed.
 * Uses the public_cases view (no precise coordinates exposed).
 * Excludes terminal/closed cases.
 * Ordered by newest first.
 */
export async function getPublicCases(): Promise<PublicCase[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("public_cases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[cases] Failed to fetch public cases:", error.message);
    return [];
  }

  return (data ?? []) as PublicCase[];
}

/**
 * Get a single case with all related data for the detail page.
 *
 * SECURITY NOTE: Uses service_role ONLY for the `cases` table read.
 * Reason: cases SELECT RLS restricts community users to own reported/transported
 * cases, but the case detail page must be viewable by all authenticated users.
 * Only public-safe fields are selected (fuzzed_lat/fuzzed_lng — NOT precise coords).
 *
 * All other tables (transport, quotes, treatment, foster, adoption) have
 * "authenticated users can read" policies, so the normal session client works.
 *
 * Returns null if the case doesn't exist.
 */
export async function getCaseDetail(id: string): Promise<CaseDetail | null> {
  const supabase = await createClient();

  // Service_role ONLY for cases table (restrictive SELECT RLS)
  // Allowlisted fields: id, photo_url, description, status, ai_*, fuzzed_lat, fuzzed_lng, created_at, updated_at
  // NEVER selects: precise_lat, precise_lng
  const { createServiceClient } = await import("@/lib/supabase/service");
  const caseReader = createServiceClient();

  const { data: caseData, error: caseError } = await (caseReader
    .from("cases")
    .select(`
      id, reporter_id, photo_url, description, status,
      ai_severity, ai_condition, ai_confidence, ai_reasoning, ai_first_aid,
      fuzzed_lat, fuzzed_lng, created_at, updated_at,
      assigned_vet_id,
      reporter:profiles!cases_reporter_id_fkey(display_name),
      assigned_vet:profiles!cases_assigned_vet_id_fkey(display_name, clinic_name)
    `) as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    .eq("id", id)
    .single();

  if (caseError || !caseData) return null;

  // All queries below use the service client caseReader to bypass profile RLS
  // so that transporter and foster caretaker names are visible to other users.

  // Fetch transport request
  const { data: transport } = await caseReader
    .from("transport_requests")
    .select(`
      status, claimed_by,
      claimed_by_profile:profiles!transport_requests_claimed_by_fkey(display_name)
    `)
    .eq("case_id", id)
    .maybeSingle();

  // Fetch vet quote
  const { data: vetQuote } = await caseReader
    .from("vet_quotes")
    .select(`
      quoted_amount, notes,
      vet_profile:profiles!vet_quotes_vet_id_fkey(display_name)
    `)
    .eq("case_id", id)
    .maybeSingle();

  // Fetch funding progress via RPC
  let funding: CaseDetail["funding"] = null;
  if (vetQuote) {
    const { data: fundingData } = await caseReader
      .rpc("get_funding_progress", { p_case_id: id });

    if (fundingData && fundingData.length > 0) {
      const f = fundingData[0];
      funding = {
          goal: f.goal,
          total_raised: f.total_raised,
          donor_count: f.donor_count,
          is_fully_funded: f.is_fully_funded,
      };
    }
  }

  // Fetch treatment record
  const { data: treatment } = await caseReader
    .from("treatment_records")
    .select(`
      treatment_summary, outcome, photo_urls, ready_for_adoption,
      vet_profile:profiles!treatment_records_vet_id_fkey(display_name)
    `)
    .eq("case_id", id)
    .maybeSingle();

  // Fetch foster record (most recent one, active or otherwise)
  const { data: foster } = await caseReader
    .from("foster_records")
    .select(`
      started_at, observations, personality, status, caretaker_id, behaviour_profile_complete,
      caretaker_profile:profiles!foster_records_caretaker_id_fkey(display_name)
    `)
    .eq("case_id", id)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Public adoption listing fields.
  // medical_notes are intentionally visible to authenticated users through RLS.
  // Do not use the service-role client here.
  const { data: adoption } = await supabase
    .from("adoption_listings")
    .select("status, personality, medical_notes")
    .eq("case_id", id)
    .maybeSingle();

  // Fetch precise coordinates using the authenticated client.
  // RLS will allow this ONLY if the user is the reporter, assigned transporter, verified vet, or admin.
  // Otherwise, it returns null or fails gracefully.
  const { data: preciseCoords } = await supabase
    .from("cases")
    .select("precise_lat, precise_lng")
    .eq("id", id)
    .maybeSingle();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = caseData as any;

  return {
    id: c.id,
    reporter_id: c.reporter_id,
    photo_url: c.photo_url,
    description: c.description,
    status: c.status,
    ai_severity: c.ai_severity,
    ai_condition: c.ai_condition,
    ai_confidence: c.ai_confidence,
    ai_reasoning: c.ai_reasoning,
    ai_first_aid: c.ai_first_aid,
    fuzzed_lat: c.fuzzed_lat,
    fuzzed_lng: c.fuzzed_lng,
    precise_lat: preciseCoords?.precise_lat ?? null,
    precise_lng: preciseCoords?.precise_lng ?? null,
    created_at: c.created_at,
    updated_at: c.updated_at,
    assigned_vet_id: c.assigned_vet_id ?? null,
    assigned_vet: c.assigned_vet ?? null,
    reporter: c.reporter as { display_name: string } | null,
    transport: transport
      ? {
          status: transport.status,
          claimed_by: transport.claimed_by,
          claimed_by_profile: transport.claimed_by_profile as { display_name: string } | null,
        }
      : null,
    vet_quote: vetQuote
      ? {
          quoted_amount: vetQuote.quoted_amount,
          notes: vetQuote.notes,
          vet_profile: vetQuote.vet_profile as { display_name: string } | null,
        }
      : null,
    funding,
    treatment: treatment
      ? {
          treatment_summary: treatment.treatment_summary,
          outcome: treatment.outcome,
          vet_profile: treatment.vet_profile as { display_name: string } | null,
          photo_urls: treatment.photo_urls,
          ready_for_adoption: treatment.ready_for_adoption,
        }
      : null,
    foster: foster
      ? {
          caretaker_profile: foster.caretaker_profile as { display_name: string } | null,
          started_at: foster.started_at,
          observations: foster.observations,
          personality: foster.personality,
          status: foster.status,
          caretaker_id: foster.caretaker_id,
          behaviour_profile_complete: foster.behaviour_profile_complete,
        }
      : null,
    adoption: adoption
      ? {
          status: adoption.status,
          personality: adoption.personality,
          medical_notes: adoption.medical_notes,
        }
      : null,
  };
}
