import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { redactLocationFromDescription } from "@/lib/cases";

export interface DashboardStats {
  catsReported: number;
  transportMissions: number;
  totalDonated: number;
  successfulAdoptions: number;
}

export interface DashboardTransportCase {
  id: string;
  photo: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  location: string;
  reportedAgo: string;
}

export interface DashboardFundraiser {
  id: string;
  title: string;
  location: string;
  goal: number;
  raised: number;
  donors: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

export interface DashboardTreatment {
  id: string;
  title: string;
  vet: string;
  outcome: "ONGOING" | "RECOVERED" | "DECEASED" | "REFERRED";
  lastUpdate: string;
  summary: string;
}

export interface DashboardAdoptableCat {
  id: string;
  photo: string;
  name: string;
  personality: string;
  age: string;
  status: "OPEN";
}

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

/**
 * Get personal dashboard stats for the current user.
 * Must match /profile stats exactly.
 */
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createClient();

  const { count: catsReported } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .eq("reporter_id", userId);

  const { count: transportMissions } = await supabase
    .from("transport_requests")
    .select("id", { count: "exact", head: true })
    .eq("claimed_by", userId);

  const { data: donationRows } = await supabase
    .from("donations")
    .select("amount")
    .eq("donor_id", userId);

  const totalDonated = donationRows?.reduce((sum, d) => sum + d.amount, 0) ?? 0;

  const { count: fosterCases } = await supabase
    .from("foster_records")
    .select("id", { count: "exact", head: true })
    .eq("caretaker_id", userId);

  return {
    catsReported: catsReported ?? 0,
    transportMissions: transportMissions ?? 0,
    totalDonated,
    successfulAdoptions: fosterCases ?? 0,
  };
}

/**
 * Get cases awaiting transport (max 5).
 * Uses service_role for cases read (community SELECT is restricted by RLS).
 */
export async function getCasesNeedingTransport(): Promise<DashboardTransportCase[]> {
  const { createServiceClient } = await import("@/lib/supabase/service");
  const caseReader = createServiceClient();

  const { data } = await caseReader
    .from("cases")
    .select("id, photo_url, description, ai_severity, fuzzed_lat, fuzzed_lng, created_at")
    .eq("status", "AWAITING_TRANSPORT")
    .order("created_at", { ascending: false })
    .limit(5);

  if (!data) return [];

  return data.map((c) => ({
    id: c.id,
    photo: c.photo_url,
    description: redactLocationFromDescription(c.description),
    severity: (c.ai_severity ?? "MEDIUM") as DashboardTransportCase["severity"],
    location: `${c.fuzzed_lat.toFixed(3)}°N, ${c.fuzzed_lng.toFixed(3)}°E`,
    reportedAgo: formatDistanceToNow(new Date(c.created_at), { addSuffix: true }),
  }));
}

/**
 * Get active fundraisers (FUNDING_OPEN cases with progress, max 6).
 * Uses service_role for cases read.
 */
export async function getActiveFundraisers(): Promise<DashboardFundraiser[]> {
  const supabase = await createClient();
  const { createServiceClient } = await import("@/lib/supabase/service");
  const caseReader = createServiceClient();

  const { data: cases } = await caseReader
    .from("cases")
    .select("id, description, ai_condition, ai_severity, fuzzed_lat, fuzzed_lng")
    .eq("status", "FUNDING_OPEN")
    .order("created_at", { ascending: false })
    .limit(6);

  if (!cases || cases.length === 0) return [];

  const results: DashboardFundraiser[] = [];
  for (const c of cases) {
    const { data: fundingData } = await supabase
      .rpc("get_funding_progress", { p_case_id: c.id });

    const f = fundingData?.[0];
    results.push({
      id: c.id,
      title: c.ai_condition ?? "Rescue Case",
      location: `${c.fuzzed_lat.toFixed(3)}°N, ${c.fuzzed_lng.toFixed(3)}°E`,
      goal: f?.goal ?? 0,
      raised: f?.total_raised ?? 0,
      donors: f?.donor_count ?? 0,
      severity: (c.ai_severity ?? "MEDIUM") as DashboardFundraiser["severity"],
    });
  }

  return results;
}

/**
 * Get recent treatment updates (max 4).
 * Uses service_role because the cases JOIN is blocked by RLS for community.
 */
export async function getTreatmentUpdates(): Promise<DashboardTreatment[]> {
  const { createServiceClient } = await import("@/lib/supabase/service");
  const reader = createServiceClient();

  const { data } = await reader
    .from("treatment_records")
    .select(`
      case_id, treatment_summary, outcome, updated_at,
      vet_profile:profiles!treatment_records_vet_id_fkey(display_name),
      cases:cases!treatment_records_case_id_fkey(ai_condition)
    `)
    .order("updated_at", { ascending: false })
    .limit(4);

  if (!data) return [];

  return data.map((t) => {
    const vetProfile = t.vet_profile as { display_name: string } | null;
    const caseInfo = t.cases as { ai_condition: string | null } | null;
    return {
      id: t.case_id,
      title: caseInfo?.ai_condition ?? "Treatment",
      vet: vetProfile?.display_name ?? "Vet",
      outcome: t.outcome as DashboardTreatment["outcome"],
      lastUpdate: formatDistanceToNow(new Date(t.updated_at), { addSuffix: true }),
      summary: t.treatment_summary,
    };
  });
}

/**
 * Get adoption-ready cats (max 4).
 * Uses service_role for the cases photo lookup.
 */
export async function getAdoptionReadyCats(): Promise<DashboardAdoptableCat[]> {
  const supabase = await createClient();
  const { createServiceClient } = await import("@/lib/supabase/service");
  const caseReader = createServiceClient();

  const { data } = await supabase
    .from("public_adoptable_cats")
    .select("case_id, foster_personality, listing_personality")
    .limit(4);

  if (!data || data.length === 0) return [];

  const caseIds = data.map((d) => d.case_id).filter(Boolean) as string[];
  const { data: cases } = await caseReader
    .from("cases")
    .select("id, photo_url")
    .in("id", caseIds);

  const photoMap = Object.fromEntries((cases ?? []).map((c) => [c.id, c.photo_url]));

  return data.map((d) => ({
    id: d.case_id ?? "",
    photo: photoMap[d.case_id ?? ""] ?? "https://placehold.co/300x200/F7F7FB/A788FA?text=Cat",
    name: d.listing_personality ?? "Rescue Cat",
    personality: (d.foster_personality ?? []).slice(0, 3).join(", ") || "Friendly",
    age: "Unknown",
    status: "OPEN" as const,
  }));
}

/**
 * Get recent notifications for the current user (max 5).
 */
export async function getRecentNotifications(): Promise<DashboardNotification[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("notifications")
    .select("id, title, message, is_read, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (!data) return [];

  return data.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    time: formatDistanceToNow(new Date(n.created_at), { addSuffix: true }),
    read: n.is_read,
  }));
}
