import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";

/** A vet case for the dashboard/list — combines case data with vet-relevant status */
export interface VetCaseRow {
  id: string;
  photo_url: string;
  description: string;
  status: Enums<"case_status">;
  ai_severity: Enums<"ai_severity"> | null;
  ai_condition: string | null;
  ai_confidence: number | null;
  ai_reasoning: string | null;
  ai_first_aid: string[] | null;
  fuzzed_lat: number;
  fuzzed_lng: number;
  created_at: string;
  reporter: { display_name: string } | null;
  /** Vet-specific status derived from case status */
  vetStatus: "waiting" | "quoted" | "in_treatment" | "completed";
}

/**
 * Map a case_status to a simplified vet workflow status.
 */
function toVetStatus(status: Enums<"case_status">): VetCaseRow["vetStatus"] {
  switch (status) {
    case "AT_VET":
      return "waiting";
    case "QUOTED":
    case "FUNDING_OPEN":
    case "FUNDED":
      return "quoted";
    case "IN_TREATMENT":
      return "in_treatment";
    case "TREATED":
    case "FUNDS_RELEASED":
    case "IN_FOSTER":
    case "ADOPTED":
    case "SHELTERED":
    case "REUNITED":
      return "completed";
    default:
      return "waiting";
  }
}

/**
 * Get all cases relevant to the current vet.
 *
 * A case is relevant to a vet if:
 * - It has status AT_VET (waiting for any vet to examine), OR
 * - The vet has submitted a quote for it (vet_quotes.vet_id = current user)
 */
export async function getVetCases(vetId: string): Promise<VetCaseRow[]> {
  const supabase = await createClient();

  // Get cases at vet (available for quoting)
  const { data: atVetCases } = await supabase
    .from("cases")
    .select(`
      id, photo_url, description, status,
      ai_severity, ai_condition, ai_confidence, ai_reasoning, ai_first_aid,
      fuzzed_lat, fuzzed_lng, created_at,
      reporter:profiles!cases_reporter_id_fkey(display_name)
    `)
    .eq("status", "AT_VET")
    .order("created_at", { ascending: false });

  // Get cases this vet has quoted (any status beyond AT_VET)
  const { data: quotedCaseIds } = await supabase
    .from("vet_quotes")
    .select("case_id")
    .eq("vet_id", vetId);

  const myQuotedIds = (quotedCaseIds ?? []).map((q) => q.case_id);

  let myCases: typeof atVetCases = [];
  if (myQuotedIds.length > 0) {
    const { data } = await supabase
      .from("cases")
      .select(`
        id, photo_url, description, status,
        ai_severity, ai_condition, ai_confidence, ai_reasoning, ai_first_aid,
        fuzzed_lat, fuzzed_lng, created_at,
        reporter:profiles!cases_reporter_id_fkey(display_name)
      `)
      .in("id", myQuotedIds)
      .neq("status", "AT_VET")
      .order("created_at", { ascending: false });
    myCases = data;
  }

  // Combine and deduplicate
  const allCases = [...(atVetCases ?? []), ...(myCases ?? [])];
  const seen = new Set<string>();
  const unique = allCases.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  return unique.map((c) => ({
    id: c.id,
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
    created_at: c.created_at,
    reporter: c.reporter as { display_name: string } | null,
    vetStatus: toVetStatus(c.status),
  }));
}

/**
 * Get vet dashboard stats.
 */
export async function getVetStats(vetId: string) {
  const cases = await getVetCases(vetId);
  return {
    waiting: cases.filter((c) => c.vetStatus === "waiting").length,
    inTreatment: cases.filter((c) => c.vetStatus === "in_treatment").length,
    quotesSent: cases.filter((c) => c.vetStatus === "quoted" || c.vetStatus === "in_treatment" || c.vetStatus === "completed").length,
    completedToday: 0, // Would need timestamp comparison for real "today" count
  };
}
