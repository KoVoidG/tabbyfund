import { createClient } from "@/lib/supabase/server";

/** Admin dashboard stats from real DB counts */
export interface AdminStats {
  activeCases: number;
  activeFundraisers: number;
  totalDonations: number;
  catsRehomed: number;
  communityUsers: number;
  verifiedVets: number;
  pendingVets: number;
  closedCases: number;
  casesNeedingFoster: number;
  fundedOngoingTreatment: number;
  reportedAwaitingModeration: number;
}

/** A vet profile for the admin verification page */
export interface VetProfile {
  id: string;
  display_name: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  clinic_name: string | null;
  clinic_address: string | null;
  clinic_lat: number | null;
  clinic_lng: number | null;
}

export interface VetProfileWithStats extends VetProfile {
  casesHandled: number;
  fundsHandled: number;
}

export interface AdminCaseItem {
  id: string;
  photo_url: string;
  description: string;
  status: string;
  ai_severity: string | null;
  ai_condition: string | null;
  created_at: string;
  reporter: { display_name: string } | null;
  assigned_vet: { display_name: string; clinic_name: string | null } | null;
  funding: { goal: number; total_raised: number } | null;
}

export interface CommunityUserProfile {
  id: string;
  display_name: string;
  role: string;
  avatar_url: string | null;
  is_verified: boolean;
  created_at: string;
  lastActive: string;
  activity: {
    reports: number;
    successfulRescues: number;
    transports: number;
    fosters: number;
    donations: number;
    totalDonated: number;
    adoptions: number;
  };
}

export interface PlatformActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  caseId?: string;
  meta?: Record<string, unknown>;
}

/**
 * Get real admin dashboard stats.
 */
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  // Active cases (not terminal)
  const { count: activeCases } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .not("status", "in", '("ADOPTED","SHELTERED","REUNITED","CANCELLED","LOST_CONTACT","DECEASED")');

  // Closed cases (terminal/cancelled)
  const { count: closedCases } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .in("status", ["ADOPTED", "SHELTERED", "REUNITED", "CANCELLED", "LOST_CONTACT", "DECEASED"]);

  // Active fundraisers
  const { count: activeFundraisers } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .eq("status", "FUNDING_OPEN");

  // Total donations
  const { data: donationSum } = await supabase
    .from("donations")
    .select("amount")
    .in("status", ["HELD_IN_ESCROW", "RELEASED"]);

  const totalDonations = donationSum?.reduce((sum, d) => sum + Number(d.amount), 0) ?? 0;

  // Cats rehomed (adopted)
  const { count: catsRehomed } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .eq("status", "ADOPTED");

  // Community users
  const { count: communityUsers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "community");

  // Verified vets
  const { count: verifiedVets } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "vet")
    .eq("is_verified", true);

  // Pending vets
  const { count: pendingVets } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "vet")
    .eq("is_verified", false);

  // Cases needing foster
  const { count: casesNeedingFoster } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .in("status", ["TREATED", "FUNDS_RELEASED"]);

  // Fundraisers funded but treatment ongoing/not complete
  const { count: fundedOngoingTreatment } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .in("status", ["FUNDED", "IN_TREATMENT"]);

  // Reported cases awaiting moderation
  const { count: reportedAwaitingModeration } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .eq("status", "REPORTED");

  return {
    activeCases: activeCases ?? 0,
    activeFundraisers: activeFundraisers ?? 0,
    totalDonations,
    catsRehomed: catsRehomed ?? 0,
    communityUsers: communityUsers ?? 0,
    verifiedVets: verifiedVets ?? 0,
    pendingVets: pendingVets ?? 0,
    closedCases: closedCases ?? 0,
    casesNeedingFoster: casesNeedingFoster ?? 0,
    fundedOngoingTreatment: fundedOngoingTreatment ?? 0,
    reportedAwaitingModeration: reportedAwaitingModeration ?? 0,
  };
}

/**
 * Get pending vet profiles (role=vet, not verified).
 */
