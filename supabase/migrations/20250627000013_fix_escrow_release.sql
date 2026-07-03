-- Migration 013: Fix escrow release logic to include DECEASED outcomes
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
  SELECT COALESCE(SUM(amount), 0) INTO v_total_donated
  FROM donations
  WHERE case_id = p_case_id
    AND status IN ('HELD_IN_ESCROW', 'RELEASED');

  -- Check if treatment is completed (outcome is 'RECOVERED' or 'DECEASED', and confirmed_at is not null)
  SELECT EXISTS (
    SELECT 1 FROM treatment_records
    WHERE case_id = p_case_id
      AND outcome IN ('RECOVERED', 'DECEASED')
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
