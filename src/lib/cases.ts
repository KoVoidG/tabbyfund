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
  created_at: string;
  updated_at: string;
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
  } | null;
  foster: {
    caretaker_profile: { display_name: string } | null;
    started_at: string;
    observations: string | null;
    personality: string[] | null;
  } | null;
  adoption: {
    status: Enums<"adoption_status">;
    personality: string | null;
    medical_notes: string | null;
  } | null;
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

  // Filter out terminal statuses (view doesn't filter them)
  return ((data ?? []) as PublicCase[]).filter(
    (c) => c.status && !TERMINAL_STATUSES.includes(c.status)
  );
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

  const { data: caseData, error: caseError } = await caseReader
    .from("cases")
    .select(`
      id, photo_url, description, status,
      ai_severity, ai_condition, ai_confidence, ai_reasoning, ai_first_aid,
      fuzzed_lat, fuzzed_lng, created_at, updated_at,
      reporter:profiles!cases_reporter_id_fkey(display_name)
    `)
    .eq("id", id)
    .single();

  if (caseError || !caseData) return null;

  // All queries below use the authenticated client (RLS allows authenticated reads)

  // Fetch transport request
  const { data: transport } = await supabase
    .from("transport_requests")
    .select(`
      status, claimed_by,
      claimed_by_profile:profiles!transport_requests_claimed_by_fkey(display_name)
    `)
    .eq("case_id", id)
    .single();

  // Fetch vet quote
  const { data: vetQuote } = await supabase
    .from("vet_quotes")
    .select(`
      quoted_amount, notes,
      vet_profile:profiles!vet_quotes_vet_id_fkey(display_name)
    `)
    .eq("case_id", id)
    .single();

  // Fetch funding progress via RPC
  let funding: CaseDetail["funding"] = null;
  if (vetQuote) {
    const { data: fundingData } = await supabase
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
  const { data: treatment } = await supabase
    .from("treatment_records")
    .select(`
      treatment_summary, outcome, photo_urls,
      vet_profile:profiles!treatment_records_vet_id_fkey(display_name)
    `)
    .eq("case_id", id)
    .single();

  // Fetch foster record (most recent active one)
  const { data: foster } = await supabase
    .from("foster_records")
    .select(`
      started_at, observations, personality,
      caretaker_profile:profiles!foster_records_caretaker_id_fkey(display_name)
    `)
    .eq("case_id", id)
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch adoption listing
  const { data: adoption } = await supabase
    .from("adoption_listings")
    .select("status, personality, medical_notes")
    .eq("case_id", id)
    .single();

  return {
    id: caseData.id,
    photo_url: caseData.photo_url,
    description: caseData.description,
    status: caseData.status,
    ai_severity: caseData.ai_severity,
    ai_condition: caseData.ai_condition,
    ai_confidence: caseData.ai_confidence,
    ai_reasoning: caseData.ai_reasoning,
    ai_first_aid: caseData.ai_first_aid,
    fuzzed_lat: caseData.fuzzed_lat,
    fuzzed_lng: caseData.fuzzed_lng,
    created_at: caseData.created_at,
    updated_at: caseData.updated_at,
    reporter: caseData.reporter as { display_name: string } | null,
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
        }
      : null,
    foster: foster
      ? {
          caretaker_profile: foster.caretaker_profile as { display_name: string } | null,
          started_at: foster.started_at,
          observations: foster.observations,
          personality: foster.personality,
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
