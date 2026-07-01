import { createClient } from "@/lib/supabase/server";
import { differenceInDays } from "date-fns";

/** A foster record for the foster dashboard */
export interface FosterCaseRow {
  id: string;
  caseId: string;
  photoUrl: string;
  condition: string | null;
  days: number;
  status: string;
  profileComplete: boolean;
  startedAt: string;
}

/**
 * Get all foster records for the current user.
 */
export async function getMyFosterCases(userId: string): Promise<FosterCaseRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("foster_records")
    .select(`
      id, case_id, started_at, status, behaviour_profile_complete,
      cases:cases!foster_records_case_id_fkey(photo_url, ai_condition)
    `)
    .eq("caretaker_id", userId)
    .order("started_at", { ascending: false });

  if (error || !data) {
    console.error("[foster] Fetch failed:", error?.message);
    return [];
  }

  return data.map((r) => {
    const caseInfo = r.cases as { photo_url: string; ai_condition: string | null } | null;
    return {
      id: r.id,
      caseId: r.case_id,
      photoUrl: caseInfo?.photo_url ?? "https://placehold.co/200x200/F7F7FB/A788FA?text=Cat",
      condition: caseInfo?.ai_condition ?? null,
      days: differenceInDays(new Date(), new Date(r.started_at)),
      status: r.status,
      profileComplete: r.behaviour_profile_complete,
      startedAt: r.started_at,
    };
  });
}
