-- TabbyFund Demo Seed Additions
-- Adds scenarios missing from the original seed.sql for comprehensive workflow testing.
-- Run AFTER the main seed.sql (or append to it).
-- Does NOT modify existing cases/users.
--
-- New scenarios added:
-- 1. Reporter self-transports (Case 11)
-- 2. Fully funded, ready for treatment start (Case 12)
-- 3. Recovered + ready for adoption, behaviour profile INCOMPLETE (Case 13)
-- 4. Recovered but NOT ready for adoption (Case 14)
-- 5. Deceased case (Case 15)
-- 6. Pending vet for admin verification

-- ============================================================
-- NEW USER: Pending (unverified) vet
-- ============================================================

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, aud, role)
VALUES
  ('a2000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'dr.newvet@example.com', crypt('password123', gen_salt('bf')), now(), '{"display_name": "Dr. Somjai", "role": "vet"}', now() - interval '1 day', now() - interval '1 day', 'authenticated', 'authenticated');

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'a2000000-0000-0000-0000-000000000003', 'a2000000-0000-0000-0000-000000000003', '{"sub": "a2000000-0000-0000-0000-000000000003", "email": "dr.newvet@example.com"}', 'email', now(), now(), now());

ALTER TABLE profiles DISABLE TRIGGER profiles_protect_fields;
INSERT INTO profiles (id, display_name, avatar_url, role, is_verified)
VALUES ('a2000000-0000-0000-0000-000000000003', 'Dr. Somjai', NULL, 'vet', false)
ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name, role = EXCLUDED.role, is_verified = EXCLUDED.is_verified;
ALTER TABLE profiles ENABLE TRIGGER profiles_protect_fields;

-- ============================================================
-- CASE 11: Reporter self-transports (IN_TRANSIT, reporter = transporter)
-- Demo: Shows the "I can transport" option working
-- Visible: /cases feed, /cases/[id] with transport card showing reporter as transporter
-- Test as: Somchai (reporter/transporter) — can mark delivered
-- ============================================================

INSERT INTO cases (id, reporter_id, status, photo_url, description, precise_lat, precise_lng, fuzzed_lat, fuzzed_lng, ai_condition, ai_severity, ai_confidence, ai_reasoning, ai_first_aid, ai_analyzed_at)
VALUES (
  'c0000000-0000-0000-0000-000000000011',
  'a1000000-0000-0000-0000-000000000001',
  'IN_TRANSIT',
  'https://placehold.co/400x300/F3C9A6/2D3748?text=Self+Transport',
  'Injured kitten found under a parked car on Ratchadamri. Reporter is transporting to nearest vet.',
  13.7439, 100.5401, 13.744, 100.541,
  'Dehydration', 'MEDIUM', 72,
  'Small kitten appears dehydrated and weak. No visible wounds but lethargic.',
  ARRAY['Offer water from a shallow dish', 'Keep warm', 'Transport gently'],
  now() - interval '1 hour'
);

INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, created_at)
VALUES (
  '10000000-0000-0000-0000-000000000011',
  'c0000000-0000-0000-0000-000000000011',
  'a1000000-0000-0000-0000-000000000001',  -- reporter = transporter (Somchai)
  'CLAIMED',
  now() - interval '1 hour',
  now() - interval '1 hour'
);

-- ============================================================
-- CASE 12: Fully funded, ready for vet to start treatment
-- Demo: Shows FUNDED status — vet can start treatment
-- Visible: /cases feed, /vet dashboard, /vet/cases/[id]
-- Test as: Dr. Siriporn — can create treatment record
-- ============================================================

