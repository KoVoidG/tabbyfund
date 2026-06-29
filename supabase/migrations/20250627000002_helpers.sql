-- Migration 002: Reusable utility functions
-- These are pure utility functions with no table dependencies.

-- Reusable trigger function: automatically set updated_at on row update
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
