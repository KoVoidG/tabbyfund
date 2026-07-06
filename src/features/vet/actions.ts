"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/supabase/auth-helpers";

export interface VetActionResult {
  success: boolean;
  error?: string;
}

// ============================================================
// Submit Vet Quote
// ============================================================

interface SubmitQuoteInput {
  caseId: string;
  amount: number;
  notes: string;
}

/**
 * Submit a treatment quote for a case.
 *
 * Requirements:
 * - User must be a verified vet
 * - Case must not already have a quote (one quote per case)
 * - Amount must be positive
 *
 * Side effects:
 * - Inserts vet_quotes row
 * - Advances case status to QUOTED, then to FUNDING_OPEN
 */
export async function submitVetQuote(input: SubmitQuoteInput): Promise<VetActionResult> {
  const profile = await requireRole("vet", { requireVerified: true });
  const supabase = await createClient();

  // Validate
  if (!input.caseId) {
    return { success: false, error: "Case ID is required." };
  }
  if (!input.amount || input.amount <= 0) {
    return { success: false, error: "Quote amount must be greater than zero." };
  }
  if (!input.notes?.trim()) {
    return { success: false, error: "Treatment notes are required." };
  }

  // Validate assigned vet and case status
  const { data: caseData } = await supabase
    .from("cases")
    .select("assigned_vet_id, status")
    .eq("id", input.caseId)
    .single();

  if (!caseData) {
    return { success: false, error: "Case not found." };
  }
  if (caseData.assigned_vet_id !== profile.id) {
    return { success: false, error: "Only the assigned veterinarian can submit a quote." };
  }
  if (caseData.status !== "AT_VET") {
    return { success: false, error: "Quotes can only be submitted for cases in AT_VET status." };
  }

  // Check for existing quote (vet_quotes is one-to-one via unique constraint on case_id)
  const { data: existing } = await supabase
    .from("vet_quotes")
    .select("id")
    .eq("case_id", input.caseId)
    .single();

  if (existing) {
    return { success: false, error: "A quote already exists for this case." };
  }

  // Insert the quote
  const { error: insertError } = await supabase
    .from("vet_quotes")
    .insert({
      case_id: input.caseId,
      vet_id: profile.id,
      quoted_amount: input.amount,
      notes: input.notes.trim(),
    });

  if (insertError) {
    console.error("[vet] Quote insert failed:", insertError.message);
    if (insertError.message.includes("duplicate key")) {
      return { success: false, error: "A quote already exists for this case." };
    }
    return { success: false, error: "Failed to submit quote. Please try again." };
  }

  // Advance case status: AT_VET → QUOTED → FUNDING_OPEN
  // We go straight to FUNDING_OPEN since the quote opens funding
  await supabase
    .from("cases")
    .update({ status: "FUNDING_OPEN" })
    .eq("id", input.caseId)
    .in("status", ["AT_VET", "QUOTED"]);

  revalidatePath(`/cases/${input.caseId}`);
  revalidatePath("/vet/cases");
  revalidatePath("/vet");
  revalidatePath("/cases");

  return { success: true };
}

// ============================================================
// Create Treatment Record
// ============================================================

interface CreateTreatmentInput {
  caseId: string;
  treatmentSummary: string;
  outcome: "ONGOING" | "RECOVERED" | "DECEASED" | "REFERRED";
}

/**
 * Create or start a treatment record for a case.
 *
 * Requirements:
 * - User must be a verified vet
 * - Vet must have submitted the quote for this case (RLS enforces)
 * - Case must not already have a treatment record (one-to-one)
 *
 * Side effects:
 * - Inserts treatment_records row
 * - Advances case status to IN_TREATMENT
 */
export async function createTreatmentRecord(input: CreateTreatmentInput): Promise<VetActionResult> {
  const profile = await requireRole("vet", { requireVerified: true });
  const supabase = await createClient();

  if (!input.caseId) {
    return { success: false, error: "Case ID is required." };
  }
  if (!input.treatmentSummary?.trim()) {
    return { success: false, error: "Treatment summary is required." };
  }

  // Validate assigned vet
  const { data: caseData } = await supabase
    .from("cases")
    .select("assigned_vet_id")
    .eq("id", input.caseId)
    .single();

  if (!caseData || caseData.assigned_vet_id !== profile.id) {
    return { success: false, error: "Only the assigned veterinarian can start treatment." };
  }

  // Check if treatment record already exists
  const { data: existing } = await supabase
    .from("treatment_records")
    .select("id")
    .eq("case_id", input.caseId)
    .single();

  if (existing) {
    return { success: false, error: "A treatment record already exists for this case." };
  }

  // Insert
  const { error: insertError } = await supabase
    .from("treatment_records")
    .insert({
      case_id: input.caseId,
      vet_id: profile.id,
      treatment_summary: input.treatmentSummary.trim(),
      outcome: input.outcome,
    });

  if (insertError) {
    console.error("[vet] Treatment insert failed:", insertError.message);
    return { success: false, error: "Failed to create treatment record. Please try again." };
  }

  // Advance case status to IN_TREATMENT
  await supabase
    .from("cases")
    .update({ status: "IN_TREATMENT" })
    .eq("id", input.caseId)
    .in("status", ["FUNDED", "FUNDING_OPEN"]);

  revalidatePath(`/cases/${input.caseId}`);
  revalidatePath("/vet/cases");
  revalidatePath("/vet");

  return { success: true };
}

// ============================================================
// Update Treatment (add notes, change outcome)
// ============================================================

