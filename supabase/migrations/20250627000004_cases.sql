-- Migration 004: Cases table, status history, and public view
-- The central entity. One case = one rescued cat.
-- Precise coordinates are restricted; public access uses the public_cases view.

-- ============================================================
-- 1. Cases table
-- ============================================================

CREATE TABLE cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES profiles(id),
  status case_status NOT NULL DEFAULT 'REPORTED',
  photo_url text NOT NULL,
  description text NOT NULL,
  -- Precise coordinates: restricted to reporter, assigned transporter, vet, admin
  precise_lat double precision NOT NULL,
  precise_lng double precision NOT NULL,
  -- Fuzzed coordinates: safe for public display via public_cases view
  fuzzed_lat double precision NOT NULL,
  fuzzed_lng double precision NOT NULL,
  -- AI triage results (nullable — AI may fail)
  ai_condition text,
  ai_severity ai_severity,
  ai_confidence smallint CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
  ai_reasoning text,
  ai_first_aid text[],
  ai_analyzed_at timestamptz,
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. Case status history (audit trail)
-- changed_by is nullable for system/service-role operations and seed scripts.
-- ============================================================

CREATE TABLE case_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  previous_status case_status,
  new_status case_status NOT NULL,
  changed_by uuid REFERENCES profiles(id),
  changed_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. Trigger: auto-record status changes
-- Developers should NEVER manually insert into case_status_history.
-- ============================================================

CREATE OR REPLACE FUNCTION record_case_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO case_status_history (case_id, previous_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================================
-- 4. RLS helper: owns_case()
-- ============================================================

CREATE OR REPLACE FUNCTION owns_case(p_case_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM cases
    WHERE id = p_case_id
    AND reporter_id = auth.uid()
  );
$$;

-- ============================================================
-- 5. Triggers
-- ============================================================

CREATE TRIGGER cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER cases_status_change
  AFTER UPDATE OF status ON cases
  FOR EACH ROW
  EXECUTE FUNCTION record_case_status_change();

-- ============================================================
-- 6. Public view: exposes ONLY fuzzed coordinates
--
-- security_barrier = true: prevents predicate pushdown that could
--   leak precise coordinates through timing or error side-channels.
-- security_invoker = true (PostgreSQL 15+): the view's underlying
--   query runs with the CALLING user's permissions, not the view
--   owner's. However, because we restrict direct cases SELECT to
--   reporter + admin only, ordinary users can't read cases through
--   this view either — so we also create a SECURITY DEFINER function
--   that the view calls to bypass RLS safely.
--
-- APPROACH: Use a SECURITY DEFINER function to serve public data.
-- This function executes as its owner (superuser/creator) which
-- bypasses RLS, but ONLY returns safe columns (fuzzed coords).
-- The view wraps this function for convenient querying.
-- ============================================================

CREATE OR REPLACE FUNCTION get_public_cases()
RETURNS TABLE (
  id uuid,
  status case_status,
  photo_url text,
  description text,
  fuzzed_lat double precision,
  fuzzed_lng double precision,
  ai_condition text,
  ai_severity ai_severity,
  ai_confidence smallint,
  ai_reasoning text,
  ai_first_aid text[],
  ai_analyzed_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id,
    c.status,
    c.photo_url,
    c.description,
    c.fuzzed_lat,
    c.fuzzed_lng,
    c.ai_condition,
    c.ai_severity,
    c.ai_confidence,
    c.ai_reasoning,
    c.ai_first_aid,
    c.ai_analyzed_at,
    c.created_at,
    c.updated_at
  FROM cases c;
$$;

CREATE VIEW public_cases
WITH (security_barrier = true)
AS
SELECT * FROM get_public_cases();

-- Grant access to the view for authenticated and anonymous users
GRANT SELECT ON public_cases TO authenticated, anon;

-- ============================================================
-- 7. Indexes
-- ============================================================

CREATE INDEX idx_cases_reporter_id ON cases(reporter_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_ai_severity ON cases(ai_severity);
CREATE INDEX idx_cases_created_at ON cases(created_at DESC);
CREATE INDEX idx_case_status_history_case_id ON case_status_history(case_id);

-- ============================================================
-- 8. Enable RLS
-- ============================================================

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_status_history ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 9. RLS Policies for cases
--
-- COORDINATE PRIVACY:
-- Direct SELECT on `cases` is restricted to reporter + admin.
-- This protects precise_lat/precise_lng at the RLS level.
-- Public feeds/listings use `public_cases` view (backed by
-- SECURITY DEFINER function that bypasses RLS but only returns
-- fuzzed coordinates).
-- Transporter/vet access will be added in later migrations
-- once those tables and helpers exist.
-- ============================================================

-- Reporter can read their own cases (full details including precise coords)
CREATE POLICY "Reporter can read own cases"
  ON cases FOR SELECT
  USING (reporter_id = auth.uid());

-- Admins can read all cases (full details)
CREATE POLICY "Admins can read all cases"
  ON cases FOR SELECT
  USING (is_admin());

-- Authenticated users can create reports
CREATE POLICY "Authenticated users can create cases"
  ON cases FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND reporter_id = auth.uid());

-- TODO:
-- Temporary MVP policy.
-- Replace is_verified_vet() with an assigned-vet/case-vet helper
-- once treatment assignment tables exist.
-- Current behavior allows any verified vet to update cases.

-- Reporter can update own case (early stages), vet or admin can update (later stages)
CREATE POLICY "Reporter vet or admin can update cases"
  ON cases FOR UPDATE
  USING (
    (reporter_id = auth.uid() AND status IN ('REPORTED', 'TRIAGED'))
    OR is_admin()
    OR is_verified_vet()
  )
  WITH CHECK (
    (reporter_id = auth.uid() AND status IN ('REPORTED', 'TRIAGED'))
    OR is_admin()
    OR is_verified_vet()
  );

-- Only admin can delete
CREATE POLICY "Only admin can delete cases"
  ON cases FOR DELETE
  USING (is_admin());

-- ============================================================
-- 10. RLS Policies for case_status_history
-- ============================================================

-- Authenticated users can read (for timeline display)
CREATE POLICY "Authenticated users can read status history"
  ON case_status_history FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- No manual inserts (trigger uses SECURITY DEFINER to bypass RLS)
CREATE POLICY "No manual inserts into status history"
  ON case_status_history FOR INSERT
  WITH CHECK (false);
