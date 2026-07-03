"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/auth-helpers";

export interface DonationActionResult {
  success: boolean;
  error?: string;
}

/**
 * Submit a donation for a case.
 *
 * Requirements:
 * - User must be authenticated
 * - Case must be in FUNDING_OPEN status
 * - Amount must be positive
 * - Donation status is HELD_IN_ESCROW (RLS enforces this)
 *
 * Side effects:
 * - Inserts donations row with status = HELD_IN_ESCROW
 * - If total funding >= goal, advances case status to FUNDED
 * - Revalidates related pages
 */
export async function submitDonation(
  caseId: string,
  amount: number
): Promise<DonationActionResult> {
  const user = await requireAuth();
  const supabase = await createClient();

  // Validate amount
  if (!amount || amount <= 0) {
    return { success: false, error: "Donation amount must be greater than zero." };
  }
  if (amount > 1000000) {
    return { success: false, error: "Maximum donation amount is ฿1,000,000." };
  }

  // Verify case is in a fundable status
  // Use service_role for case read — community users can't SELECT arbitrary cases via RLS
  const { createServiceClient } = await import("@/lib/supabase/service");
  const caseReader = createServiceClient();

  const { data: caseData, error: caseError } = await caseReader
    .from("cases")
    .select("id, status")
    .eq("id", caseId)
    .single();

  if (caseError || !caseData) {
    return { success: false, error: "Case not found." };
  }

  // Check if case is in a terminal or cancelled status
  const TERMINAL_STATUSES = ["ADOPTED", "SHELTERED", "REUNITED", "CANCELLED", "LOST_CONTACT", "DECEASED"];
  if (TERMINAL_STATUSES.includes(caseData.status)) {
    return { success: false, error: "This case is closed and no longer accepting donations." };
  }

  // Check if a quote exists (which means the case has reached the quote/funding open stage)
  const { data: quote } = await caseReader
    .from("vet_quotes")
    .select("id")
    .eq("case_id", caseId)
    .maybeSingle();

  if (!quote) {
    return { success: false, error: "This case is not currently accepting donations (awaiting vet quote)." };
  }

  // Check if funding is already complete and validate remaining amount
  const { data: initialFundingCheck } = await caseReader
    .rpc("get_funding_progress", { p_case_id: caseId });

  if (initialFundingCheck && initialFundingCheck.length > 0) {
    const funding = initialFundingCheck[0];
    const quotedAmount = funding.goal;
    const currentFunding = funding.total_raised;
    const remainingAmount = quotedAmount - currentFunding;

    if (remainingAmount <= 0) {
      return { success: false, error: "This case has already reached its funding goal." };
    }

    if (amount > remainingAmount) {
      return {
        success: false,
        error: `Only ฿${remainingAmount} is still needed for this case. Please enter an amount less than or equal to the remaining amount.`,
      };
    }
  }

  // Insert donation with HELD_IN_ESCROW status
  const { error: insertError } = await supabase
    .from("donations")
    .insert({
      case_id: caseId,
      donor_id: user.id,
      amount,
      status: "HELD_IN_ESCROW",
    });

  if (insertError) {
    console.error("[donation] Insert failed:", insertError.message);
    return { success: false, error: "Failed to process donation. Please try again." };
  }

  // Check if funding is now complete — automatic system transition
  const { data: fundingData } = await supabase
    .rpc("get_funding_progress", { p_case_id: caseId });

  if (fundingData && fundingData.length > 0 && fundingData[0].is_fully_funded) {
    // Use service_role for status update — this is an automatic system transition
    // based on RPC result, not user input. Normal RLS may block non-reporter/transporter.
    const { createServiceClient } = await import("@/lib/supabase/service");
    const serviceClient = createServiceClient();
    await serviceClient
      .from("cases")
      .update({ status: "FUNDED" })
      .eq("id", caseId)
      .eq("status", "FUNDING_OPEN");
  }

  // Revalidate pages
  revalidatePath(`/cases/${caseId}`);
  revalidatePath("/cases");
  revalidatePath("/donate");
  revalidatePath("/dashboard");

  return { success: true };
}
