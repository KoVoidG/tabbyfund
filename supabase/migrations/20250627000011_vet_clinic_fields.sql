-- Migration 011: Add optional vet clinic fields to profiles
-- These fields are only meaningful for profiles with role = 'vet'.
-- All fields are nullable — existing users are unaffected.

ALTER TABLE profiles
  ADD COLUMN clinic_name text,
  ADD COLUMN clinic_address text,
  ADD COLUMN clinic_lat double precision,
  ADD COLUMN clinic_lng double precision;

-- No index needed — clinic lookups are rare (admin/transport UI only).
-- No RLS change — profiles SELECT policies already apply.
