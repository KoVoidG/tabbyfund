-- Migration 010: Adoption workflow — vet/foster ownership split
--
-- Extends treatment_records with vet-owned adoption readiness fields.
-- Extends foster_records with foster-owned behavioural profile fields.
-- Does NOT drop existing adoption_listings columns (backward-compatible).
--
-- Workflow rule: a cat is publicly adoptable ONLY when:
--   treatment_records.ready_for_adoption = true
--   AND foster_records.behaviour_profile_complete = true
--   AND adoption_listings.status = 'OPEN'

-- ============================================================
-- 1. Treatment records — vet-owned adoption readiness
-- ============================================================

ALTER TABLE treatment_records
  ADD COLUMN vaccination_status text
    CHECK (vaccination_status IS NULL OR vaccination_status IN ('complete', 'partial', 'none')),
  ADD COLUMN is_neutered boolean NOT NULL DEFAULT false,
  ADD COLUMN special_needs text,
  ADD COLUMN ready_for_adoption boolean NOT NULL DEFAULT false,
  ADD COLUMN ready_for_adoption_at timestamptz;

-- ============================================================
-- 2. Foster records — foster-owned behavioural profile
-- ============================================================

ALTER TABLE foster_records
  ADD COLUMN personality text[] DEFAULT '{}',
  ADD COLUMN energy_level text
    CHECK (energy_level IS NULL OR energy_level IN ('low', 'medium', 'high')),
  ADD COLUMN good_with_children boolean,
  ADD COLUMN good_with_cats boolean,
  ADD COLUMN indoor_only boolean DEFAULT true,
  ADD COLUMN ideal_home text[] DEFAULT '{}',
  ADD COLUMN favourite_activities text[] DEFAULT '{}',
  ADD COLUMN observations text,
  ADD COLUMN foster_photos text[] DEFAULT '{}',
  ADD COLUMN behaviour_profile_complete boolean NOT NULL DEFAULT false;

-- ============================================================
-- 3. Partial indexes for adoption readiness queries
-- ============================================================

CREATE INDEX idx_treatment_ready_for_adoption
  ON treatment_records(case_id, ready_for_adoption)
  WHERE ready_for_adoption = true;

CREATE INDEX idx_foster_behaviour_complete
  ON foster_records(case_id, behaviour_profile_complete)
  WHERE behaviour_profile_complete = true;

-- ============================================================
-- 4. Public adoptable cats view
-- Only shows cats meeting all three adoption conditions.
-- ============================================================

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
  fr.indoor_only,
  fr.ideal_home,
  fr.favourite_activities,
  fr.observations,
  fr.foster_photos,
  fr.caretaker_id AS foster_caretaker_id
FROM adoption_listings al
JOIN treatment_records tr ON tr.case_id = al.case_id
JOIN foster_records fr ON fr.case_id = al.case_id AND fr.status = 'ACTIVE'
WHERE al.status = 'OPEN'
  AND tr.ready_for_adoption = true
  AND fr.behaviour_profile_complete = true;

-- Grant access to authenticated users
GRANT SELECT ON public_adoptable_cats TO authenticated;
