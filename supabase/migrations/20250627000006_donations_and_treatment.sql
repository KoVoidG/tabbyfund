-- Migration 006: Donations and treatment records
-- Donations: simulated crowdfunding with escrow.
-- Treatment records: vet treatment details and outcome confirmation.
-- Includes automatic escrow release trigger.

-- ============================================================
-- 1. Donations table
--
-- No updated_at column: donations are immutable after creation.
-- The only mutation is the escrow release (status + released_at),
-- which is handled atomically by a trigger — not by user UPDATEs.
-- ============================================================

CREATE TABLE donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  donor_id uuid NOT NULL REFERENCES profiles(id),
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  status donation_status NOT NULL DEFAULT 'HELD_IN_ESCROW',
  created_at timestamptz NOT NULL DEFAULT now(),
  released_at timestamptz
);

-- ============================================================
-- 2. Treatment records table
-- ============================================================

CREATE TABLE treatment_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL UNIQUE REFERENCES cases(id) ON DELETE CASCADE,
  vet_id uuid NOT NULL REFERENCES profiles(id),
  treatment_summary text NOT NULL,
  outcome treatment_outcome NOT NULL DEFAULT 'ONGOING',
  photo_urls text[] DEFAULT '{}',
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at for treatment_records
CREATE TRIGGER treatment_records_updated_at
  BEFORE UPDATE ON treatment_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 3. Automatic escrow release trigger
--
-- When a treatment_record is inserted or updated with:
--   outcome = 'RECOVERED' AND confirmed_at IS NOT NULL
-- this trigger atomically:
--   1. Releases all HELD_IN_ESCROW donations for that case
--   2. Updates the case status to FUNDS_RELEASED
--
-- Accepts case status from either IN_TREATMENT or TREATED for reliability.
-- ============================================================

CREATE OR REPLACE FUNCTION release_escrow_on_treatment_complete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_should_release boolean := false;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_should_release := (NEW.outcome = 'RECOVERED' AND NEW.confirmed_at IS NOT NULL);
  ELSIF TG_OP = 'UPDATE' THEN
    v_should_release := (
      NEW.outcome = 'RECOVERED' AND NEW.confirmed_at IS NOT NULL
      AND (OLD.outcome IS DISTINCT FROM NEW.outcome OR OLD.confirmed_at IS NULL)
    );
  END IF;

  IF v_should_release THEN
    -- Release all held donations for this case
    UPDATE donations
    SET status = 'RELEASED', released_at = now()
    WHERE case_id = NEW.case_id
      AND status = 'HELD_IN_ESCROW';

    -- Advance case status to FUNDS_RELEASED (from either IN_TREATMENT or TREATED)
    UPDATE cases
    SET status = 'FUNDS_RELEASED'
    WHERE id = NEW.case_id
      AND status IN ('IN_TREATMENT', 'TREATED');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER treatment_escrow_release
  AFTER INSERT OR UPDATE ON treatment_records
  FOR EACH ROW
  EXECUTE FUNCTION release_escrow_on_treatment_complete();

-- ============================================================
-- 4. Indexes
-- ============================================================

CREATE INDEX idx_donations_case_id ON donations(case_id);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_case_status ON donations(case_id, status);
CREATE INDEX idx_treatment_records_vet_id ON treatment_records(vet_id);

-- ============================================================
-- 5. Enable RLS
-- ============================================================

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_records ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. RLS Policies: donations
--
-- PRIVACY APPROACH (MVP):
-- Donation rows (including donor_id) are readable by:
--   - The donor themselves (their own donation history)
--   - Admin (platform oversight)
-- For public funding progress display, use get_funding_progress().
-- ============================================================

-- Donors can read their own donations
CREATE POLICY "Donors can read own donations"
  ON donations FOR SELECT
  USING (donor_id = auth.uid());

-- Admin can read all donations
CREATE POLICY "Admin can read all donations"
  ON donations FOR SELECT
  USING (is_admin());

-- Authenticated users can create donations (with strict constraints)
CREATE POLICY "Authenticated users can donate"
  ON donations FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND donor_id = auth.uid()
    AND status = 'HELD_IN_ESCROW'
    AND released_at IS NULL
  );

-- No user updates (escrow release is via SECURITY DEFINER trigger)
-- Admin can update for edge cases (refunds, corrections)
CREATE POLICY "Admin can update donations"
  ON donations FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin only delete
CREATE POLICY "Only admin can delete donations"
  ON donations FOR DELETE
  USING (is_admin());

-- ============================================================
-- 7. Aggregate funding progress function (privacy-safe)
-- Returns total raised, donor count, and goal for a case.
-- Does NOT expose individual donor identities.
-- Starts from cases so a row is always returned even without a quote.
-- ============================================================

CREATE OR REPLACE FUNCTION get_funding_progress(p_case_id uuid)
RETURNS TABLE (
  case_id uuid,
  goal numeric(10,2),
  total_raised numeric(10,2),
  donor_count bigint,
  is_fully_funded boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id AS case_id,
    COALESCE(q.quoted_amount, 0) AS goal,
    COALESCE(d.total, 0) AS total_raised,
    COALESCE(d.donors, 0) AS donor_count,
    COALESCE(q.quoted_amount, 0) > 0
      AND COALESCE(d.total, 0) >= q.quoted_amount AS is_fully_funded
  FROM cases c
  LEFT JOIN vet_quotes q ON q.case_id = c.id
  LEFT JOIN (
    SELECT
      don.case_id,
      SUM(don.amount) AS total,
      COUNT(DISTINCT don.donor_id) AS donors
    FROM donations don
    WHERE don.status IN ('HELD_IN_ESCROW', 'RELEASED')
    GROUP BY don.case_id
  ) d ON d.case_id = c.id
  WHERE c.id = p_case_id;
$$;

-- ============================================================
-- 8. RLS Policies: treatment_records
--
-- INSERT is restricted to verified vets who have an existing quote
-- for the case (proves they are the assigned vet for that case).
-- ============================================================

-- Authenticated users can read (transparency — community follows progress)
CREATE POLICY "Authenticated users can read treatment records"
  ON treatment_records FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Verified vet can create a treatment record only for cases they quoted
CREATE POLICY "Verified vets can create treatment records"
  ON treatment_records FOR INSERT
  WITH CHECK (
    is_verified_vet()
    AND vet_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM vet_quotes
      WHERE vet_quotes.case_id = treatment_records.case_id
        AND vet_quotes.vet_id = auth.uid()
    )
  );

-- Owning vet or admin can update
CREATE POLICY "Vet or admin can update treatment records"
  ON treatment_records FOR UPDATE
  USING (vet_id = auth.uid() OR is_admin())
  WITH CHECK (vet_id = auth.uid() OR is_admin());

-- No deletion of treatment records (medical audit trail)
CREATE POLICY "No deletion of treatment records"
  ON treatment_records FOR DELETE
  USING (false);