export async function getPendingVets(): Promise<VetProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, is_verified, created_at, updated_at, clinic_name, clinic_address, clinic_lat, clinic_lng")
    .eq("role", "vet")
    .eq("is_verified", false)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as VetProfile[];
}

/**
 * Get verified vet profiles.
 */
export async function getVerifiedVets(): Promise<VetProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, is_verified, created_at, updated_at, clinic_name, clinic_address, clinic_lat, clinic_lng")
    .eq("role", "vet")
    .eq("is_verified", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as VetProfile[];
}

/**
 * Get verified vet profiles with statistics.
 */
export async function getVerifiedVetsWithStats(): Promise<VetProfileWithStats[]> {
  const supabase = await createClient();
  const vets = await getVerifiedVets();

  if (vets.length === 0) return [];

  // Query vet_quotes to count cases handled
  const { data: quotes } = await supabase
    .from("vet_quotes")
    .select("vet_id, case_id");

  // Query donations to sum release amounts
  const { data: donations } = await supabase
    .from("donations")
    .select("case_id, amount")
    .in("status", ["HELD_IN_ESCROW", "RELEASED"]);

  const caseToDonationSum = new Map<string, number>();
  donations?.forEach((d) => {
    caseToDonationSum.set(d.case_id, (caseToDonationSum.get(d.case_id) || 0) + Number(d.amount));
  });

  const vetCases = new Map<string, Set<string>>();
  quotes?.forEach((q) => {
    if (!vetCases.has(q.vet_id)) vetCases.set(q.vet_id, new Set());
    vetCases.get(q.vet_id)!.add(q.case_id);
  });

  return vets.map((v) => {
    const cases = vetCases.get(v.id) || new Set<string>();
    let funds = 0;
    cases.forEach((caseId) => {
      funds += caseToDonationSum.get(caseId) || 0;
    });

    return {
      ...v,
      casesHandled: cases.size,
      fundsHandled: funds,
    };
  });
}

/**
 * Get all cases with detailed fields for Admin management.
 */