interface UpdateTreatmentInput {
  caseId: string;
  treatmentSummary: string;
  outcome: "ONGOING" | "RECOVERED" | "DECEASED" | "REFERRED";
}

/**
 * Update an existing treatment record summary/outcome.
 */
export async function updateTreatmentRecord(input: UpdateTreatmentInput): Promise<VetActionResult> {
  const profile = await requireRole("vet", { requireVerified: true });
  const supabase = await createClient();

  if (!input.treatmentSummary?.trim()) {
    return { success: false, error: "Treatment summary is required." };
  }

  // Validate assigned vet
  const { data: caseData } = await supabase
    .from("cases")
    .select("assigned_vet_id")
    .eq("id", input.caseId)
    .single();

  if (!caseData || caseData.assigned_vet_id !== profile.id) {
    return { success: false, error: "Only the assigned veterinarian can update treatment." };
  }

  const { error } = await supabase
    .from("treatment_records")
    .update({
      treatment_summary: input.treatmentSummary.trim(),
      outcome: input.outcome,
    })
    .eq("case_id", input.caseId);

  if (error) {
    console.error("[vet] Treatment update failed:", error.message);
    return { success: false, error: "Failed to update treatment. Please try again." };
  }

  revalidatePath(`/cases/${input.caseId}`);
  revalidatePath("/vet/cases");

  return { success: true };
}

// ============================================================
// Complete Treatment
// ============================================================

interface CompleteTreatmentInput {
  caseId: string;
  outcome: "RECOVERED" | "DECEASED";
  vaccinationStatus: string;
  isNeutered: boolean;
  specialNeeds: string;
  readyForAdoption: boolean;
  photoUrl?: string;
}

/**
 * Complete a treatment and optionally mark the cat as adoption-ready.
 *
 * Side effects:
 * - Updates treatment_records with final outcome, medical details
 * - Sets confirmed_at timestamp
 * - If readyForAdoption: sets ready_for_adoption = true, ready_for_adoption_at
 * - Advances case status to TREATED (or DECEASED)
 * - If outcome is RECOVERED and ready for adoption, case goes to IN_FOSTER next
 */
export async function completeTreatment(input: CompleteTreatmentInput): Promise<VetActionResult> {
  const profile = await requireRole("vet", { requireVerified: true });
  const supabase = await createClient();

  if (!input.caseId) {
    return { success: false, error: "Case ID is required." };
  }

  // Validate outcome
  if (!["RECOVERED", "DECEASED"].includes(input.outcome)) {
    return { success: false, error: "Invalid treatment outcome. Only Recovered or Deceased are supported." };
  }

  // Validate assigned vet
  const { data: caseData } = await supabase
    .from("cases")
    .select("assigned_vet_id")
    .eq("id", input.caseId)
    .single();

  if (!caseData || caseData.assigned_vet_id !== profile.id) {
    return { success: false, error: "Only the assigned veterinarian can complete this treatment." };
  }

  const now = new Date().toISOString();

  // Update treatment record
  const updateData = {
    outcome: input.outcome,
    vaccination_status: input.vaccinationStatus || null,
    is_neutered: input.isNeutered,
    special_needs: input.specialNeeds || null,
    ready_for_adoption: input.readyForAdoption,
    ready_for_adoption_at: input.readyForAdoption ? now : null,
    confirmed_at: now,
    ...(input.photoUrl ? { photo_urls: [input.photoUrl] } : {}),
  };

  const { error: updateError } = await supabase
    .from("treatment_records")
    .update(updateData)
    .eq("case_id", input.caseId);

  if (updateError) {
    console.error("[vet] Treatment completion failed:", updateError.message);
    return { success: false, error: "Failed to complete treatment. Please try again." };
  }

  // Advance case status
  let newStatus: "TREATED" | "DECEASED" | "SHELTERED";
  if (input.outcome === "DECEASED") {
    newStatus = "DECEASED";
  } else if (input.outcome === "RECOVERED" && !input.readyForAdoption) {
    newStatus = "SHELTERED";
  } else {
    newStatus = "TREATED";
  }

  await supabase
    .from("cases")
    .update({ status: newStatus })
    .eq("id", input.caseId);

  // Fetch transporter for this case to send them a priority notification
  const { data: transport } = await supabase
    .from("transport_requests")
    .select("claimed_by")
    .eq("case_id", input.caseId)
    .maybeSingle();

  if (transport && transport.claimed_by && input.outcome === "RECOVERED" && input.readyForAdoption) {
    const { createServiceClient } = await import("@/lib/supabase/service");
    const serviceClient = createServiceClient();
    await serviceClient
      .from("notifications")
      .insert({
        user_id: transport.claimed_by,
        title: "Foster caretaker priority role",
        message: "The cat you transported has completed treatment. As the transporter, you have priority to foster them.",
        type: "TREATMENT_COMPLETED",
        is_read: false,
      });
  }

  // If vet approved for adoption and recovered, create an adoption listing (CLOSED initially)
  if (input.readyForAdoption && input.outcome === "RECOVERED") {
    const { error: listingError } = await supabase
      .from("adoption_listings")
      .insert({
        case_id: input.caseId,
        status: "CLOSED",
      });

    if (listingError) {
      console.error("[vet] Adoption listing creation failed:", listingError.message);
    }
  }

  revalidatePath(`/cases/${input.caseId}`);
  revalidatePath("/vet/cases");
  revalidatePath("/vet");
  revalidatePath("/cases");
  revalidatePath("/adopt");

  return { success: true };
}
