-- Migration 003: Profiles table + RLS helper functions
-- Extends auth.users with application-specific user data.
-- Email lives in auth.users (single source of truth) — not duplicated here.

-- ============================================================
-- 1. Create profiles table
-- ============================================================

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 100),
  avatar_url text,
  role user_role NOT NULL DEFAULT 'community',
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. Index on role (speeds up is_admin/is_verified_vet and admin queries)
-- ============================================================

CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================================
-- 3. RLS helper: is_admin()
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- ============================================================
-- 4. RLS helper: is_verified_vet()
-- ============================================================

CREATE OR REPLACE FUNCTION is_verified_vet()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'vet'
    AND is_verified = true
  );
$$;

-- ============================================================
-- 5. Trigger function: auto-create profile on auth signup
--
-- Reads role from raw_user_meta_data (set during signUp).
-- Only allows 'community' or 'vet'. Never 'admin'.
-- Defaults to 'community' if no role is provided.
-- Vet accounts always start with is_verified = false.
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role user_role := 'community';
  v_requested_role text;
BEGIN
  v_requested_role := NEW.raw_user_meta_data ->> 'role';

  -- Only allow community or vet from self-registration. Never admin.
  IF v_requested_role = 'vet' THEN
    v_role := 'vet';
  END IF;

  INSERT INTO profiles (id, display_name, avatar_url, role, is_verified)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'display_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data ->> 'avatar_url',
    v_role,
    false
  );
  RETURN NEW;
END;
$$;

-- ============================================================
-- 6. Trigger function: protect role and is_verified from non-admins
-- ============================================================

CREATE OR REPLACE FUNCTION protect_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (OLD.role IS DISTINCT FROM NEW.role OR OLD.is_verified IS DISTINCT FROM NEW.is_verified) THEN
    IF NOT is_admin() THEN
      RAISE EXCEPTION 'Only administrators can modify role or verification status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================================
-- 7. Attach triggers
-- ============================================================

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER profiles_protect_fields
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_profile_fields();

-- ============================================================
-- 8. Enable RLS
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 9. RLS Policies
-- ============================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Users can update their own profile; admins can update any.
-- role and is_verified are protected by protect_profile_fields trigger.
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid() OR is_admin())
  WITH CHECK (id = auth.uid() OR is_admin());
