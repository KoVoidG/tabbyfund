"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { requireAuth } from "@/lib/supabase/auth-helpers";

export interface FosterActionResult {
  success: boolean;
  error?: string;
}

// ============================================================
// Start Foster (admin/system assigns a caretaker to a case)
// ============================================================

interface StartFosterInput {
  caseId: string;
}

/**
 * Start fostering a case — assigns the current user as caretaker.
 *
 * Uses service_role client because foster_records INSERT is admin-only via RLS.
 * The server action validates:
 * - User is authenticated
 * - Case is in TREATED or FUNDS_RELEASED status (ready for foster)
 * - No active foster record already exists for this case
 *
 * Side effects:
 * - Inserts foster_records row with status ACTIVE
 * - Advances case status to IN_FOSTER
 */
export async function startFoster(input: StartFosterInput): Promise<FosterActionResult> {
  const user = await requireAuth();
  const supabase = await createClient();
  const serviceClient = createServiceClient();

  // Verify case is in a fosterable status
  const { data: caseData, error: caseError } = await supabase
    .from("cases")
    .select("id, status")
    .eq("id", input.caseId)
    .single();

  if (caseError || !caseData) {
    return { success: false, error: "Case not found." };
  }

  if (!["TREATED", "FUNDS_RELEASED"].includes(caseData.status)) {
    return { success: false, error: "This case is not ready for foster care (requires treatment completed first)." };
  }

  // Enforce transporter priority logic
  const { data: transport } = await serviceClient
    .from("transport_requests")
    .select("claimed_by")
    .eq("case_id", input.caseId)
    .maybeSingle();

  if (transport && transport.claimed_by && transport.claimed_by !== user.id) {
    // Check if the transporter declined
    const { data: declined } = await serviceClient
      .from("foster_records")
      .select("id")
      .eq("case_id", input.caseId)
      .eq("caretaker_id", transport.claimed_by)
      .eq("status", "REASSIGNED")
      .maybeSingle();

    if (!declined) {
      return {
        success: false,
        error: "The assigned transporter has priority to foster. Please wait for them to accept or decline first.",
      };
    }
  }

  // Check for existing active foster record
  const { data: existing } = await supabase
    .from("foster_records")
    .select("id")
    .eq("case_id", input.caseId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (existing) {
    return { success: false, error: "This case already has an active foster caretaker." };
  }

  // Insert using service_role (bypasses admin-only RLS)
  const { error: insertError } = await serviceClient
    .from("foster_records")
    .insert({
      case_id: input.caseId,
      caretaker_id: user.id,
      status: "ACTIVE",
    });

  if (insertError) {
    console.error("[foster] Insert failed:", insertError.message);
    return { success: false, error: "Failed to start foster care. Please try again." };
  }

  // Advance case status to IN_FOSTER
  await serviceClient
    .from("cases")
    .update({ status: "IN_FOSTER" })
    .eq("id", input.caseId)
    .in("status", ["TREATED", "FUNDS_RELEASED"]);

  revalidatePath(`/cases/${input.caseId}`);
  revalidatePath("/cases");
  revalidatePath("/foster");
  revalidatePath("/volunteer");

  return { success: true };
}

// ============================================================
// Decline Foster (transporter declines caretaker role)
// ============================================================

export async function declineFoster(input: StartFosterInput): Promise<FosterActionResult> {
  const user = await requireAuth();
  const supabase = await createClient();
  const serviceClient = createServiceClient();

  // Verify transporter is indeed the current user
  const { data: transport } = await supabase
    .from("transport_requests")
    .select("claimed_by")
    .eq("case_id", input.caseId)
    .maybeSingle();

  if (!transport || transport.claimed_by !== user.id) {
    return { success: false, error: "Only the assigned transporter can decline the caretaker role." };
  }

  // Check if already declined
  const { data: alreadyDeclined } = await supabase
    .from("foster_records")
    .select("id")
    .eq("case_id", input.caseId)
    .eq("caretaker_id", user.id)
    .eq("status", "REASSIGNED")
    .maybeSingle();

  if (alreadyDeclined) {
    return { success: false, error: "You have already declined the caretaker role." };
  }

  // Insert a REASSIGNED foster record to mark that they declined
  const now = new Date().toISOString();
  const { error: insertError } = await serviceClient
    .from("foster_records")
    .insert({
      case_id: input.caseId,
      caretaker_id: user.id,
      status: "REASSIGNED",
      started_at: now,
      ended_at: now,
    });

  if (insertError) {
    console.error("[foster] Decline failed:", insertError.message);
    return { success: false, error: "Failed to decline the role." };
  }

  revalidatePath(`/cases/${input.caseId}`);
  revalidatePath("/cases");
  revalidatePath("/volunteer");

  return { success: true };
}

// ============================================================
// Update Behavioural Profile
// ============================================================

interface UpdateBehaviouralProfileInput {
  caseId: string;
  catName?: string;
  personality: string[];
  energyLevel: "low" | "medium" | "high";
  goodWithChildren: boolean | null;
  goodWithCats: boolean | null;
  goodWithDogs: boolean | null;
  litterTrained: boolean | null;
  indoorOnly: boolean;
  idealHome?: string[];
  favouriteActivities?: string[];
  observations: string;
  fosterPhotos?: string[];
  markComplete: boolean;
}

/**
 * Update the behavioural profile for a foster record.
 *
 * Uses service_role client because foster_records UPDATE is admin-only via RLS.
 * The server action validates:
 * - User is authenticated
 * - User is the caretaker of the active foster record for this case
 *
 * Side effects:
 * - Updates foster_records with behavioural profile fields
 * - If markComplete: sets behaviour_profile_complete = true
 */
export async function updateBehaviouralProfile(input: UpdateBehaviouralProfileInput): Promise<FosterActionResult> {
  const user = await requireAuth();
  const supabase = await createClient();
  const serviceClient = createServiceClient();

  // Verify user is the active caretaker
  const { data: fosterRecord, error: fetchError } = await supabase
    .from("foster_records")
    .select("id, caretaker_id")
    .eq("case_id", input.caseId)
    .eq("status", "ACTIVE")
    .single();

  if (fetchError || !fosterRecord) {
    return { success: false, error: "No active foster record found for this case." };
  }

  if (fosterRecord.caretaker_id !== user.id) {
    return { success: false, error: "Only the assigned foster caretaker can update this profile." };
  }

  // Validate personality has at least one entry if marking complete
  if (input.markComplete && input.personality.length === 0) {
    return { success: false, error: "Please select at least one personality trait." };
  }

  // Update using service_role
  const { error: updateError } = await serviceClient
    .from("foster_records")
    .update({
      cat_name: input.catName || null,
      personality: input.personality,
      energy_level: input.energyLevel,
      good_with_children: input.goodWithChildren,
      good_with_cats: input.goodWithCats,
      good_with_dogs: input.goodWithDogs,
      litter_trained: input.litterTrained,
      indoor_only: input.indoorOnly,
      ideal_home: input.idealHome || [],
      favourite_activities: input.favouriteActivities || [],
      observations: input.observations || null,
      foster_photos: input.fosterPhotos || [],
      behaviour_profile_complete: input.markComplete,
    })
    .eq("id", fosterRecord.id);

  if (updateError) {
    console.error("[foster] Profile update failed:", updateError.message);
    return { success: false, error: "Failed to save profile. Please try again." };
  }

  if (input.markComplete) {
    // Check if listing already exists
    const { data: existingListing } = await supabase
      .from("adoption_listings")
      .select("id")
      .eq("case_id", input.caseId)
      .maybeSingle();

    if (!existingListing) {
      const { error: listingError } = await serviceClient
        .from("adoption_listings")
        .insert({
          case_id: input.caseId,
          status: "OPEN",
        });
      if (listingError) {
        console.error("[foster] Failed to create adoption listing:", listingError.message);
      }
    } else {
      // If it exists, update its status to OPEN
      await serviceClient
        .from("adoption_listings")
        .update({ status: "OPEN" })
        .eq("case_id", input.caseId);
    }
  }

  revalidatePath(`/cases/${input.caseId}`);
  revalidatePath("/foster");
  revalidatePath("/adopt");

  return { success: true };
}
