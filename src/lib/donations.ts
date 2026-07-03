import { createClient } from "@/lib/supabase/server";

/** A case with active funding — for the /donate page */
export interface FundingCase {
  id: string;
  photo_url: string;
  description: string;
  ai_condition: string | null;
  ai_severity: string | null;
  fuzzed_lat: number;
  fuzzed_lng: number;
  created_at: string;
  goal: number;
  raised: number;
  donors: number;
}

/**
 * Get all cases that are currently accepting donations (FUNDING_OPEN).
 * Uses service_role for cases read (RLS restricts community SELECT).
 * Only public-safe fields selected — no precise coordinates.
 */
export async function getFundingCases(): Promise<FundingCase[]> {
  const supabase = await createClient();
  const { createServiceClient } = await import("@/lib/supabase/service");
  const caseReader = createServiceClient();

  // Use service_role for cases (restrictive SELECT RLS)
  // Fetch cases that reached FUNDING_OPEN and are not terminal/cancelled
  const { data: cases, error } = await caseReader
    .from("cases")
    .select("id, photo_url, description, ai_condition, ai_severity, fuzzed_lat, fuzzed_lng, created_at")
    .in("status", ["FUNDING_OPEN", "FUNDED", "IN_TREATMENT", "TREATED", "FUNDS_RELEASED", "IN_FOSTER"])
    .order("created_at", { ascending: false });

  if (error || !cases || cases.length === 0) {
    return [];
  }

  // get_funding_progress is SECURITY DEFINER — works with any client
  const results: FundingCase[] = [];
  for (const c of cases) {
    const { data: fundingData } = await supabase
      .rpc("get_funding_progress", { p_case_id: c.id });

    const funding = fundingData?.[0];
    const goal = funding?.goal ?? 0;
    const raised = funding?.total_raised ?? 0;
    const isFullyFunded = funding?.is_fully_funded ?? (goal > 0 && raised >= goal);

    // Skip cases that have reached 100% funding
    if (isFullyFunded) {
      continue;
    }

    results.push({
      id: c.id,
      photo_url: c.photo_url,
      description: c.description,
      ai_condition: c.ai_condition,
      ai_severity: c.ai_severity,
      fuzzed_lat: c.fuzzed_lat,
      fuzzed_lng: c.fuzzed_lng,
      created_at: c.created_at,
      goal: goal,
      raised: raised,
      donors: funding?.donor_count ?? 0,
    });
  }

  return results;
}
