-- Migration 001: Create all PostgreSQL custom enum types
-- These are shared across multiple tables and must be created first.

-- User roles: community (default), vet (requires verification), admin
CREATE TYPE user_role AS ENUM ('community', 'vet', 'admin');

-- Case lifecycle statuses (18 values)
-- Terminal: ADOPTED, SHELTERED, REUNITED
-- Cancelled: CANCELLED, LOST_CONTACT, DECEASED
CREATE TYPE case_status AS ENUM (
  'REPORTED',
  'TRIAGED',
  'AWAITING_TRANSPORT',
  'IN_TRANSIT',
  'AT_VET',
  'QUOTED',
  'FUNDING_OPEN',
  'FUNDED',
  'IN_TREATMENT',
  'TREATED',
  'FUNDS_RELEASED',
  'IN_FOSTER',
  'ADOPTED',
  'SHELTERED',
  'REUNITED',
  'CANCELLED',
  'LOST_CONTACT',
  'DECEASED'
);

-- AI severity levels for rescue prioritization
CREATE TYPE ai_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- Transport request lifecycle
CREATE TYPE transport_status AS ENUM ('OPEN', 'CLAIMED', 'DELIVERED');

-- Donation lifecycle (no PENDING for MVP — donations go directly to escrow)
CREATE TYPE donation_status AS ENUM ('HELD_IN_ESCROW', 'RELEASED', 'REFUNDED');

-- Veterinary treatment outcomes
CREATE TYPE treatment_outcome AS ENUM ('ONGOING', 'RECOVERED', 'DECEASED', 'REFERRED');

-- Foster care status
CREATE TYPE foster_status AS ENUM ('ACTIVE', 'REASSIGNED', 'ADOPTED', 'SHELTERED');

-- Adoption listing status
CREATE TYPE adoption_status AS ENUM ('OPEN', 'MATCHED', 'COMPLETED', 'CLOSED');

-- Notification types for in-app notifications
CREATE TYPE notification_type AS ENUM (
  'TRANSPORT_CLAIMED',
  'QUOTE_SUBMITTED',
  'FUNDING_OPENED',
  'FUNDING_COMPLETED',
  'TREATMENT_UPDATED',
  'TREATMENT_COMPLETED',
  'ADOPTION_REQUEST',
  'SYSTEM'
);
