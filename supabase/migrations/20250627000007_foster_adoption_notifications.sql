-- Migration 007: Foster records, adoption listings, and notifications
-- Foster: temporary caretaker tracking (multiple records per case, one ACTIVE).
-- Adoption: cats available for permanent homes.
-- Notifications: in-app notification system.

-- ============================================================
-- 1. Foster records table
-- ============================================================

CREATE TABLE foster_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  caretaker_id uuid NOT NULL REFERENCES profiles(id),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  status foster_status NOT NULL DEFAULT 'ACTIVE',
  -- Consistency: ACTIVE requires no end date; non-ACTIVE requires end date
  CONSTRAINT chk_foster_active_no_end CHECK (
    (status = 'ACTIVE' AND ended_at IS NULL)
    OR
    (status != 'ACTIVE' AND ended_at IS NOT NULL)
  )
);

-- Partial unique index: only one ACTIVE foster per case
CREATE UNIQUE INDEX idx_foster_one_active_per_case
  ON foster_records(case_id)
  WHERE status = 'ACTIVE';

-- ============================================================
-- 2. Adoption listings table
-- ============================================================

CREATE TABLE adoption_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL UNIQUE REFERENCES cases(id) ON DELETE CASCADE,
  description text,
  personality text,
  medical_notes text,
  matched_with uuid REFERENCES profiles(id),
  status adoption_status NOT NULL DEFAULT 'OPEN',
  listed_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- Consistency: MATCHED/COMPLETED requires matched_with; OPEN/CLOSED requires NULL
  CONSTRAINT chk_adoption_matched_requires_user CHECK (
    (status IN ('MATCHED', 'COMPLETED') AND matched_with IS NOT NULL)
    OR
    (status NOT IN ('MATCHED', 'COMPLETED') AND matched_with IS NULL)
  )
);

-- Auto-update updated_at
CREATE TRIGGER adoption_listings_updated_at
  BEFORE UPDATE ON adoption_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 3. Notifications table
-- ============================================================

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type NOT NULL DEFAULT 'SYSTEM',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. Mark notification as read (SECURITY DEFINER function)
-- Users should only be able to mark their own notifications as read.
-- They should not be able to edit title, message, type, or user_id.
-- This function enforces that constraint at the database level.
-- ============================================================

CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE notifications
  SET is_read = true
  WHERE id = p_notification_id
    AND user_id = auth.uid();
END;
$$;

-- ============================================================
-- 5. Indexes
-- ============================================================

CREATE INDEX idx_foster_records_case_id ON foster_records(case_id);
CREATE INDEX idx_adoption_listings_status ON adoption_listings(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- ============================================================
-- 6. Enable RLS
-- ============================================================

ALTER TABLE foster_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. RLS Policies: foster_records
--
-- INSERT/UPDATE are admin-only via RLS.
-- Backend creates and manages foster records using service_role
-- (which bypasses RLS). Caretakers do not directly modify foster records.
-- ============================================================

-- Authenticated can read
CREATE POLICY "Authenticated users can read foster records"
  ON foster_records FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Only admin can insert (system uses service_role which bypasses RLS)
CREATE POLICY "Only admin can create foster records"
  ON foster_records FOR INSERT
  WITH CHECK (is_admin());

-- Only admin can update (system manages transitions via service_role)
CREATE POLICY "Only admin can update foster records"
  ON foster_records FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin only delete
CREATE POLICY "Only admin can delete foster records"
  ON foster_records FOR DELETE
  USING (is_admin());

-- ============================================================
-- 8. RLS Policies: adoption_listings
--
-- Only the treating vet (who has a treatment_record for the case)
-- or admin can create/update adoption listings.
-- This ensures only the assigned vet manages adoption, not any vet.
-- ============================================================

-- Authenticated can read (public adoption feed)
CREATE POLICY "Authenticated users can read adoption listings"
  ON adoption_listings FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Treating vet or admin can create
CREATE POLICY "Treating vet or admin can create adoption listings"
  ON adoption_listings FOR INSERT
  WITH CHECK (
    is_admin()
    OR (
      is_verified_vet()
      AND EXISTS (
        SELECT 1 FROM treatment_records
        WHERE treatment_records.case_id = adoption_listings.case_id
          AND treatment_records.vet_id = auth.uid()
      )
    )
  );

-- Treating vet or admin can update
CREATE POLICY "Treating vet or admin can update adoption listings"
  ON adoption_listings FOR UPDATE
  USING (
    is_admin()
    OR (
      is_verified_vet()
      AND EXISTS (
        SELECT 1 FROM treatment_records
        WHERE treatment_records.case_id = adoption_listings.case_id
          AND treatment_records.vet_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    is_admin()
    OR (
      is_verified_vet()
      AND EXISTS (
        SELECT 1 FROM treatment_records
        WHERE treatment_records.case_id = adoption_listings.case_id
          AND treatment_records.vet_id = auth.uid()
      )
    )
  );

-- Admin only delete
CREATE POLICY "Only admin can delete adoption listings"
  ON adoption_listings FOR DELETE
  USING (is_admin());

-- ============================================================
-- 9. RLS Policies: notifications
--
-- INSERT is admin-only via RLS (backend uses service_role).
-- UPDATE is admin-only via RLS. Users mark notifications as read
-- via the mark_notification_read() SECURITY DEFINER function,
-- which prevents editing title/message/type/user_id.
-- ============================================================

-- Users can only read their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Only admin can insert (backend uses service_role which bypasses RLS)
CREATE POLICY "Only admin can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (is_admin());

-- Only admin can update (users use mark_notification_read function instead)
CREATE POLICY "Only admin can update notifications"
  ON notifications FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin only delete
CREATE POLICY "Only admin can delete notifications"
  ON notifications FOR DELETE
  USING (is_admin());
