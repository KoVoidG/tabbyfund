import { createClient } from "@/lib/supabase/server";

/** An adoptable cat from the public_adoptable_cats view + case photo */
export interface AdoptableCatRow {
  id: string; // listing_id
  caseId: string;
  photoUrl: string;
  description: string | null;
  // Medical (vet-owned)
  treatmentSummary: string | null;
  vaccinationStatus: string | null;
  isNeutered: boolean | null;
  specialNeeds: string | null;
  vetId: string | null;
  // Behavioural (foster-owned)
  personality: string[] | null;
  energyLevel: string | null;
  goodWithChildren: boolean | null;
  goodWithCats: boolean | null;
  goodWithDogs: boolean | null;
  litterTrained: boolean | null;
  indoorOnly: boolean | null;
  observations: string | null;
  fosterPhotos: string[] | null;
  fosterCaretakerId: string | null;
  // Listing
  listingPersonality: string | null;
  listingMedicalNotes: string | null;
  listingStatus: string | null;
  listedAt: string | null;
  matchedWith: string | null;
}

/**
 * Get all publicly adoptable cats.
 * Uses the public_adoptable_cats view which enforces:
 * - treatment_records.ready_for_adoption = true
 * - foster_records.behaviour_profile_complete = true
 * - adoption_listings.status = 'OPEN'
 */
export async function getAdoptableCats(): Promise<AdoptableCatRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("public_adoptable_cats")
    .select("*");

  if (error || !data) {
    console.error("[adoption] Failed to fetch adoptable cats:", error?.message);
    return [];
  }

  // Also fetch the case photo_url for each cat
  const caseIds = data.map((d) => d.case_id).filter(Boolean) as string[];

  let casePhotos: Record<string, string> = {};
  if (caseIds.length > 0) {
    const { data: cases } = await supabase
      .from("cases")
      .select("id, photo_url")
      .in("id", caseIds);

    if (cases) {
      casePhotos = Object.fromEntries(cases.map((c) => [c.id, c.photo_url]));
    }
  }

  return data.map((d) => ({
    id: d.listing_id ?? d.case_id ?? "",
    caseId: d.case_id ?? "",
    photoUrl: casePhotos[d.case_id ?? ""] ?? "https://placehold.co/600x800/F7F7FB/A788FA?text=Cat",
    description: d.description,
    treatmentSummary: d.treatment_summary,
    vaccinationStatus: d.vaccination_status,
    isNeutered: d.is_neutered,
    specialNeeds: d.special_needs,
    vetId: d.vet_id,
    personality: d.foster_personality,
    energyLevel: d.energy_level,
    goodWithChildren: d.good_with_children,
    goodWithCats: d.good_with_cats,
    goodWithDogs: d.good_with_dogs,
    litterTrained: d.litter_trained,
    indoorOnly: d.indoor_only,
    observations: d.observations,
    fosterPhotos: d.foster_photos,
    fosterCaretakerId: d.foster_caretaker_id,
    listingPersonality: d.listing_personality,
    listingMedicalNotes: d.listing_medical_notes,
    listingStatus: d.listing_status,
    listedAt: d.listed_at,
    matchedWith: d.matched_with,
  }));
}

/**
 * Get a single adoptable cat by case_id for the detail page.
 */
export async function getAdoptableCatByCaseId(caseId: string): Promise<AdoptableCatRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("public_adoptable_cats")
    .select("*")
    .eq("case_id", caseId)
    .single();

  if (error || !data) return null;

  // Fetch photo
  const { data: caseData } = await supabase
    .from("cases")
    .select("photo_url")
    .eq("id", caseId)
    .single();

  return {
    id: data.listing_id ?? data.case_id ?? "",
    caseId: data.case_id ?? "",
    photoUrl: caseData?.photo_url ?? "https://placehold.co/600x800/F7F7FB/A788FA?text=Cat",
    description: data.description,
    treatmentSummary: data.treatment_summary,
    vaccinationStatus: data.vaccination_status,
    isNeutered: data.is_neutered,
    specialNeeds: data.special_needs,
    vetId: data.vet_id,
    personality: data.foster_personality,
    energyLevel: data.energy_level,
    goodWithChildren: data.good_with_children,
    goodWithCats: data.good_with_cats,
    goodWithDogs: data.good_with_dogs,
    litterTrained: data.litter_trained,
    indoorOnly: data.indoor_only,
    observations: data.observations,
    fosterPhotos: data.foster_photos,
    fosterCaretakerId: data.foster_caretaker_id,
    listingPersonality: data.listing_personality,
    listingMedicalNotes: data.listing_medical_notes,
    listingStatus: data.listing_status,
    listedAt: data.listed_at,
    matchedWith: data.matched_with,
  };
}
