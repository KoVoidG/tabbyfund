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

  // Added payout / funding fields
  goal: number;
  totalRaised: number;
  percentFunded: number;
  escrowStatus: "Waiting for Funding" | "Funded, Waiting for Treatment Completion" | "Treatment Complete, Waiting for Funding" | "Released to Clinic/Vet";
  totalReleased: number;
  pendingEscrow: number;
  treatmentCompleted: boolean;
  assignedClinic: string | null;
  assignedTransporter: string | null;
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
 * A case is relevant to a vet if they are assigned to it (cases.assigned_vet_id = vetId).
 * Admins can see all cases that have a vet assigned.
 */
export async function getVetCases(vetId: string): Promise<VetCaseRow[]> {
  const { createServiceClient } = await import("@/lib/supabase/service");
  const serviceClient = createServiceClient();

  // Check if current user is an admin
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("role")
    .eq("id", vetId)
    .single();

  const isAdmin = profile?.role === "admin";

  let query = (serviceClient
    .from("cases") as any)
    .select(`
      id, photo_url, description, status,
      ai_severity, ai_condition, ai_confidence, ai_reasoning, ai_first_aid,
      fuzzed_lat, fuzzed_lng, created_at,
      reporter:profiles!cases_reporter_id_fkey(display_name),
      vet_quote:vet_quotes(quoted_amount),
      treatment:treatment_records(outcome, confirmed_at),
      donations(amount, status),
      assigned_vet:profiles!cases_assigned_vet_id_fkey(display_name, clinic_name),
      transport:transport_requests(claimed_by_profile:profiles!transport_requests_claimed_by_fkey(display_name))
    `)
    .order("created_at", { ascending: false });

  if (!isAdmin) {
    query = query.eq("assigned_vet_id", vetId);
  } else {
    // Admins can see all cases that have a vet assigned
    query = query.not("assigned_vet_id", "is", null);
  }

  const { data: casesData, error } = await query;

  if (error || !casesData) return [];

  return casesData.map((c: any) => {
    const goal = (c.vet_quote as any)?.quoted_amount ?? 0;
    
    // Sum donations with status HELD_IN_ESCROW or RELEASED
    const donationsList = (c.donations as any[]) ?? [];
    
    const totalReleased = donationsList
      .filter((d) => d.status === "RELEASED")
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const pendingEscrow = donationsList
      .filter((d) => d.status === "HELD_IN_ESCROW")
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const totalRaised = donationsList
      .filter((d) => d.status === "HELD_IN_ESCROW" || d.status === "RELEASED")
      .reduce((sum, d) => sum + Number(d.amount), 0);

    const percentFunded = goal > 0 ? Math.min(Math.round((totalRaised / goal) * 100), 100) : 0;

    const treatmentCompleted = !!(
      (c.treatment as any)?.outcome === "RECOVERED" &&
      (c.treatment as any)?.confirmed_at
    );

    let escrowStatus: VetCaseRow["escrowStatus"] = "Waiting for Funding";

    const hasFunds = goal > 0 && totalRaised >= goal;
    const isTreatmentDone = treatmentCompleted;

    if (goal > 0) {
      if (donationsList.some((d) => d.status === "RELEASED") || (hasFunds && isTreatmentDone)) {
        escrowStatus = "Released to Clinic/Vet";
      } else if (isTreatmentDone && !hasFunds) {
        escrowStatus = "Treatment Complete, Waiting for Funding";
      } else if (hasFunds && !isTreatmentDone) {
        escrowStatus = "Funded, Waiting for Treatment Completion";
      } else {
        escrowStatus = "Waiting for Funding";
      }
    } else {
      escrowStatus = "Waiting for Funding";
    }

    return {
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
      goal,
      totalRaised,
      percentFunded,
      escrowStatus,
      totalReleased,
      pendingEscrow,
      treatmentCompleted,
      assignedClinic: c.assigned_vet?.clinic_name ?? null,
      assignedTransporter: c.transport?.claimed_by_profile?.display_name ?? null,
    };
  });
}

/**
 * Get vet dashboard stats.
 */
export async function getVetStats(vetId: string) {
  const cases = await getVetCases(vetId);
  const waiting = cases.filter((c) => c.status === "AT_VET").length;
  const inTreatment = cases.filter((c) => c.status === "IN_TREATMENT").length;
  const completed = cases.filter((c) => c.treatmentCompleted).length;

  const releasedEarnings = cases.reduce((sum, c) => sum + c.totalReleased, 0);
  const pendingEscrow = cases.reduce((sum, c) => sum + c.pendingEscrow, 0);

  return {
    waiting,
    inTreatment,
    completed,
    releasedEarnings,
    pendingEscrow,
  };
}