INSERT INTO cases (id, reporter_id, status, photo_url, description, precise_lat, precise_lng, fuzzed_lat, fuzzed_lng, ai_condition, ai_severity, ai_confidence, ai_reasoning, ai_first_aid, ai_analyzed_at)
VALUES (
  'c0000000-0000-0000-0000-000000000012',
  'a1000000-0000-0000-0000-000000000004',
  'FUNDED',
  'https://placehold.co/400x300/F3C9A6/2D3748?text=Funded+Cat',
  'Cat with infected wound on ear, rescued from canal near Bang Rak. Fully funded and ready for treatment.',
  13.7261, 100.5149, 13.727, 100.515,
  'Ear Infection', 'MEDIUM', 76,
  'Visible infection on left ear. Swelling and discharge present.',
  ARRAY['Do not touch the ear', 'Keep away from water', 'Vet care needed'],
  now() - interval '6 days'
);

INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, delivered_at, created_at)
VALUES (
  '10000000-0000-0000-0000-000000000012',
  'c0000000-0000-0000-0000-000000000012',
  'a1000000-0000-0000-0000-000000000002',
  'DELIVERED',
  now() - interval '5 days 20 hours',
  now() - interval '5 days 18 hours',
  now() - interval '6 days'
);

INSERT INTO vet_quotes (id, case_id, vet_id, quoted_amount, notes, quoted_at)
VALUES (
  '20000000-0000-0000-0000-000000000012',
  'c0000000-0000-0000-0000-000000000012',
  'a2000000-0000-0000-0000-000000000001',
  5000.00,
  'Ear cleaning, antibiotics, anti-inflammatory. Est. 1 week.',
  now() - interval '5 days'
);

INSERT INTO donations (id, case_id, donor_id, amount, status, created_at) VALUES
('d0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000001', 3000.00, 'HELD_IN_ESCROW', now() - interval '4 days'),
('d0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000005', 2000.00, 'HELD_IN_ESCROW', now() - interval '3 days');

-- ============================================================
-- CASE 13: Recovered + ready for adoption, NO caretaker assigned yet
-- Demo: Shows "Volunteer as Temporary Caretaker" button
-- Visible: /cases/[id] with CaretakerVolunteerCard
-- Test as: Any community user — can volunteer as caretaker
-- ============================================================

INSERT INTO cases (id, reporter_id, status, photo_url, description, precise_lat, precise_lng, fuzzed_lat, fuzzed_lng, ai_condition, ai_severity, ai_confidence, ai_reasoning, ai_first_aid, ai_analyzed_at)
VALUES (
  'c0000000-0000-0000-0000-000000000013',
  'a1000000-0000-0000-0000-000000000002',
  'TREATED',
  'https://placehold.co/400x300/F3C9A6/2D3748?text=Needs+Caretaker',
  'Recovered cat awaiting temporary caretaker. Was found with respiratory infection near Saphan Kwai.',
  13.7928, 100.5491, 13.793, 100.550,
  'Respiratory Infection', 'LOW', 82,
  'Respiratory infection successfully treated. Cat is now healthy.',
  ARRAY['Keep in warm environment', 'Monitor breathing'],
  now() - interval '10 days'
);

INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, delivered_at, created_at)
VALUES (
  '10000000-0000-0000-0000-000000000013',
  'c0000000-0000-0000-0000-000000000013',
  'a1000000-0000-0000-0000-000000000004',
  'DELIVERED',
  now() - interval '9 days 20 hours',
  now() - interval '9 days 18 hours',
  now() - interval '10 days'
);

INSERT INTO vet_quotes (id, case_id, vet_id, quoted_amount, notes, quoted_at)
VALUES (
  '20000000-0000-0000-0000-000000000013',
  'c0000000-0000-0000-0000-000000000013',
  'a2000000-0000-0000-0000-000000000001',
  2500.00,
  'Antibiotics and nebulizer treatment. 5-day course.',
  now() - interval '9 days'
);

INSERT INTO donations (id, case_id, donor_id, amount, status, created_at, released_at) VALUES
('d0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000003', 2500.00, 'RELEASED', now() - interval '8 days', now() - interval '5 days');

