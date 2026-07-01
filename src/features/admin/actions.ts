"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/supabase/auth-helpers";

export interface AdminActionResult {
  success: boolean;
  error?: string;
}

/**
 * Verify a vet — sets is_verified = true on their profile.
 * Only admin can perform this action.
 *
 * Uses the authenticated admin client (NOT service_role) because:
 * - The profiles UPDATE RLS allows admin (is_admin())
 * - The protect_profile_fields trigger checks is_admin() via auth.uid()
 * - Service_role has no auth.uid() context, so trigger would reject it
 */
export async function verifyVet(vetId: string): Promise<AdminActionResult> {
  await requireRole("admin");
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ is_verified: true })
    .eq("id", vetId)
    .eq("role", "vet");

  if (error) {
    console.error("[admin] Verify vet failed:", error.message);
    return { success: false, error: "Failed to verify vet. " + error.message };
  }

  revalidatePath("/admin/vets");
  revalidatePath("/admin");
  return { success: true };
}

/**
 * Reject a pending vet — downgrades role to community.
 * Only admin can perform this action.
 */
export async function rejectVet(vetId: string): Promise<AdminActionResult> {
  await requireRole("admin");
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role: "community", is_verified: false })
    .eq("id", vetId)
    .eq("role", "vet")
    .eq("is_verified", false);

  if (error) {
    console.error("[admin] Reject vet failed:", error.message);
    return { success: false, error: "Failed to reject vet. " + error.message };
  }

  revalidatePath("/admin/vets");
  revalidatePath("/admin");
  return { success: true };
}
