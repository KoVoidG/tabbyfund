-- Migration 012: Vet Assignment and Escrow Release Updates

-- 1. Add assigned_vet_id column
ALTER TABLE cases ADD COLUMN assigned_vet_id uuid REFERENCES profiles(id);
CREATE INDEX idx_cases_assigned_vet_id ON cases(assigned_vet_id);

-- 2. Update cases RLS select policy for assigned vet
DROP POLICY IF EXISTS "Verified vets can read cases" ON cases;

CREATE POLICY "Assigned vet can read case"
  ON cases FOR SELECT
  USING (assigned_vet_id = auth.uid());

-- 3. Drop the old treatment escrow release trigger
DROP TRIGGER IF EXISTS treatment_escrow_release ON treatment_records;
DROP FUNCTION IF EXISTS release_escrow_on_treatment_complete();

-- 4. Create check_and_release_escrow function
CREATE OR REPLACE FUNCTION check_and_release_escrow(p_case_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_goal numeric(10,2);
  v_total_donated numeric(10,2);
  v_treatment_completed boolean;
BEGIN
  -- Get the quote goal amount
  SELECT quoted_amount INTO v_goal
  FROM vet_quotes
  WHERE case_id = p_case_id;

  IF v_goal IS NULL OR v_goal <= 0 THEN
    RETURN;
  END IF;

  -- Get total donated amount (HELD_IN_ESCROW or RELEASED)
  -- Note: We sum both to find if goal has been met, which makes checking idempotent
  SELECT COALESCE(SUM(amount), 0) INTO v_total_donated
  FROM donations
  WHERE case_id = p_case_id
    AND status IN ('HELD_IN_ESCROW', 'RELEASED');

  -- Check if treatment is completed (outcome = 'RECOVERED' and confirmed_at is not null)
  SELECT EXISTS (
    SELECT 1 FROM treatment_records
    WHERE case_id = p_case_id
      AND outcome = 'RECOVERED'
      AND confirmed_at IS NOT NULL
  ) INTO v_treatment_completed;

  -- If both conditions are met, release the escrow
  IF v_total_donated >= v_goal AND v_treatment_completed THEN
    -- Update all HELD_IN_ESCROW donations to RELEASED
    UPDATE donations
    SET status = 'RELEASED', released_at = now()
    WHERE case_id = p_case_id
      AND status = 'HELD_IN_ESCROW';

    -- Advance case status to FUNDS_RELEASED (from IN_TREATMENT or TREATED)
    UPDATE cases
    SET status = 'FUNDS_RELEASED'
    WHERE id = p_case_id
      AND status IN ('IN_TREATMENT', 'TREATED');
  END IF;
END;
$$;

-- 5. Create new triggers for donations and treatment_records
CREATE OR REPLACE FUNCTION trigger_release_escrow_on_treatment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM check_and_release_escrow(NEW.case_id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER check_escrow_on_treatment
  AFTER INSERT OR UPDATE ON treatment_records
  FOR EACH ROW
  EXECUTE FUNCTION trigger_release_escrow_on_treatment();

CREATE OR REPLACE FUNCTION trigger_release_escrow_on_donation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM check_and_release_escrow(NEW.case_id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER check_escrow_on_donation
  AFTER INSERT ON donations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_release_escrow_on_donation();