ALTER TABLE treatment_records DISABLE TRIGGER treatment_escrow_release;
INSERT INTO treatment_records (id, case_id, vet_id, treatment_summary, outcome, vaccination_status, is_neutered, ready_for_adoption, ready_for_adoption_at, confirmed_at, created_at)
VALUES (
  '30000000-0000-0000-0000-000000000013',
  'c0000000-0000-0000-0000-000000000013',
  'a2000000-0000-0000-0000-000000000001',
  'Respiratory infection fully resolved. Cat is healthy and active.',
  'RECOVERED',
  'complete',
  true,
  true,
  now() - interval '5 days',
  now() - interval '5 days',
  now() - interval '7 days'
);
ALTER TABLE treatment_records ENABLE TRIGGER treatment_escrow_release;

-- Adoption listing exists but NO foster record — so public_adoptable_cats won't show it
INSERT INTO adoption_listings (id, case_id, description, status, listed_at)
VALUES (
  '40000000-0000-0000-0000-000000000013',
  'c0000000-0000-0000-0000-000000000013',
  'Healthy cat ready for a temporary caretaker before adoption listing.',
  'OPEN',
  now() - interval '5 days'
);

-- ============================================================
-- CASE 14: Recovered but NOT ready for adoption (vet did not approve)
-- Demo: Shows workflow stop — no foster/adoption path
-- Visible: /cases/[id] — treatment complete but no adoption listing
-- ============================================================

INSERT INTO cases (id, reporter_id, status, photo_url, description, precise_lat, precise_lng, fuzzed_lat, fuzzed_lng, ai_condition, ai_severity, ai_confidence, ai_reasoning, ai_first_aid, ai_analyzed_at)
VALUES (
  'c0000000-0000-0000-0000-000000000014',
  'a1000000-0000-0000-0000-000000000003',
  'TREATED',
  'https://placehold.co/400x300/F3C9A6/2D3748?text=Not+For+Adoption',
  'Cat recovered from leg injury but vet determined it has chronic condition requiring ongoing care. Not suitable for general adoption.',
  13.7460, 100.5687, 13.747, 100.569,
  'Chronic Joint Issue', 'LOW', 70,
  'Leg injury healed but chronic joint condition remains.',
  ARRAY['Gentle handling', 'Avoid jumps'],
  now() - interval '12 days'
);

INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, delivered_at, created_at)
VALUES (
  '10000000-0000-0000-0000-000000000014',
  'c0000000-0000-0000-0000-000000000014',
  'a1000000-0000-0000-0000-000000000001',
  'DELIVERED',
  now() - interval '11 days',
  now() - interval '10 days 22 hours',
  now() - interval '12 days'
);

INSERT INTO vet_quotes (id, case_id, vet_id, quoted_amount, notes, quoted_at)
VALUES (
  '20000000-0000-0000-0000-000000000014',
  'c0000000-0000-0000-0000-000000000014',
  'a2000000-0000-0000-0000-000000000002',
  7000.00,
  'Leg treatment and joint assessment. Long-term medication needed.',
  now() - interval '10 days'
);

INSERT INTO donations (id, case_id, donor_id, amount, status, created_at, released_at) VALUES
('d0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000002', 4000.00, 'RELEASED', now() - interval '9 days', now() - interval '6 days'),
('d0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000005', 3000.00, 'RELEASED', now() - interval '9 days', now() - interval '6 days');

ALTER TABLE treatment_records DISABLE TRIGGER treatment_escrow_release;
INSERT INTO treatment_records (id, case_id, vet_id, treatment_summary, outcome, vaccination_status, is_neutered, special_needs, ready_for_adoption, confirmed_at, created_at)
VALUES (
  '30000000-0000-0000-0000-000000000014',
  'c0000000-0000-0000-0000-000000000014',
  'a2000000-0000-0000-0000-000000000002',
  'Leg healed but chronic joint condition detected. Requires ongoing anti-inflammatory medication. Not suitable for general adoption without specialized care.',
  'RECOVERED',
  'complete',
  true,
  'Requires daily joint supplement and monthly vet check-up.',
  false,  -- NOT ready for adoption
  now() - interval '6 days',
  now() - interval '8 days'
);
ALTER TABLE treatment_records ENABLE TRIGGER treatment_escrow_release;

