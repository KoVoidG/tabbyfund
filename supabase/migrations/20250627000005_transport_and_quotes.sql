-- Migration 005: Transport requests and veterinary quotes
-- Transport: allows community volunteers to claim cat transport missions.
-- Vet Quotes: official treatment cost quotation from verified vets.

-- ============================================================
-- 1. Transport requests table
-- ============================================================

CREATE TABLE transport_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- UNIQUE creates an implicit index; no separate index needed on case_id
  case_id uuid NOT NULL UNIQUE REFERENCES cases(id) ON DELETE CASCADE,
  claimed_by uuid REFERENCES profiles(id),
  status transport_status NOT NULL DEFAULT 'OPEN',
  claimed_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE TRIGGER transport_requests_updated_at
  BEFORE UPDATE ON transport_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 2. Vet quotes table
-- Notes are publicly readable — community users need to see the
-- treatment summary to understand what they are funding.
-- ============================================================

CREATE TABLE vet_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- UNIQUE creates an implicit index; no separate index needed on case_id
  case_id uuid NOT NULL UNIQUE REFERENCES cases(id) ON DELETE CASCADE,
  vet_id uuid NOT NULL REFERENCES profiles(id),
  quoted_amount numeric(10,2) NOT NULL CHECK (quoted_amount > 0),
  notes text,
  quoted_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. RLS helper: owns_transport (by case_id)
-- Checks if the current user is the assigned transporter for a given case.
-- ============================================================

CREATE OR REPLACE FUNCTION owns_transport(p_case_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM transport_requests
    WHERE case_id = p_case_id
    AND claimed_by = auth.uid()
  );
$$;

-- ============================================================
-- 4. Atomic claim function (prevents race conditions)
--
-- When multiple volunteers try to claim the same transport simultaneously,
-- this function guarantees only one succeeds. Uses SELECT ... FOR UPDATE
-- to lock the row during the transaction.
--
-- Returns the transport_request row on success, or raises an exception.
-- Called from a Server Action — never directly from the client.
-- ============================================================

CREATE OR REPLACE FUNCTION claim_transport(p_case_id uuid)
RETURNS transport_requests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transport transport_requests;
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Lock the row and verify it is still OPEN
  SELECT * INTO v_transport
  FROM transport_requests
  WHERE case_id = p_case_id
    AND status = 'OPEN'
  FOR UPDATE SKIP LOCKED;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transport request is no longer available';
  END IF;

  -- Atomically assign the volunteer
  UPDATE transport_requests
  SET
    claimed_by = v_user_id,
    status = 'CLAIMED',
    claimed_at = now()
  WHERE id = v_transport.id;

  -- Advance the case status from AWAITING_TRANSPORT to IN_TRANSIT
  UPDATE cases
  SET status = 'IN_TRANSIT'
  WHERE id = p_case_id
    AND status = 'AWAITING_TRANSPORT';

  -- Return the updated row
  SELECT * INTO v_transport
  FROM transport_requests
  WHERE id = v_transport.id;

  RETURN v_transport;
END;
$$;

-- ============================================================
-- 5. Indexes
-- Note: UNIQUE(case_id) on both tables already creates implicit indexes.
-- Only add indexes for non-unique columns used in filtering.
-- ============================================================

CREATE INDEX idx_transport_status ON transport_requests(status);
CREATE INDEX idx_vet_quotes_vet_id ON vet_quotes(vet_id);

-- ============================================================
-- 6. Enable RLS
-- ============================================================

ALTER TABLE transport_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_quotes ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. RLS Policies: transport_requests
--
-- INSERT RESTRICTION:
-- Transport requests are created by the system (server action using
-- service_role) when a rescue case enters the transport phase.
-- Volunteers do NOT create transport requests — they claim existing ones
-- via the claim_transport() function.
-- INSERT is restricted to admin only (service_role bypasses RLS anyway).
--
-- DELIVERY CONFIRMATION:
-- Only the claimed transporter or admin can update (mark DELIVERED).
-- ============================================================

-- Authenticated users can read (needed for transport queue display)
CREATE POLICY "Authenticated users can read transport requests"
  ON transport_requests FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Only admin can insert (system creates via service_role which bypasses RLS;
-- this policy is a safety net for direct access attempts)
CREATE POLICY "Only admin can create transport requests"
  ON transport_requests FOR INSERT
  WITH CHECK (is_admin());

-- Only the claimed transporter or admin can update (claim is done via
-- the claim_transport() SECURITY DEFINER function, not direct UPDATE)
CREATE POLICY "Transporter or admin can update transport"
  ON transport_requests FOR UPDATE
  USING (claimed_by = auth.uid() OR is_admin())
  WITH CHECK (claimed_by = auth.uid() OR is_admin());

-- Admin only delete
CREATE POLICY "Only admin can delete transport requests"
  ON transport_requests FOR DELETE
  USING (is_admin());

-- ============================================================
-- 8. RLS Policies: vet_quotes
--
-- NOTES VISIBILITY:
-- Vet quote notes (treatment summary, recovery estimate) are publicly
-- readable by all authenticated users. Community members need to
-- understand what they are funding (Doc 04, Feature 8).
-- ============================================================

-- Authenticated users can read (funding page shows quote details)
CREATE POLICY "Authenticated users can read vet quotes"
  ON vet_quotes FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- TODO:
-- Temporary MVP policy.
-- Replace is_verified_vet() with an assigned-vet/case-vet helper
-- once treatment assignment tables exist.
-- Current behavior allows any verified vet to quote any case.

-- Only verified vets can create
CREATE POLICY "Verified vets can create quotes"
  ON vet_quotes FOR INSERT
  WITH CHECK (is_verified_vet() AND vet_id = auth.uid());

-- Owning vet or admin can update
CREATE POLICY "Vet or admin can update quotes"
  ON vet_quotes FOR UPDATE
  USING (vet_id = auth.uid() OR is_admin())
  WITH CHECK (vet_id = auth.uid() OR is_admin());

-- Admin only delete
CREATE POLICY "Only admin can delete quotes"
  ON vet_quotes FOR DELETE
  USING (is_admin());

-- ============================================================
-- 9. Extend cases SELECT policy for transporters and vets
-- Now that transport_requests exists, grant precise coordinate
-- access to assigned transporters and verified vets.
-- ============================================================

CREATE POLICY "Assigned transporter can read case"
  ON cases FOR SELECT
  USING (owns_transport(id));

CREATE POLICY "Verified vets can read cases"
  ON cases FOR SELECT
  USING (is_verified_vet());
