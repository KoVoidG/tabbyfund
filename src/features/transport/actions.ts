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
export async function deliverTransport(caseId: string): Promise<TransportActionResult> {
  const user = await requireAuth();
  const supabase = await createClient();

  // Verify the current user is the assigned transporter
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

  // Update transport status to DELIVERED
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

  // Advance case status to AT_VET using service_role
  // (RLS only allows reporter/vet/admin to update cases, not transporter)
  const { createServiceClient } = await import("@/lib/supabase/service");
  const serviceClient = createServiceClient();

  const { error: caseError } = await serviceClient
    .from("cases")
    .update({ status: "AT_VET" })
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