-- ============================================================
-- CASE 15: Deceased case
-- Demo: Shows terminal workflow — no further progression
-- Visible: /cases/[id] — shows final status
-- ============================================================

INSERT INTO cases (id, reporter_id, status, photo_url, description, precise_lat, precise_lng, fuzzed_lat, fuzzed_lng, ai_condition, ai_severity, ai_confidence, ai_reasoning, ai_first_aid, ai_analyzed_at)
VALUES (
  'c0000000-0000-0000-0000-000000000015',
  'a1000000-0000-0000-0000-000000000005',
  'DECEASED',
  'https://placehold.co/400x300/F3C9A6/2D3748?text=Memorial',
  'Cat found with severe internal injuries near expressway. Despite emergency treatment, did not survive.',
  13.7615, 100.5692, 13.762, 100.570,
  'Internal Injuries', 'CRITICAL', 95,
  'Severe internal injuries. Extremely critical condition.',
  ARRAY['Do not move', 'Keep warm', 'Emergency vet needed'],
  now() - interval '15 days'
);

INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, delivered_at, created_at)
VALUES (
  '10000000-0000-0000-0000-000000000015',
  'c0000000-0000-0000-0000-000000000015',
  'a1000000-0000-0000-0000-000000000003',
  'DELIVERED',
  now() - interval '14 days 22 hours',
  now() - interval '14 days 20 hours',
  now() - interval '15 days'
);

INSERT INTO vet_quotes (id, case_id, vet_id, quoted_amount, notes, quoted_at)
VALUES (
  '20000000-0000-0000-0000-000000000015',
  'c0000000-0000-0000-0000-000000000015',
  'a2000000-0000-0000-0000-000000000002',
  25000.00,
  'Emergency surgery attempt. Critical condition.',
  now() - interval '14 days 18 hours'
);

INSERT INTO donations (id, case_id, donor_id, amount, status, created_at, released_at) VALUES
('d0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000001', 15000.00, 'REFUNDED', now() - interval '14 days', now() - interval '12 days'),
('d0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000004', 10000.00, 'REFUNDED', now() - interval '14 days', now() - interval '12 days');

ALTER TABLE treatment_records DISABLE TRIGGER treatment_escrow_release;
INSERT INTO treatment_records (id, case_id, vet_id, treatment_summary, outcome, confirmed_at, created_at)
VALUES (
  '30000000-0000-0000-0000-000000000015',
  'c0000000-0000-0000-0000-000000000015',
  'a2000000-0000-0000-0000-000000000002',
  'Emergency surgery attempted but internal injuries were too severe. Cat did not survive.',
  'DECEASED',
  now() - interval '12 days',
  now() - interval '13 days'
);
ALTER TABLE treatment_records ENABLE TRIGGER treatment_escrow_release;

-- ============================================================
-- ADDITIONAL NOTIFICATIONS for demo richness
-- ============================================================

INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES
('a1000000-0000-0000-0000-000000000001', 'Your transport is on its way!', 'You are currently transporting the kitten from Ratchadamri to the vet.', 'TRANSPORT_CLAIMED', false, now() - interval '1 hour'),
('a1000000-0000-0000-0000-000000000003', 'Funding complete!', 'The ear infection case has been fully funded. Treatment can begin.', 'FUNDING_COMPLETED', false, now() - interval '3 days'),
('a1000000-0000-0000-0000-000000000005', 'Sad news', 'Unfortunately the cat with internal injuries did not survive despite emergency treatment. Donations have been refunded.', 'SYSTEM', true, now() - interval '12 days'),
('a3000000-0000-0000-0000-000000000001', 'New vet application', 'Dr. Somjai has applied for vet verification.', 'SYSTEM', false, now() - interval '1 day');
