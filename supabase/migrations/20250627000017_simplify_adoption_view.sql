-- Migration 017: Revert/simplify public_adoptable_cats view to match simplified MVP behavioral profile
DROP VIEW IF EXISTS public_adoptable_cats;

CREATE VIEW public_adoptable_cats AS
SELECT
  al.id AS listing_id,
  al.case_id,
  al.description,
  al.personality AS listing_personality,
  al.medical_notes AS listing_medical_notes,
  al.matched_with,
  al.status AS listing_status,
  al.listed_at,
  -- Vet-owned medical data
  tr.vaccination_status,
  tr.is_neutered,
  tr.special_needs,
  tr.treatment_summary,
  tr.vet_id,
  -- Foster-owned behavioural data
  fr.personality AS foster_personality,
  fr.energy_level,
  fr.good_with_children,
  fr.good_with_cats,
  fr.good_with_dogs,
  fr.litter_trained,
  fr.indoor_only,
  fr.observations,
  fr.foster_photos,
  fr.caretaker_id AS foster_caretaker_id
FROM adoption_listings al
JOIN treatment_records tr ON tr.case_id = al.case_id
JOIN foster_records fr ON fr.case_id = al.case_id AND fr.status = 'ACTIVE'
WHERE al.status = 'OPEN'
  AND tr.ready_for_adoption = true
  AND fr.behaviour_profile_complete = true;

GRANT SELECT ON public_adoptable_cats TO authenticated;
