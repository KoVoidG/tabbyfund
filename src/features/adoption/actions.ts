"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAuth } from "@/lib/supabase/auth-helpers";

export interface AdoptionActionResult {
  success: boolean;
  error?: string;
}

/**
 * Completes the adoption process for a case.
 * - Updates active foster record status to ADOPTED and ends it.
 * - Updates adoption listing status to COMPLETED and matches it with the current user.
 * - Updates case status to ADOPTED (making it an inactive terminal status in the rescue feed).
 */
export async function adoptCat(caseId: string): Promise<AdoptionActionResult> {
  const user = await requireAuth();
  const supabase = await createClient();
  const serviceClient = createServiceClient();

  // Verify that the case exists
  const { data: caseData, error: caseError } = await supabase
    .from("cases")
    .select("id, status")
    .eq("id", caseId)
    .single();

  if (caseError || !caseData) {
    return { success: false, error: "Case not found." };
  }

  // Verify that treatment record shows ready_for_adoption = true
  const { data: treatmentRecord, error: treatmentError } = await supabase
    .from("treatment_records")
    .select("ready_for_adoption")
    .eq("case_id", caseId)
    .maybeSingle();

  if (treatmentError || !treatmentRecord || !treatmentRecord.ready_for_adoption) {
    return { success: false, error: "This cat is not ready for adoption." };
  }

  // Find active foster record
  const { data: fosterRecord } = await supabase
    .from("foster_records")
    .select("id, behaviour_profile_complete")
    .eq("case_id", caseId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (fosterRecord && !fosterRecord.behaviour_profile_complete) {
    return { success: false, error: "Behavioural profile is not complete." };
  }

  // Find adoption listing
  const { data: adoptionListing } = await supabase
    .from("adoption_listings")
    .select("id, status")
    .eq("case_id", caseId)
    .maybeSingle();

  if (!adoptionListing) {
    return { success: false, error: "Adoption listing not found for this case." };
  }

  if (adoptionListing.status !== "OPEN") {
    return { success: false, error: "Adoption listing is not open." };
  }

  const now = new Date().toISOString();

  // 1. Update the foster record status if it exists
  if (fosterRecord) {
    const { error: fosterError } = await serviceClient
      .from("foster_records")
      .update({
        status: "ADOPTED",
        ended_at: now,
      })
      .eq("id", fosterRecord.id);

    if (fosterError) {
      console.error("[adoption] Failed to update foster status:", fosterError.message);
      return { success: false, error: "Failed to update foster status." };
    }
  }

  // 2. Update the adoption listing status to COMPLETED
  const { error: listingError } = await serviceClient
    .from("adoption_listings")
    .update({
      status: "COMPLETED",
      matched_with: user.id,
    })
    .eq("id", adoptionListing.id);

  if (listingError) {
    console.error("[adoption] Failed to update adoption listing:", listingError.message);
    return { success: false, error: "Failed to complete adoption listing." };
  }

  // 3. Update the case status to ADOPTED
  const { error: caseUpdateError } = await serviceClient
    .from("cases")
    .update({ status: "ADOPTED" })
    .eq("id", caseId);

  if (caseUpdateError) {
    console.error("[adoption] Failed to update case status:", caseUpdateError.message);
    return { success: false, error: "Failed to finalize adoption status." };
  }

  revalidatePath(`/cases/${caseId}`);
  revalidatePath("/cases");
  revalidatePath("/adopt");
  revalidatePath("/dashboard");

  return { success: true };
}
