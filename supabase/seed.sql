-- TabbyFund Seed Data
-- Populates the database with realistic demo data for hackathon demonstrations.
-- Requirements: 5 Community, 2 Verified Vets, 1 Admin, 10 Cases, varied statuses.
-- Uses Thai-style names with clean English descriptions.
--
-- Password for all seed users: "password123"

-- ============================================================
-- USERS (via Supabase Auth)
-- ============================================================

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, aud, role)
VALUES
  ('a1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'somchai@example.com', crypt('password123', gen_salt('bf')), now(), '{"display_name": "Somchai K.", "role": "community"}', now(), now(), 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'nattaya@example.com', crypt('password123', gen_salt('bf')), now(), '{"display_name": "Nattaya S.", "role": "community"}', now(), now(), 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'prawit@example.com', crypt('password123', gen_salt('bf')), now(), '{"display_name": "Prawit C.", "role": "community"}', now(), now(), 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'kannika@example.com', crypt('password123', gen_salt('bf')), now(), '{"display_name": "Kannika W.", "role": "community"}', now(), now(), 'authenticated', 'authenticated'),
  ('a1000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'thana@example.com', crypt('password123', gen_salt('bf')), now(), '{"display_name": "Thana P.", "role": "community"}', now(), now(), 'authenticated', 'authenticated'),
  ('a2000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'dr.siriporn@example.com', crypt('password123', gen_salt('bf')), now(), '{"display_name": "Dr. Siriporn", "role": "vet"}', now(), now(), 'authenticated', 'authenticated'),
  ('a2000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'dr.anuwat@example.com', crypt('password123', gen_salt('bf')), now(), '{"display_name": "Dr. Anuwat", "role": "vet"}', now(), now(), 'authenticated', 'authenticated'),
  ('a3000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'admin@tabbyfund.com', crypt('password123', gen_salt('bf')), now(), '{"display_name": "TabbyFund Admin", "role": "community"}', now(), now(), 'authenticated', 'authenticated');

-- Create identities (required by Supabase Auth)
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', '{"sub": "a1000000-0000-0000-0000-000000000001", "email": "somchai@example.com"}', 'email', now(), now(), now()),
  (gen_random_uuid(), 'a1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', '{"sub": "a1000000-0000-0000-0000-000000000002", "email": "nattaya@example.com"}', 'email', now(), now(), now()),
  (gen_random_uuid(), 'a1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', '{"sub": "a1000000-0000-0000-0000-000000000003", "email": "prawit@example.com"}', 'email', now(), now(), now()),
  (gen_random_uuid(), 'a1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004', '{"sub": "a1000000-0000-0000-0000-000000000004", "email": "kannika@example.com"}', 'email', now(), now(), now()),
  (gen_random_uuid(), 'a1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', '{"sub": "a1000000-0000-0000-0000-000000000005", "email": "thana@example.com"}', 'email', now(), now(), now()),
  (gen_random_uuid(), 'a2000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000001', '{"sub": "a2000000-0000-0000-0000-000000000001", "email": "dr.siriporn@example.com"}', 'email', now(), now(), now()),
  (gen_random_uuid(), 'a2000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', '{"sub": "a2000000-0000-0000-0000-000000000002", "email": "dr.anuwat@example.com"}', 'email', now(), now(), now()),
  (gen_random_uuid(), 'a3000000-0000-0000-0000-000000000001', 'a3000000-0000-0000-0000-000000000001', '{"sub": "a3000000-0000-0000-0000-000000000001", "email": "admin@tabbyfund.com"}', 'email', now(), now(), now());

-- ============================================================
-- PROFILES (explicit upsert — do not rely solely on trigger)
-- ============================================================

-- Disable protect trigger so we can set roles during seed
ALTER TABLE profiles DISABLE TRIGGER profiles_protect_fields;

INSERT INTO profiles (id, display_name, avatar_url, role, is_verified)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Somchai K.', NULL, 'community', false),
  ('a1000000-0000-0000-0000-000000000002', 'Nattaya S.', NULL, 'community', false),
  ('a1000000-0000-0000-0000-000000000003', 'Prawit C.', NULL, 'community', false),
  ('a1000000-0000-0000-0000-000000000004', 'Kannika W.', NULL, 'community', false),
  ('a1000000-0000-0000-0000-000000000005', 'Thana P.', NULL, 'community', false),
  ('a2000000-0000-0000-0000-000000000001', 'Dr. Siriporn', NULL, 'vet', true),
  ('a2000000-0000-0000-0000-000000000002', 'Dr. Anuwat', NULL, 'vet', true),
  ('a3000000-0000-0000-0000-000000000001', 'TabbyFund Admin', NULL, 'admin', true)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role,
  is_verified = EXCLUDED.is_verified;

ALTER TABLE profiles ENABLE TRIGGER profiles_protect_fields;

-- ============================================================
-- RESCUE CASES (10 cases in various lifecycle stages)
-- Locations around Bangkok, Thailand
-- ============================================================

INSERT INTO cases (id, reporter_id, status, photo_url, description, precise_lat, precise_lng, fuzzed_lat, fuzzed_lng, ai_condition, ai_severity, ai_confidence, ai_reasoning, ai_first_aid, ai_analyzed_at) VALUES
-- Case 1: CRITICAL - Awaiting transport
('c0000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'AWAITING_TRANSPORT',
 'https://placehold.co/400x300/F3C9A6/2D3748?text=Injured+Cat+1',
 'Found a cat hit by a car near Sukhumvit Soi 23. Hind leg appears broken, unable to stand.',
 13.7380, 100.5608, 13.739, 100.562,
 'Fracture', 'CRITICAL', 91,
 'The cat appears unable to stand. Visible swelling on the hind leg suggests a possible fracture.',
 ARRAY['Do not attempt to move the cat forcefully', 'Keep the area quiet', 'Provide water nearby if safe', 'Contact a transporter immediately'],
 now() - interval '2 hours'),

-- Case 2: HIGH - In transit
('c0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'IN_TRANSIT',
 'https://placehold.co/400x300/F3C9A6/2D3748?text=Injured+Cat+2',
 'Cat with a large open wound on its back, found near Chatuchak market.',
 13.7999, 100.5533, 13.801, 100.554,
 'Open Wound', 'HIGH', 85,
 'Large open wound visible on the back. Moderate bleeding observed. The cat is conscious but lethargic.',
 ARRAY['Do not touch the wound directly', 'Keep the cat warm with a towel', 'Avoid chasing if the cat tries to flee'],
 now() - interval '5 hours'),

-- Case 3: MEDIUM - At vet, awaiting quote (useful for live demo of quote submission)
('c0000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 'AT_VET',
 'https://placehold.co/400x300/F3C9A6/2D3748?text=Injured+Cat+3',
 'Cat with swollen eye and discharge, found in Ari area. Now at vet for examination.',
 13.7788, 100.5447, 13.780, 100.545,
 'Eye Injury', 'MEDIUM', 78,
 'Swollen left eye with visible discharge. The cat appears otherwise healthy and mobile.',
 ARRAY['Do not attempt to clean the eye', 'Keep the cat in a calm environment', 'Provide fresh water'],
 now() - interval '1 day'),

-- Case 4: FUNDING_OPEN - Active fundraiser
('c0000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004', 'FUNDING_OPEN',
 'https://placehold.co/400x300/F3C9A6/2D3748?text=Injured+Cat+4',
 'Severely malnourished cat with skin condition, found behind Wat Phra Kaew.',
 13.7516, 100.4926, 13.752, 100.493,
 'Skin Condition', 'MEDIUM', 74,
 'Severe malnutrition and widespread skin condition. Multiple patches of fur loss visible.',
 ARRAY['Provide food if available', 'Do not force the cat into a carrier', 'Contact a local shelter'],
 now() - interval '3 days'),

-- Case 5: FUNDING_OPEN - Active fundraiser
('c0000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', 'FUNDING_OPEN',
 'https://placehold.co/400x300/F3C9A6/2D3748?text=Injured+Cat+5',
 'Cat bitten by a dog with multiple wounds, found near Lumpini Park.',
 13.7311, 100.5418, 13.732, 100.542,
 'Open Wound', 'HIGH', 88,
 'Multiple bite wounds visible. Some wounds appear infected. The cat is alert but in pain.',
 ARRAY['Do not touch the wounds', 'Keep the cat calm', 'Transport to vet as soon as possible'],
 now() - interval '2 days'),

-- Case 6: FUNDING_OPEN - Active fundraiser
('c0000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'FUNDING_OPEN',
 'https://placehold.co/400x300/F3C9A6/2D3748?text=Injured+Cat+6',
 'Cat with broken front leg, possibly fell from height. Found near Silom condo.',
 13.7252, 100.5347, 13.726, 100.535,
 'Fracture', 'HIGH', 83,
 'Front leg appears broken, possibly from a fall. The cat is unable to put weight on it.',
 ARRAY['Do not try to splint the leg', 'Keep the cat still', 'Use a flat surface for transport'],
 now() - interval '4 days'),
-- Case 7: IN_TREATMENT
('c0000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000002', 'IN_TREATMENT',
 'https://placehold.co/400x300/F3C9A6/2D3748?text=Injured+Cat+7',
 'Cat hit by vehicle on Phahon Yothin Road. Heavy bleeding from hind leg.',
 13.8189, 100.5619, 13.820, 100.562,
 'Road Accident', 'CRITICAL', 92,
 'Likely hit by vehicle. Heavy bleeding from hind leg. The cat is conscious but immobile.',
 ARRAY['Do not move the cat', 'Keep warm', 'Emergency transport needed immediately'],
 now() - interval '5 days'),

-- Case 8: IN_TREATMENT
('c0000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003', 'IN_TREATMENT',
 'https://placehold.co/400x300/F3C9A6/2D3748?text=Injured+Cat+8',
 'Cat with abnormal abdominal swelling, found in Khlong Toei market area.',
 13.7078, 100.5578, 13.708, 100.558,
 'Unknown', 'MEDIUM', 62,
 'Visible abdominal swelling. Unable to determine cause from image alone.',
 ARRAY['Provide a quiet resting area', 'Offer water', 'Do not press on the swelling'],
 now() - interval '6 days'),

-- Case 9: IN_FOSTER (recovered, now in temporary care)
('c0000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000004', 'IN_FOSTER',
 'https://placehold.co/400x300/F3C9A6/2D3748?text=Recovered+Cat+9',
 'Orange tabby with leg wound, found in Thonglor. Fully recovered now.',
 13.7364, 100.5780, 13.737, 100.579,
 'Open Wound', 'MEDIUM', 80,
 'Minor wound on the leg. The cat appears otherwise healthy.',
 ARRAY['Clean the area gently', 'Monitor for infection', 'Keep indoors if possible'],
 now() - interval '14 days'),

-- Case 10: ADOPTED - Complete lifecycle
('c0000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000005', 'ADOPTED',
 'https://placehold.co/400x300/F3C9A6/2D3748?text=Adopted+Cat+10',
 'Tabby with broken hind leg, found near Chulalongkorn University. Now has a new home!',
 13.7380, 100.5322, 13.739, 100.533,
 'Fracture', 'HIGH', 87,
 'Hind leg fracture detected. The cat is immobile and requires immediate veterinary care.',
 ARRAY['Stabilize on flat surface', 'Keep warm and quiet', 'Transport immediately'],
 now() - interval '21 days');

-- ============================================================
-- TRANSPORT REQUESTS
-- ============================================================

-- Case 1: Open transport (awaiting volunteer)
INSERT INTO transport_requests (id, case_id, status, created_at) VALUES
('10000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'OPEN', now() - interval '2 hours');

-- Case 2: Claimed transport (in transit)
INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, created_at) VALUES
('10000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'CLAIMED', now() - interval '4 hours', now() - interval '5 hours');

-- Cases 3-10: Delivered transports
INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, delivered_at, created_at) VALUES
('10000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000004', 'DELIVERED', now() - interval '22 hours', now() - interval '20 hours', now() - interval '1 day'),
('10000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000005', 'DELIVERED', now() - interval '2 days 20 hours', now() - interval '2 days 18 hours', now() - interval '3 days'),
('10000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'DELIVERED', now() - interval '1 day 20 hours', now() - interval '1 day 18 hours', now() - interval '2 days'),
('10000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 'DELIVERED', now() - interval '3 days 20 hours', now() - interval '3 days 18 hours', now() - interval '4 days'),
('10000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000002', 'DELIVERED', now() - interval '4 days 20 hours', now() - interval '4 days 18 hours', now() - interval '5 days'),
('10000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000001', 'DELIVERED', now() - interval '5 days 20 hours', now() - interval '5 days 18 hours', now() - interval '6 days'),
('10000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003', 'DELIVERED', now() - interval '13 days 20 hours', now() - interval '13 days 18 hours', now() - interval '14 days'),
('10000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000005', 'DELIVERED', now() - interval '20 days 20 hours', now() - interval '20 days 18 hours', now() - interval '21 days');

-- ============================================================
-- VET QUOTES (Case 3 intentionally has NO quote for live demo)
-- ============================================================

INSERT INTO vet_quotes (id, case_id, vet_id, quoted_amount, notes, quoted_at) VALUES
('20000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'a2000000-0000-0000-0000-000000000001', 4500.00, 'Skin treatment: topical medication, oral antibiotics, nutritional supplements. Est. 2 weeks recovery.', now() - interval '2 days 12 hours'),
('20000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', 'a2000000-0000-0000-0000-000000000001', 8500.00, 'Wound cleaning, stitches, antibiotics, and 1-week follow-up.', now() - interval '1 day 12 hours'),
('20000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000006', 'a2000000-0000-0000-0000-000000000002', 15000.00, 'Fracture surgery: bone pinning, cast, pain medication, 3-week recovery.', now() - interval '3 days 12 hours'),
('20000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000007', 'a2000000-0000-0000-0000-000000000002', 22000.00, 'Emergency surgery for internal bleeding. ICU stay 3 days.', now() - interval '4 days 12 hours'),
('20000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000008', 'a2000000-0000-0000-0000-000000000001', 6000.00, 'Ultrasound examination, anti-inflammatory medication, monitoring.', now() - interval '5 days 12 hours'),
('20000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000009', 'a2000000-0000-0000-0000-000000000001', 3500.00, 'Wound cleaning, topical antibiotics, follow-up.', now() - interval '13 days'),
('20000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000010', 'a2000000-0000-0000-0000-000000000002', 18000.00, 'Hind leg fracture surgery, bone pinning, 4-week recovery.', now() - interval '20 days');

-- ============================================================
-- DONATIONS
-- ============================================================

INSERT INTO donations (id, case_id, donor_id, amount, status, created_at) VALUES
-- Case 4: 4,500 goal - raised 2,800
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 500.00, 'HELD_IN_ESCROW', now() - interval '2 days'),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 1000.00, 'HELD_IN_ESCROW', now() - interval '1 day 18 hours'),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000005', 800.00, 'HELD_IN_ESCROW', now() - interval '1 day 12 hours'),
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 500.00, 'HELD_IN_ESCROW', now() - interval '1 day'),
-- Case 5: 8,500 goal - raised 5,200
('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 2000.00, 'HELD_IN_ESCROW', now() - interval '1 day 6 hours'),
('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000004', 1500.00, 'HELD_IN_ESCROW', now() - interval '1 day'),
('d0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 1200.00, 'HELD_IN_ESCROW', now() - interval '18 hours'),
('d0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000003', 500.00, 'HELD_IN_ESCROW', now() - interval '12 hours'),
-- Case 6: 15,000 goal - raised 3,000
('d0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000005', 1500.00, 'HELD_IN_ESCROW', now() - interval '3 days'),
('d0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000004', 1500.00, 'HELD_IN_ESCROW', now() - interval '2 days 18 hours'),
-- Cases 7-8: Funded but still in treatment (held in escrow)
('d0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000001', 10000.00, 'HELD_IN_ESCROW', now() - interval '4 days'),
('d0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000004', 12000.00, 'HELD_IN_ESCROW', now() - interval '4 days'),
('d0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000002', 3000.00, 'HELD_IN_ESCROW', now() - interval '5 days'),
('d0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000005', 3000.00, 'HELD_IN_ESCROW', now() - interval '5 days');

-- Cases 9-10: Recovered and released (inserted separately)
INSERT INTO donations (id, case_id, donor_id, amount, status, created_at, released_at) VALUES
('d0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000002', 3500.00, 'RELEASED', now() - interval '12 days', now() - interval '8 days'),
('d0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000003', 10000.00, 'RELEASED', now() - interval '19 days', now() - interval '15 days'),
('d0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000001', 8000.00, 'RELEASED', now() - interval '19 days', now() - interval '15 days');

-- ============================================================
-- TREATMENT RECORDS
-- Disable escrow release trigger during seed to prevent it from
-- overwriting case statuses (IN_FOSTER, ADOPTED) when inserting
-- recovered treatment records.
-- ============================================================

ALTER TABLE treatment_records DISABLE TRIGGER treatment_escrow_release;

INSERT INTO treatment_records (
  id,
  case_id,
  vet_id,
  treatment_summary,
  outcome,
  photo_urls,
  vaccination_status,
  is_neutered,
  special_needs,
  ready_for_adoption,
  ready_for_adoption_at,
  confirmed_at,
  created_at
) VALUES

-- ============================================================
-- Case 7: In treatment
-- ============================================================
(
'30000000-0000-0000-0000-000000000007',
'c0000000-0000-0000-0000-000000000007',
'a2000000-0000-0000-0000-000000000002',
'Emergency surgery to stop internal bleeding completed. Currently recovering in ICU day 2.',
'ONGOING',
'{}',
NULL,
false,
NULL,
false,
NULL,
NULL,
now() - interval '3 days'
),

-- ============================================================
-- Case 8: In treatment
-- ============================================================
(
'30000000-0000-0000-0000-000000000008',
'c0000000-0000-0000-0000-000000000008',
'a2000000-0000-0000-0000-000000000001',
'Ultrasound revealed small cyst. Prescribed anti-inflammatory medication and monitoring.',
'ONGOING',
'{}',
'partial',
false,
'Requires follow-up ultrasound in 30 days.',
false,
NULL,
NULL,
now() - interval '4 days'
),

-- ============================================================
-- Case 9: Ready for adoption (currently in foster)
-- ============================================================
(
'30000000-0000-0000-0000-000000000009',
'c0000000-0000-0000-0000-000000000009',
'a2000000-0000-0000-0000-000000000001',
'Wound fully healed. Vaccinations complete. Healthy and medically cleared for adoption.',
'RECOVERED',
'{}',
'complete',
true,
NULL,
true,
now() - interval '8 days',
now() - interval '7 days',
now() - interval '12 days'
),

-- ============================================================
-- Case 10: Already adopted
-- ============================================================
(
'30000000-0000-0000-0000-000000000010',
'c0000000-0000-0000-0000-000000000010',
'a2000000-0000-0000-0000-000000000002',
'Fracture surgery successful. Leg healed normally. Fully vaccinated and medically cleared.',
'RECOVERED',
'{}',
'complete',
true,
NULL,
true,
now() - interval '11 days',
now() - interval '10 days',
now() - interval '18 days'
);

ALTER TABLE treatment_records ENABLE TRIGGER treatment_escrow_release;

-- ============================================================
-- FOSTER RECORDS
-- ============================================================

INSERT INTO foster_records (
  id,
  case_id,
  caretaker_id,
  started_at,
  ended_at,
  status,
  personality,
  energy_level,
  good_with_children,
  good_with_cats,
  indoor_only,
  ideal_home,
  favourite_activities,
  observations,
  foster_photos,
  behaviour_profile_complete
) VALUES

-- ============================================================
-- Case 9: Currently in foster
-- ============================================================
(
'f0000000-0000-0000-0000-000000000009',
'c0000000-0000-0000-0000-000000000009',
'a1000000-0000-0000-0000-000000000003',
now() - interval '7 days',
NULL,
'ACTIVE',
ARRAY['Affectionate','Playful','Curious'],
'medium',
true,
true,
true,
ARRAY['Apartment','Indoor only','First-time owner'],
ARRAY['Chasing toys','Window watching','Sleeping beside humans'],
'Very friendly after recovery. Enjoys attention and quickly adapts to new people.',
'{}',
true
),

-- ============================================================
-- Case 10: Foster completed -> adopted
-- ============================================================
(
'f0000000-0000-0000-0000-000000000010',
'c0000000-0000-0000-0000-000000000010',
'a1000000-0000-0000-0000-000000000005',
now() - interval '10 days',
now() - interval '3 days',
'ADOPTED',
ARRAY['Calm','Gentle','Lap Cat'],
'low',
true,
true,
true,
ARRAY['Quiet home','Indoor only'],
ARRAY['Cuddling','Sleeping','Gentle play'],
'Excellent temperament. Quickly bonded with adopter and settled in well.',
'{}',
true
);

-- ============================================================
-- ADOPTION LISTINGS
-- Note:
-- personality and medical_notes are kept for backward compatibility.
-- Source of truth is now:
--   treatment_records = medical readiness
--   foster_records = behavioural profile
-- ============================================================

INSERT INTO adoption_listings (
  id,
  case_id,
  description,
  personality,
  medical_notes,
  matched_with,
  status,
  listed_at
) VALUES

-- Case 9: Publicly adoptable
-- Meets adoption gate:
-- treatment_records.ready_for_adoption = true
-- foster_records.behaviour_profile_complete = true
-- adoption_listings.status = OPEN
(
'40000000-0000-0000-0000-000000000009',
'c0000000-0000-0000-0000-000000000009',
'Meet Som-O, a sweet orange tabby rescued near Thonglor. After recovering from a leg wound, she is now healthy, playful, and ready for a loving indoor home.',
'Affectionate, playful, curious. Loves head scratches, window watching, and sleeping beside humans.',
'Medically cleared by Dr. Siriporn. Vaccinations complete. Neutered. No special medical needs.',
NULL,
'OPEN',
now() - interval '5 days'
),

-- Case 10: Adopted successfully
(
'40000000-0000-0000-0000-000000000010',
'c0000000-0000-0000-0000-000000000010',
'Meet Oat, a gentle tabby who recovered from hind leg fracture surgery and has successfully found a forever home.',
'Calm, gentle, affectionate. Enjoys cuddling, quiet spaces, and gentle play.',
'Medically cleared by Dr. Anuwat. Hind leg fracture surgery fully healed. Vaccinations complete. Neutered.',
'a1000000-0000-0000-0000-000000000004',
'COMPLETED',
now() - interval '8 days'
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES
('a1000000-0000-0000-0000-000000000002', 'Transport claimed!', 'Prawit C. has claimed the transport mission for your cat.', 'TRANSPORT_CLAIMED', false, now() - interval '4 hours'),
('a1000000-0000-0000-0000-000000000004', 'Vet quote submitted', 'Dr. Siriporn submitted a treatment quote of 4,500 THB for your cat.', 'QUOTE_SUBMITTED', true, now() - interval '2 days 12 hours'),
('a1000000-0000-0000-0000-000000000004', 'Funding opened!', 'Your rescue case is now open for community funding. Goal: 4,500 THB.', 'FUNDING_OPENED', true, now() - interval '2 days 12 hours'),
('a1000000-0000-0000-0000-000000000002', 'Treatment update', 'Dr. Anuwat updated the treatment status: Surgery completed successfully.', 'TREATMENT_UPDATED', false, now() - interval '3 days'),
('a1000000-0000-0000-0000-000000000004', 'Congratulations!', 'You have been approved as the adopter for the tabby cat.', 'ADOPTION_REQUEST', true, now() - interval '3 days'),
('a1000000-0000-0000-0000-000000000001', 'Welcome!', 'Thank you for joining TabbyFund. Every life matters.', 'SYSTEM', true, now() - interval '30 days');

-- ============================================================
-- STATUS HISTORY (manually inserted for seed since trigger only
-- fires on UPDATE, not on initial INSERT)
-- ============================================================

INSERT INTO case_status_history (case_id, previous_status, new_status, changed_by, changed_at) VALUES
('c0000000-0000-0000-0000-000000000010', NULL, 'REPORTED', 'a1000000-0000-0000-0000-000000000005', now() - interval '21 days'),
('c0000000-0000-0000-0000-000000000010', 'REPORTED', 'TRIAGED', 'a1000000-0000-0000-0000-000000000005', now() - interval '21 days'),
('c0000000-0000-0000-0000-000000000010', 'TRIAGED', 'AWAITING_TRANSPORT', 'a1000000-0000-0000-0000-000000000005', now() - interval '21 days'),
('c0000000-0000-0000-0000-000000000010', 'AWAITING_TRANSPORT', 'IN_TRANSIT', 'a1000000-0000-0000-0000-000000000005', now() - interval '20 days 20 hours'),
('c0000000-0000-0000-0000-000000000010', 'IN_TRANSIT', 'AT_VET', 'a1000000-0000-0000-0000-000000000005', now() - interval '20 days 18 hours'),
('c0000000-0000-0000-0000-000000000010', 'AT_VET', 'QUOTED', 'a2000000-0000-0000-0000-000000000002', now() - interval '20 days'),
('c0000000-0000-0000-0000-000000000010', 'QUOTED', 'FUNDING_OPEN', 'a2000000-0000-0000-0000-000000000002', now() - interval '20 days'),
('c0000000-0000-0000-0000-000000000010', 'FUNDING_OPEN', 'FUNDED', 'a3000000-0000-0000-0000-000000000001', now() - interval '18 days'),
('c0000000-0000-0000-0000-000000000010', 'FUNDED', 'IN_TREATMENT', 'a2000000-0000-0000-0000-000000000002', now() - interval '18 days'),
('c0000000-0000-0000-0000-000000000010', 'IN_TREATMENT', 'TREATED', 'a2000000-0000-0000-0000-000000000002', now() - interval '10 days'),
('c0000000-0000-0000-0000-000000000010', 'TREATED', 'FUNDS_RELEASED', 'a3000000-0000-0000-0000-000000000001', now() - interval '10 days'),
('c0000000-0000-0000-0000-000000000010', 'FUNDS_RELEASED', 'IN_FOSTER', 'a3000000-0000-0000-0000-000000000001', now() - interval '10 days'),
('c0000000-0000-0000-0000-000000000010', 'IN_FOSTER', 'ADOPTED', 'a3000000-0000-0000-0000-000000000001', now() - interval '3 days');