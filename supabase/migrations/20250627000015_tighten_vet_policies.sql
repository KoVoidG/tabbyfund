-- Migration 015: Tighten vet update permissions and quote constraints
DROP POLICY IF EXISTS "Reporter vet or admin can update cases" ON cases;

CREATE POLICY "Reporter assigned vet or admin can update cases"
  ON cases FOR UPDATE
  USING (
    (reporter_id = auth.uid() AND status IN ('REPORTED', 'TRIAGED'))
    OR is_admin()
    OR (assigned_vet_id = auth.uid())
  )
  WITH CHECK (
    (reporter_id = auth.uid() AND status IN ('REPORTED', 'TRIAGED'))
    OR is_admin()
    OR (assigned_vet_id = auth.uid())
  );

DROP POLICY IF EXISTS "Verified vets can create quotes" ON vet_quotes;

CREATE POLICY "Assigned verified vets can create quotes for AT_VET cases"
  ON vet_quotes FOR INSERT
  WITH CHECK (
    is_verified_vet()
    AND vet_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = vet_quotes.case_id
        AND cases.status = 'AT_VET'
        AND cases.assigned_vet_id = auth.uid()
    )
  );
