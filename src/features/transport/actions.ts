"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/auth-helpers";

export interface TransportActionResult {
  success: boolean;
  error?: string;
}

/**
 * Claim an open transport request for a case.
 *
 * Uses the `claim_transport` SECURITY DEFINER RPC which:
 * - Locks the row to prevent race conditions (FOR UPDATE SKIP LOCKED)
 * - Verifies transport is still OPEN
 * - Sets claimed_by, claimed_at, status = CLAIMED
 * - Advances case status from AWAITING_TRANSPORT to IN_TRANSIT
 *
 * @param caseId - The case whose transport to claim
 */
export async function claimTransport(caseId: string): Promise<TransportActionResult> {
  await requireAuth();
  const supabase = await createClient();

  const { error } = await supabase.rpc("claim_transport", {
    p_case_id: caseId,
  });

  if (error) {
    console.error("[transport] Claim failed:", error.message);

    // Provide user-friendly messages
    if (error.message.includes("no longer available")) {
      return { success: false, error: "This transport has already been claimed by another volunteer." };
    }
    if (error.message.includes("Authentication required")) {
      return { success: false, error: "You must be logged in to volunteer." };
    }
    return { success: false, error: "Failed to claim transport. Please try again." };
  }

  // Revalidate the case detail page to reflect the new status
  revalidatePath(`/cases/${caseId}`);
  revalidatePath("/cases");

  return { success: true };
}

/**
 * Mark a claimed transport as delivered.
 *
 * Only the assigned transporter (claimed_by = current user) can do this.
 * RLS on transport_requests enforces this:
 *   UPDATE ... USING (claimed_by = auth.uid() OR is_admin())
 *
 * Also advances the case status to AT_VET.
 *
 * @param caseId - The case whose transport to mark as delivered
 */
export async function deliverTransport(caseId: string, vetId: string): Promise<TransportActionResult> {
  const user = await requireAuth();
  const supabase = await createClient();

  if (!vetId) {
    return { success: false, error: "Destination clinic/vet is required." };
  }

  // 1. Verify the current user is the assigned transporter
  const { data: transport, error: fetchError } = await supabase
    .from("transport_requests")
    .select("id, status, claimed_by")
    .eq("case_id", caseId)
    .single();

  if (fetchError || !transport) {
    return { success: false, error: "Transport request not found." };
  }

  if (transport.claimed_by !== user.id) {
    return { success: false, error: "Only the assigned transporter can mark delivery." };
  }

  if (transport.status !== "CLAIMED") {
    return {
      success: false,
      error: transport.status === "DELIVERED"
        ? "This transport has already been marked as delivered."
        : "Transport must be claimed before marking as delivered.",
    };
  }

  // 2. Verify selected vet exists, role = 'vet', is_verified = true, and has clinic details
  // Note: we query using the service role client since profiles table RLS restricts
  // non-owner selects for general profiles.
  const { createServiceClient } = await import("@/lib/supabase/service");
  const serviceClient = createServiceClient();

  const { data: vetProfile, error: vetError } = await serviceClient
    .from("profiles")
    .select("id, role, is_verified, clinic_name, clinic_address")
    .eq("id", vetId)
    .single();

  if (vetError || !vetProfile) {
    return { success: false, error: "Selected clinic/vet profile not found." };
  }
  if (vetProfile.role !== "vet") {
    return { success: false, error: "Selected profile is not a veterinarian." };
  }
  if (!vetProfile.is_verified) {
    return { success: false, error: "Selected veterinarian clinic is not verified." };
  }
  if (!vetProfile.clinic_name || !vetProfile.clinic_address) {
    return { success: false, error: "Selected clinic is missing name or address." };
  }

  // 3. Update transport status to DELIVERED
  const { error: updateError } = await supabase
    .from("transport_requests")
    .update({
      status: "DELIVERED",
      delivered_at: new Date().toISOString(),
    })
    .eq("id", transport.id);

  if (updateError) {
    console.error("[transport] Delivery update failed:", updateError.message);
    return { success: false, error: "Failed to mark as delivered. Please try again." };
  }

  // 4. Advance case status to AT_VET and assign the vet using service_role
  const { error: caseError } = await serviceClient
    .from("cases")
    .update({
      status: "AT_VET" as const,
      assigned_vet_id: vetId,
    })
    .eq("id", caseId)
    .eq("status", "IN_TRANSIT");

  if (caseError) {
    console.error("[transport] Case status update failed:", caseError.message);
  }

  // Revalidate pages
  revalidatePath(`/cases/${caseId}`);
  revalidatePath("/cases");

  return { success: true };
}