export async function getAdminCases(): Promise<AdminCaseItem[]> {
  const supabase = await createClient();

  const { data: cases, error } = await supabase
    .from("cases")
    .select(`
      id, photo_url, description, status,
      ai_severity, ai_condition, created_at,
      reporter:profiles!cases_reporter_id_fkey(display_name),
      assigned_vet:profiles!cases_assigned_vet_id_fkey(display_name, clinic_name)
    `)
    .order("created_at", { ascending: false });

  if (error || !cases) {
    console.error("[admin] Failed to fetch admin cases:", error?.message);
    return [];
  }

  // Fetch quotes and donations to compute funding goals/raised in memory
  const [
    { data: quotes },
    { data: donations }
  ] = await Promise.all([
    supabase.from("vet_quotes").select("case_id, quoted_amount"),
    supabase.from("donations").select("case_id, amount").in("status", ["HELD_IN_ESCROW", "RELEASED"])
  ]);

  const quoteMap = new Map<string, number>();
  quotes?.forEach((q) => quoteMap.set(q.case_id, Number(q.quoted_amount)));

  const donationMap = new Map<string, number>();
  donations?.forEach((d) => {
    donationMap.set(d.case_id, (donationMap.get(d.case_id) || 0) + Number(d.amount));
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (cases as any[]).map((c) => {
    const goal = quoteMap.get(c.id) || 0;
    const total_raised = donationMap.get(c.id) || 0;
    return {
      id: c.id,
      photo_url: c.photo_url,
      description: c.description,
      status: c.status,
      ai_severity: c.ai_severity,
      ai_condition: c.ai_condition,
      created_at: c.created_at,
      reporter: c.reporter,
      assigned_vet: c.assigned_vet,
      funding: goal > 0 ? { goal, total_raised } : null,
    };
  });
}

/**
 * Get all profiles with activity counts, sorted by last active event timestamp.
 * Filters out the currently authenticated admin if specified.
 */
export async function getCommunityUsers(currentAdminId?: string): Promise<CommunityUserProfile[]> {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("id, display_name, role, avatar_url, is_verified, created_at");

  if (currentAdminId) {
    query = query.neq("id", currentAdminId);
  }

  const { data: profiles, error: profilesError } = await query.order("created_at", {
    ascending: false,
  });

  if (profilesError || !profiles) return [];

  // Fetch activity tables and their timestamps
  const [
    { data: cases },
    { data: transports },
    { data: fosters },
    { data: donations },
    { data: adoptions },
    { data: quotes }
  ] = await Promise.all([
    supabase.from("cases").select("reporter_id, created_at, status"),
    supabase.from("transport_requests").select("claimed_by, claimed_at").not("claimed_by", "is", null),
    supabase.from("foster_records").select("caretaker_id, started_at"),
    supabase.from("donations").select("donor_id, created_at, amount").in("status", ["HELD_IN_ESCROW", "RELEASED"]),
    supabase.from("adoption_listings").select("matched_with, listed_at").not("matched_with", "is", null),
    supabase.from("vet_quotes").select("vet_id, quoted_at")
  ]);

  // Aggregate last active date for each profile
  const lastActiveMap = new Map<string, number>();

  const trackActivity = (id: string, dateStr: string | null) => {
    if (!id || !dateStr) return;
    const time = new Date(dateStr).getTime();
    const existing = lastActiveMap.get(id) || 0;
    if (time > existing) {
      lastActiveMap.set(id, time);
    }
  };

  cases?.forEach((c) => trackActivity(c.reporter_id, c.created_at));
  transports?.forEach((t) => trackActivity(t.claimed_by!, t.claimed_at));
  fosters?.forEach((f) => trackActivity(f.caretaker_id, f.started_at));
  donations?.forEach((d) => trackActivity(d.donor_id, d.created_at));
  adoptions?.forEach((a) => trackActivity(a.matched_with!, a.listed_at));
  quotes?.forEach((q) => trackActivity(q.vet_id, q.quoted_at));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countMap = (list: any[] | null, key: string) => {
    const counts: Record<string, number> = {};
    list?.forEach((item) => {
      const id = item[key];
      if (id) counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  };

  const caseCounts = countMap(cases, "reporter_id");
  const transportCounts = countMap(transports, "claimed_by");
  const fosterCounts = countMap(fosters, "caretaker_id");
  const donationCounts = countMap(donations, "donor_id");
  const adoptionCounts = countMap(adoptions, "matched_with");

  const successfulRescues: Record<string, number> = {};
  cases?.forEach((c) => {
    if (["ADOPTED", "SHELTERED", "REUNITED"].includes(c.status)) {
      successfulRescues[c.reporter_id] = (successfulRescues[c.reporter_id] || 0) + 1;
    }
  });

  const totalDonatedSums: Record<string, number> = {};
  donations?.forEach((d) => {
    totalDonatedSums[d.donor_id] = (totalDonatedSums[d.donor_id] || 0) + Number(d.amount);
  });

  const userProfiles = profiles.map((p) => {
    const activeTime = lastActiveMap.get(p.id);
    const lastActive = activeTime ? new Date(activeTime).toISOString() : p.created_at;

    return {
      id: p.id,
      display_name: p.display_name,
      role: p.role,
      avatar_url: p.avatar_url,
      is_verified: p.is_verified,
      created_at: p.created_at,
      lastActive,
      activity: {
        reports: caseCounts[p.id] || 0,
        successfulRescues: successfulRescues[p.id] || 0,
        transports: transportCounts[p.id] || 0,
        fosters: fosterCounts[p.id] || 0,
        donations: donationCounts[p.id] || 0,
        totalDonated: totalDonatedSums[p.id] || 0,
        adoptions: adoptionCounts[p.id] || 0,
      },
    };
  });

  // Sort by last active event descending
  userProfiles.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());

  return userProfiles;
}

/**
 * Get dynamic chronological platform activities (Audit Log)
 */
export async function getPlatformActivities(): Promise<PlatformActivityItem[]> {
  const supabase = await createClient();

  const [
    { data: newCases },
    { data: verifiedVets },
    { data: quotes },
    { data: donations },
    { data: statusHistory },
  ] = await Promise.all([
    supabase.from("cases").select("id, ai_condition, description, created_at").order("created_at", { ascending: false }).limit(20),
    supabase.from("profiles").select("id, display_name, updated_at").eq("role", "vet").eq("is_verified", true).order("updated_at", { ascending: false }).limit(20),
    supabase.from("vet_quotes").select("id, case_id, quoted_amount, quoted_at, profiles!vet_quotes_vet_id_fkey(display_name)").order("quoted_at", { ascending: false }).limit(20),
    supabase.from("donations").select("id, case_id, amount, created_at, profiles!donations_donor_id_fkey(display_name)").order("created_at", { ascending: false }).limit(20),
    supabase.from("case_status_history").select("id, case_id, previous_status, new_status, changed_at, cases(ai_condition)").order("changed_at", { ascending: false }).limit(30),
  ]);

  const items: PlatformActivityItem[] = [];

  newCases?.forEach((c) => {
    items.push({
      id: `case-${c.id}`,
      type: "rescue_reported",
      title: "Rescue Case Reported",
      description: `New report submitted: "${c.ai_condition || c.description.slice(0, 30)}"`,
      timestamp: c.created_at,
      caseId: c.id,
    });
  });

  verifiedVets?.forEach((v) => {
    items.push({
      id: `vet-${v.id}`,
      type: "vet_approved",
      title: "Veterinarian Verified",
      description: `Vet "${v.display_name}" has been approved and verified`,
      timestamp: v.updated_at,
    });
  });

  quotes?.forEach((q: unknown) => {
    const quote = q as { id: string; case_id: string; quoted_amount: number; quoted_at: string; profiles?: { display_name: string } };
    items.push({
      id: `quote-${quote.id}`,
      type: "quote_created",
      title: "Vet Quote Submitted",
      description: `Quote of ฿${quote.quoted_amount} submitted by "${quote.profiles?.display_name || 'Vet'}"`,
      timestamp: quote.quoted_at,
      caseId: quote.case_id,
    });
  });

  donations?.forEach((d: unknown) => {
    const donation = d as { id: string; case_id: string; amount: number; created_at: string; profiles?: { display_name: string } };
    items.push({
      id: `donation-${donation.id}`,
      type: "donation_received",
      title: "Donation Received",
      description: `฿${donation.amount} donated by "${donation.profiles?.display_name || 'Anonymous'}"`,
      timestamp: donation.created_at,
      caseId: donation.case_id,
    });
  });

  statusHistory?.forEach((s: unknown) => {
    const status = s as { id: string; case_id: string; previous_status: string; new_status: string; changed_at: string; cases?: { ai_condition: string | null } };
    let type = "status_change";
    let title = "Case Stage Transition";
    let description = `Case "${status.cases?.ai_condition || 'Rescue'}" transitioned to ${status.new_status}`;

    if (status.new_status === "FUNDED") {
      type = "funding_completed";
      title = "Funding Completed";
      description = `Case "${status.cases?.ai_condition || 'Rescue'}" is now fully funded!`;
    } else if (status.new_status === "TREATED") {
      type = "treatment_completed";
      title = "Treatment Completed";
      description = `Treatment completed for case "${status.cases?.ai_condition || 'Rescue'}"`;
    } else if (status.new_status === "IN_FOSTER") {
      type = "foster_assigned";
      title = "Foster Placed";
      description = `Case "${status.cases?.ai_condition || 'Rescue'}" is now placed with a foster caretaker`;
    } else if (status.new_status === "ADOPTED") {
      type = "adoption_completed";
      title = "Adoption Completed";
      description = `Case "${status.cases?.ai_condition || 'Rescue'}" has been successfully adopted!`;
    }

    items.push({
      id: `history-${status.id}`,
      type,
      title,
      description,
      timestamp: status.changed_at,
      caseId: status.case_id,
    });
  });

  // Sort descending by timestamp
  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return items.slice(0, 50);
}
