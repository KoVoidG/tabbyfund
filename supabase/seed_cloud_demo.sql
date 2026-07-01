-- ==========================================================================
-- TabbyFund Cloud Demo Seed
-- ==========================================================================
-- SAFE FOR HOSTED SUPABASE: Does NOT insert into auth.users or auth.identities.
-- Auth users must be created manually in the Supabase Dashboard first.
--
-- REQUIRED AUTH USERS (create in Dashboard > Authentication > Users):
--   somchai@example.com    (password123) — community
--   nattaya@example.com    (password123) — community
--   prawit@example.com     (password123) — community
--   kannika@example.com    (password123) — community
--   thana@example.com      (password123) — community
--   dr.siriporn@example.com (password123) — vet (verified)
--   dr.anuwat@example.com  (password123) — vet (verified)
--   dr.newvet@example.com  (password123) — vet (pending)
--   admin@tabbyfund.com    (password123) — admin
--
-- HOW TO RUN:
--   1. Create all auth users in Supabase Dashboard
--   2. Run cleanup: see CLEANUP section below
--   3. Run this file via SQL Editor in Supabase Dashboard
-- ==========================================================================

-- ==========================================================================
-- STEP 0: Lookup Auth User IDs dynamically
-- ==========================================================================

DO $$
DECLARE
  v_somchai   uuid;
  v_nattaya   uuid;
  v_prawit    uuid;
  v_kannika   uuid;
  v_thana     uuid;
  v_siriporn  uuid;
  v_anuwat    uuid;
  v_newvet    uuid;
  v_admin     uuid;
BEGIN
  SELECT id INTO v_somchai  FROM auth.users WHERE email = 'somchai@example.com';
  SELECT id INTO v_nattaya  FROM auth.users WHERE email = 'nattaya@example.com';
  SELECT id INTO v_prawit   FROM auth.users WHERE email = 'prawit@example.com';
  SELECT id INTO v_kannika  FROM auth.users WHERE email = 'kannika@example.com';
  SELECT id INTO v_thana    FROM auth.users WHERE email = 'thana@example.com';
  SELECT id INTO v_siriporn FROM auth.users WHERE email = 'dr.siriporn@example.com';
  SELECT id INTO v_anuwat   FROM auth.users WHERE email = 'dr.anuwat@example.com';
  SELECT id INTO v_newvet   FROM auth.users WHERE email = 'dr.newvet@example.com';
  SELECT id INTO v_admin    FROM auth.users WHERE email = 'admin@tabbyfund.com';

  -- Safety check: fail clearly if any user is missing
  IF v_somchai IS NULL THEN RAISE EXCEPTION 'MISSING AUTH USER: somchai@example.com'; END IF;
  IF v_nattaya IS NULL THEN RAISE EXCEPTION 'MISSING AUTH USER: nattaya@example.com'; END IF;
  IF v_prawit  IS NULL THEN RAISE EXCEPTION 'MISSING AUTH USER: prawit@example.com'; END IF;
  IF v_kannika IS NULL THEN RAISE EXCEPTION 'MISSING AUTH USER: kannika@example.com'; END IF;
  IF v_thana   IS NULL THEN RAISE EXCEPTION 'MISSING AUTH USER: thana@example.com'; END IF;
  IF v_siriporn IS NULL THEN RAISE EXCEPTION 'MISSING AUTH USER: dr.siriporn@example.com'; END IF;
  IF v_anuwat  IS NULL THEN RAISE EXCEPTION 'MISSING AUTH USER: dr.anuwat@example.com'; END IF;
  IF v_newvet  IS NULL THEN RAISE EXCEPTION 'MISSING AUTH USER: dr.newvet@example.com'; END IF;
  IF v_admin   IS NULL THEN RAISE EXCEPTION 'MISSING AUTH USER: admin@tabbyfund.com'; END IF;

  RAISE NOTICE 'All 9 auth users found. Proceeding with seed...';

  -- ========================================================================
  -- STEP 1: Clean existing demo data (correct FK order)
  -- ========================================================================
  DELETE FROM notifications;
  DELETE FROM case_status_history;
  DELETE FROM adoption_listings;
  DELETE FROM foster_records;
  DELETE FROM treatment_records;
  DELETE FROM donations;
  DELETE FROM vet_quotes;
  DELETE FROM transport_requests;
  DELETE FROM cases;
  -- Do NOT delete profiles — we upsert them next

  -- ========================================================================
  -- STEP 2: Upsert profiles with correct roles
  -- ========================================================================
  ALTER TABLE profiles DISABLE TRIGGER profiles_protect_fields;

  INSERT INTO profiles (id, display_name, avatar_url, role, is_verified, clinic_name, clinic_address, clinic_lat, clinic_lng) VALUES
    (v_somchai,  'Somchai K.',      NULL, 'community', false, NULL, NULL, NULL, NULL),
    (v_nattaya,  'Nattaya S.',      NULL, 'community', false, NULL, NULL, NULL, NULL),
    (v_prawit,   'Prawit C.',       NULL, 'community', false, NULL, NULL, NULL, NULL),
    (v_kannika,  'Kannika W.',      NULL, 'community', false, NULL, NULL, NULL, NULL),
    (v_thana,    'Thana P.',        NULL, 'community', false, NULL, NULL, NULL, NULL),
    (v_siriporn, 'Dr. Siriporn',    NULL, 'vet',       true,  'Siriporn Animal Clinic', '45 Sukhumvit Soi 39, Bangkok', 13.7365, 100.5690),
    (v_anuwat,   'Dr. Anuwat',      NULL, 'vet',       true,  'Anuwat Veterinary Hospital', '12 Phahon Yothin Soi 7, Bangkok', 13.7950, 100.5530),
    (v_newvet,   'Dr. Somjai',      NULL, 'vet',       false, 'Bangkok Pet Clinic', '88 Ari Soi 1, Bangkok', 13.7790, 100.5450),
    (v_admin,    'TabbyFund Admin', NULL, 'admin',     true,  NULL, NULL, NULL, NULL)
  ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    role = EXCLUDED.role,
    is_verified = EXCLUDED.is_verified,
    clinic_name = EXCLUDED.clinic_name,
    clinic_address = EXCLUDED.clinic_address,
    clinic_lat = EXCLUDED.clinic_lat,
    clinic_lng = EXCLUDED.clinic_lng;

  ALTER TABLE profiles ENABLE TRIGGER profiles_protect_fields;

  -- ========================================================================
  -- STEP 3: Cases (15 scenarios)
  -- ========================================================================

  INSERT INTO cases (id, reporter_id, status, photo_url, description, precise_lat, precise_lng, fuzzed_lat, fuzzed_lng, ai_condition, ai_severity, ai_confidence, ai_reasoning, ai_first_aid, ai_analyzed_at) VALUES
  -- Case 1: AWAITING_TRANSPORT — needs volunteer
  ('c0000000-0000-0000-0000-000000000001', v_somchai, 'AWAITING_TRANSPORT',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Fracture',
   'Cat hit by car near Sukhumvit Soi 23. Hind leg broken, unable to stand.',
   13.7380, 100.5608, 13.739, 100.562,
   'Fracture', 'CRITICAL', 91,
   'Unable to stand. Visible swelling on hind leg suggests fracture.',
   ARRAY['Do not move forcefully','Keep area quiet','Provide water','Contact transporter'],
   now() - interval '2 hours'),

  -- Case 2: IN_TRANSIT — volunteer claimed
  ('c0000000-0000-0000-0000-000000000002', v_nattaya, 'IN_TRANSIT',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Open+Wound',
   'Cat with large open wound on back, found near Chatuchak market.',
   13.7999, 100.5533, 13.801, 100.554,
   'Open Wound', 'HIGH', 85,
   'Large open wound on back. Moderate bleeding. Conscious but lethargic.',
   ARRAY['Do not touch wound','Keep warm with towel','Avoid chasing'],
   now() - interval '5 hours'),

  -- Case 3: AT_VET — awaiting vet quote (demo: vet creates quote here)
  ('c0000000-0000-0000-0000-000000000003', v_prawit, 'AT_VET',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Eye+Injury',
   'Cat with swollen eye and discharge, found in Ari. Now at vet.',
   13.7788, 100.5447, 13.780, 100.545,
   'Eye Injury', 'MEDIUM', 78,
   'Swollen left eye with discharge. Otherwise healthy and mobile.',
   ARRAY['Do not clean eye','Keep calm environment','Provide water'],
   now() - interval '1 day'),

  -- Case 4: FUNDING_OPEN — partially funded (62%)
  ('c0000000-0000-0000-0000-000000000004', v_kannika, 'FUNDING_OPEN',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Skin+Condition',
   'Malnourished cat with skin condition behind Wat Phra Kaew.',
   13.7516, 100.4926, 13.752, 100.493,
   'Skin Condition', 'MEDIUM', 74,
   'Severe malnutrition, widespread skin condition, fur loss.',
   ARRAY['Provide food','Do not force into carrier','Contact shelter'],
   now() - interval '3 days'),

  -- Case 5: FUNDING_OPEN — partially funded (61%)
  ('c0000000-0000-0000-0000-000000000005', v_thana, 'FUNDING_OPEN',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Dog+Bite',
   'Cat bitten by dog with multiple wounds near Lumpini Park.',
   13.7311, 100.5418, 13.732, 100.542,
   'Open Wound', 'HIGH', 88,
   'Multiple bite wounds. Some infected. Alert but in pain.',
   ARRAY['Do not touch wounds','Keep calm','Transport to vet ASAP'],
   now() - interval '2 days'),

  -- Case 6: FUNDING_OPEN — early funding (20%)
  ('c0000000-0000-0000-0000-000000000006', v_somchai, 'FUNDING_OPEN',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Fracture+Silom',
   'Cat with broken front leg from height fall near Silom condo.',
   13.7252, 100.5347, 13.726, 100.535,
   'Fracture', 'HIGH', 83,
   'Front leg broken from fall. Cannot put weight on it.',
   ARRAY['Do not splint','Keep still','Use flat surface for transport'],
   now() - interval '4 days'),

  -- Case 7: IN_TREATMENT — active surgery/ICU
  ('c0000000-0000-0000-0000-000000000007', v_nattaya, 'IN_TREATMENT',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Road+Accident',
   'Cat hit by vehicle on Phahon Yothin. Heavy bleeding from hind leg.',
   13.8189, 100.5619, 13.820, 100.562,
   'Road Accident', 'CRITICAL', 92,
   'Likely hit by vehicle. Heavy bleeding. Conscious but immobile.',
   ARRAY['Do not move','Keep warm','Emergency transport needed'],
   now() - interval '5 days'),

  -- Case 8: IN_TREATMENT — monitoring
  ('c0000000-0000-0000-0000-000000000008', v_prawit, 'IN_TREATMENT',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Abdominal',
   'Cat with abdominal swelling in Khlong Toei market area.',
   13.7078, 100.5578, 13.708, 100.558,
   'Unknown', 'MEDIUM', 62,
   'Visible abdominal swelling. Cannot determine cause from image.',
   ARRAY['Quiet resting area','Offer water','Do not press swelling'],
   now() - interval '6 days'),

  -- Case 9: IN_FOSTER — behaviour profile complete, publicly adoptable
  ('c0000000-0000-0000-0000-000000000009', v_kannika, 'IN_FOSTER',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Orange+Tabby',
   'Orange tabby with leg wound from Thonglor. Fully recovered.',
   13.7364, 100.5780, 13.737, 100.579,
   'Open Wound', 'MEDIUM', 80,
   'Minor leg wound. Otherwise healthy.',
   ARRAY['Clean gently','Monitor infection','Keep indoors'],
   now() - interval '14 days'),

  -- Case 10: ADOPTED — complete lifecycle
  ('c0000000-0000-0000-0000-000000000010', v_thana, 'ADOPTED',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Adopted+Tabby',
   'Tabby with broken hind leg near Chulalongkorn. Now adopted!',
   13.7380, 100.5322, 13.739, 100.533,
   'Fracture', 'HIGH', 87,
   'Hind leg fracture. Immobile, requires immediate vet care.',
   ARRAY['Stabilize on flat surface','Keep warm','Transport immediately'],
   now() - interval '21 days'),

  -- Case 11: IN_TRANSIT — reporter self-transports
  ('c0000000-0000-0000-0000-000000000011', v_somchai, 'IN_TRANSIT',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Self+Transport',
   'Kitten found under parked car on Ratchadamri. Reporter transporting.',
   13.7439, 100.5401, 13.744, 100.541,
   'Dehydration', 'MEDIUM', 72,
   'Small kitten dehydrated and weak. No visible wounds.',
   ARRAY['Offer water','Keep warm','Transport gently'],
   now() - interval '1 hour'),

  -- Case 12: FUNDED — ready for vet to start treatment
  ('c0000000-0000-0000-0000-000000000012', v_kannika, 'FUNDED',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Funded',
   'Cat with infected ear from canal near Bang Rak. Fully funded.',
   13.7261, 100.5149, 13.727, 100.515,
   'Ear Infection', 'MEDIUM', 76,
   'Visible infection on left ear. Swelling and discharge.',
   ARRAY['Do not touch ear','Keep from water','Vet care needed'],
   now() - interval '6 days'),

  -- Case 13: TREATED — needs caretaker volunteer
  ('c0000000-0000-0000-0000-000000000013', v_nattaya, 'TREATED',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Needs+Caretaker',
   'Recovered from respiratory infection near Saphan Kwai. Needs caretaker.',
   13.7928, 100.5491, 13.793, 100.550,
   'Respiratory Infection', 'LOW', 82,
   'Respiratory infection treated successfully. Cat is healthy.',
   ARRAY['Warm environment','Monitor breathing'],
   now() - interval '10 days'),

  -- Case 14: TREATED — NOT ready for adoption
  ('c0000000-0000-0000-0000-000000000014', v_prawit, 'TREATED',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Not+Adoptable',
   'Recovered from leg injury but chronic joint condition. Ongoing care needed.',
   13.7460, 100.5687, 13.747, 100.569,
   'Chronic Joint Issue', 'LOW', 70,
   'Leg healed but chronic joint condition remains.',
   ARRAY['Gentle handling','Avoid jumps'],
   now() - interval '12 days'),

  -- Case 15: DECEASED — terminal
  ('c0000000-0000-0000-0000-000000000015', v_thana, 'DECEASED',
   'https://placehold.co/400x300/F3C9A6/2D3748?text=Memorial',
   'Cat with severe internal injuries near expressway. Did not survive.',
   13.7615, 100.5692, 13.762, 100.570,
   'Internal Injuries', 'CRITICAL', 95,
   'Severe internal injuries. Extremely critical.',
   ARRAY['Do not move','Keep warm','Emergency vet needed'],
   now() - interval '15 days');

  -- ========================================================================
  -- STEP 4: Transport Requests
  -- ========================================================================

  -- Case 1: Open transport (awaiting volunteer)
  INSERT INTO transport_requests (id, case_id, status, created_at) VALUES
  ('10000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'OPEN', now() - interval '2 hours');

  -- Case 2: Claimed transport (volunteer in transit)
  INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, created_at) VALUES
  ('10000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', v_prawit, 'CLAIMED', now() - interval '4 hours', now() - interval '5 hours');

  -- Cases 3-10: Delivered transports
  INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, delivered_at, created_at) VALUES
  ('10000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', v_kannika, 'DELIVERED', now() - interval '22 hours', now() - interval '20 hours', now() - interval '1 day'),
  ('10000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', v_thana, 'DELIVERED', now() - interval '2 days 20 hours', now() - interval '2 days 18 hours', now() - interval '3 days'),
  ('10000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', v_somchai, 'DELIVERED', now() - interval '1 day 20 hours', now() - interval '1 day 18 hours', now() - interval '2 days'),
  ('10000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000006', v_prawit, 'DELIVERED', now() - interval '3 days 20 hours', now() - interval '3 days 18 hours', now() - interval '4 days'),
  ('10000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000007', v_nattaya, 'DELIVERED', now() - interval '4 days 20 hours', now() - interval '4 days 18 hours', now() - interval '5 days'),
  ('10000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000008', v_somchai, 'DELIVERED', now() - interval '5 days 20 hours', now() - interval '5 days 18 hours', now() - interval '6 days'),
  ('10000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000009', v_prawit, 'DELIVERED', now() - interval '13 days 20 hours', now() - interval '13 days 18 hours', now() - interval '14 days'),
  ('10000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000010', v_thana, 'DELIVERED', now() - interval '20 days 20 hours', now() - interval '20 days 18 hours', now() - interval '21 days');

  -- Case 11: Reporter self-transports (reporter = transporter)
  INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, created_at) VALUES
  ('10000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000011', v_somchai, 'CLAIMED', now() - interval '1 hour', now() - interval '1 hour');

  -- Case 12: Delivered (funded case)
  INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, delivered_at, created_at) VALUES
  ('10000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000012', v_nattaya, 'DELIVERED', now() - interval '5 days 20 hours', now() - interval '5 days 18 hours', now() - interval '6 days');

  -- Case 13: Delivered (treated, needs caretaker)
  INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, delivered_at, created_at) VALUES
  ('10000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000013', v_kannika, 'DELIVERED', now() - interval '9 days 20 hours', now() - interval '9 days 18 hours', now() - interval '10 days');

  -- Case 14: Delivered (not adoptable)
  INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, delivered_at, created_at) VALUES
  ('10000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000014', v_somchai, 'DELIVERED', now() - interval '11 days', now() - interval '10 days 22 hours', now() - interval '12 days');

  -- Case 15: Delivered (deceased)
  INSERT INTO transport_requests (id, case_id, claimed_by, status, claimed_at, delivered_at, created_at) VALUES
  ('10000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000015', v_prawit, 'DELIVERED', now() - interval '14 days 22 hours', now() - interval '14 days 20 hours', now() - interval '15 days');

  -- ========================================================================
  -- STEP 5: Vet Quotes (Case 3 intentionally has NO quote for live demo)
  -- ========================================================================

  INSERT INTO vet_quotes (id, case_id, vet_id, quoted_amount, notes, quoted_at) VALUES
  ('20000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', v_siriporn, 4500.00, 'Skin treatment: topical medication, oral antibiotics, supplements. 2 weeks.', now() - interval '2 days 12 hours'),
  ('20000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', v_siriporn, 8500.00, 'Wound cleaning, stitches, antibiotics, 1-week follow-up.', now() - interval '1 day 12 hours'),
  ('20000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000006', v_anuwat, 15000.00, 'Fracture surgery: bone pinning, cast, pain medication, 3 weeks.', now() - interval '3 days 12 hours'),
  ('20000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000007', v_anuwat, 22000.00, 'Emergency surgery for internal bleeding. ICU 3 days.', now() - interval '4 days 12 hours'),
  ('20000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000008', v_siriporn, 6000.00, 'Ultrasound, anti-inflammatory, monitoring.', now() - interval '5 days 12 hours'),
  ('20000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000009', v_siriporn, 3500.00, 'Wound cleaning, topical antibiotics, follow-up.', now() - interval '13 days'),
  ('20000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000010', v_anuwat, 18000.00, 'Hind leg fracture surgery, bone pinning, 4 weeks.', now() - interval '20 days'),
  ('20000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000012', v_siriporn, 5000.00, 'Ear cleaning, antibiotics, anti-inflammatory. 1 week.', now() - interval '5 days'),
  ('20000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000013', v_siriporn, 2500.00, 'Antibiotics and nebulizer. 5-day course.', now() - interval '9 days'),
  ('20000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000014', v_anuwat, 7000.00, 'Leg treatment and joint assessment.', now() - interval '10 days'),
  ('20000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000015', v_anuwat, 25000.00, 'Emergency surgery attempt. Critical condition.', now() - interval '14 days 18 hours');

  -- ========================================================================
  -- STEP 6: Donations
  -- ========================================================================

  INSERT INTO donations (id, case_id, donor_id, amount, status, created_at) VALUES
  -- Case 4: goal 4500, raised 2800
  ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', v_somchai, 500.00, 'HELD_IN_ESCROW', now() - interval '2 days'),
  ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', v_nattaya, 1000.00, 'HELD_IN_ESCROW', now() - interval '1 day 18 hours'),
  ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004', v_thana, 800.00, 'HELD_IN_ESCROW', now() - interval '1 day 12 hours'),
  ('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', v_prawit, 500.00, 'HELD_IN_ESCROW', now() - interval '1 day'),
  -- Case 5: goal 8500, raised 5200
  ('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', v_nattaya, 2000.00, 'HELD_IN_ESCROW', now() - interval '1 day 6 hours'),
  ('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000005', v_kannika, 1500.00, 'HELD_IN_ESCROW', now() - interval '1 day'),
  ('d0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000005', v_somchai, 1200.00, 'HELD_IN_ESCROW', now() - interval '18 hours'),
  ('d0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000005', v_prawit, 500.00, 'HELD_IN_ESCROW', now() - interval '12 hours'),
  -- Case 6: goal 15000, raised 3000
  ('d0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000006', v_thana, 1500.00, 'HELD_IN_ESCROW', now() - interval '3 days'),
  ('d0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000006', v_kannika, 1500.00, 'HELD_IN_ESCROW', now() - interval '2 days 18 hours'),
  -- Case 7: fully funded 22000 (in treatment)
  ('d0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000007', v_somchai, 10000.00, 'HELD_IN_ESCROW', now() - interval '4 days'),
  ('d0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000007', v_kannika, 12000.00, 'HELD_IN_ESCROW', now() - interval '4 days'),
  -- Case 8: funded 6000 (in treatment)
  ('d0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000008', v_nattaya, 3000.00, 'HELD_IN_ESCROW', now() - interval '5 days'),
  ('d0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000008', v_thana, 3000.00, 'HELD_IN_ESCROW', now() - interval '5 days'),
  -- Case 12: fully funded 5000
  ('d0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000012', v_somchai, 3000.00, 'HELD_IN_ESCROW', now() - interval '4 days'),
  ('d0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000012', v_thana, 2000.00, 'HELD_IN_ESCROW', now() - interval '3 days');

  -- Released donations (recovered/adopted cases)
  INSERT INTO donations (id, case_id, donor_id, amount, status, created_at, released_at) VALUES
  ('d0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000009', v_nattaya, 3500.00, 'RELEASED', now() - interval '12 days', now() - interval '8 days'),
  ('d0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000010', v_prawit, 10000.00, 'RELEASED', now() - interval '19 days', now() - interval '15 days'),
  ('d0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000010', v_somchai, 8000.00, 'RELEASED', now() - interval '19 days', now() - interval '15 days'),
  ('d0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000013', v_prawit, 2500.00, 'RELEASED', now() - interval '8 days', now() - interval '5 days'),
  ('d0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000014', v_nattaya, 4000.00, 'RELEASED', now() - interval '9 days', now() - interval '6 days'),
  ('d0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000014', v_thana, 3000.00, 'RELEASED', now() - interval '9 days', now() - interval '6 days');

  -- Refunded donations (deceased case)
  INSERT INTO donations (id, case_id, donor_id, amount, status, created_at, released_at) VALUES
  ('d0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000015', v_somchai, 15000.00, 'REFUNDED', now() - interval '14 days', now() - interval '12 days'),
  ('d0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000015', v_kannika, 10000.00, 'REFUNDED', now() - interval '14 days', now() - interval '12 days');

  -- ========================================================================
  -- STEP 7: Treatment Records (disable escrow trigger during seed)
  -- ========================================================================

  ALTER TABLE treatment_records DISABLE TRIGGER treatment_escrow_release;

  INSERT INTO treatment_records (id, case_id, vet_id, treatment_summary, outcome, photo_urls, vaccination_status, is_neutered, special_needs, ready_for_adoption, ready_for_adoption_at, confirmed_at, created_at) VALUES
  -- Case 7: In treatment (ongoing)
  ('30000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000007', v_anuwat,
   'Emergency surgery to stop internal bleeding. Recovering in ICU day 2.',
   'ONGOING', '{}', NULL, false, NULL, false, NULL, NULL, now() - interval '3 days'),
  -- Case 8: In treatment (ongoing)
  ('30000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000008', v_siriporn,
   'Ultrasound revealed small cyst. Anti-inflammatory prescribed. Monitoring.',
   'ONGOING', '{}', 'partial', false, 'Requires follow-up ultrasound in 30 days.', false, NULL, NULL, now() - interval '4 days'),
  -- Case 9: Recovered, adoption-ready, in foster
  ('30000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000009', v_siriporn,
   'Wound fully healed. Vaccinations complete. Medically cleared for adoption.',
   'RECOVERED', '{}', 'complete', true, NULL, true, now() - interval '8 days', now() - interval '7 days', now() - interval '12 days'),
  -- Case 10: Recovered, adopted
  ('30000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000010', v_anuwat,
   'Fracture surgery successful. Leg healed. Fully vaccinated and cleared.',
   'RECOVERED', '{}', 'complete', true, NULL, true, now() - interval '11 days', now() - interval '10 days', now() - interval '18 days'),
  -- Case 13: Recovered, adoption-ready, NO foster yet
  ('30000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000013', v_siriporn,
   'Respiratory infection fully resolved. Cat is healthy and active.',
   'RECOVERED', '{}', 'complete', true, NULL, true, now() - interval '5 days', now() - interval '5 days', now() - interval '7 days'),
  -- Case 14: Recovered, NOT adoption-ready
  ('30000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000014', v_anuwat,
   'Leg healed but chronic joint condition. Requires ongoing medication. Not suitable for general adoption.',
   'RECOVERED', '{}', 'complete', true, 'Daily joint supplement, monthly vet check-up.', false, NULL, now() - interval '6 days', now() - interval '8 days'),
  -- Case 15: Deceased
  ('30000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000015', v_anuwat,
   'Emergency surgery attempted. Internal injuries too severe. Did not survive.',
   'DECEASED', '{}', NULL, false, NULL, false, NULL, now() - interval '12 days', now() - interval '13 days');

  ALTER TABLE treatment_records ENABLE TRIGGER treatment_escrow_release;

  -- ========================================================================
  -- STEP 8: Foster Records
  -- ========================================================================

  INSERT INTO foster_records (id, case_id, caretaker_id, started_at, ended_at, status, personality, energy_level, good_with_children, good_with_cats, indoor_only, ideal_home, favourite_activities, observations, foster_photos, behaviour_profile_complete) VALUES
  -- Case 9: Active foster, behaviour profile COMPLETE (publicly adoptable)
  ('f0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000009', v_prawit,
   now() - interval '7 days', NULL, 'ACTIVE',
   ARRAY['Affectionate','Playful','Curious'], 'medium', true, true, true,
   ARRAY['Apartment','Indoor only','First-time owner'],
   ARRAY['Chasing toys','Window watching','Sleeping beside humans'],
   'Very friendly after recovery. Enjoys attention and adapts quickly to new people.',
   '{}', true),
  -- Case 10: Foster completed → adopted
  ('f0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000010', v_thana,
   now() - interval '10 days', now() - interval '3 days', 'ADOPTED',
   ARRAY['Calm','Gentle','Lap Cat'], 'low', true, true, true,
   ARRAY['Quiet home','Indoor only'],
   ARRAY['Cuddling','Sleeping','Gentle play'],
   'Excellent temperament. Quickly bonded with adopter.',
   '{}', true);

  -- NOTE: Case 13 intentionally has NO foster record — shows "Volunteer as Caretaker" button

  -- ========================================================================
  -- STEP 9: Adoption Listings
  -- ========================================================================

  INSERT INTO adoption_listings (id, case_id, description, personality, medical_notes, matched_with, status, listed_at) VALUES
  -- Case 9: Publicly adoptable (all 3 conditions met)
  ('40000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000009',
   'Meet Som-O, a sweet orange tabby rescued near Thonglor. Healthy, playful, ready for a loving indoor home.',
   'Affectionate, playful, curious. Loves head scratches, window watching, sleeping beside humans.',
   'Medically cleared by Dr. Siriporn. Vaccinations complete. Neutered. No special needs.',
   NULL, 'OPEN', now() - interval '5 days'),
  -- Case 10: Adopted
  ('40000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000010',
   'Meet Oat, a gentle tabby recovered from hind leg fracture. Found a forever home.',
   'Calm, gentle, affectionate. Enjoys cuddling and quiet spaces.',
   'Medically cleared by Dr. Anuwat. Fracture healed. Vaccinations complete. Neutered.',
   v_kannika, 'COMPLETED', now() - interval '8 days'),
  -- Case 13: Listing exists but NO foster → NOT visible in public_adoptable_cats
  ('40000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000013',
   'Healthy cat awaiting temporary caretaker before adoption.',
   NULL, NULL, NULL, 'OPEN', now() - interval '5 days');

  -- ========================================================================
  -- STEP 10: Notifications
  -- ========================================================================

  INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES
  (v_nattaya, 'Transport claimed!', 'Prawit C. has claimed the transport for your reported cat.', 'TRANSPORT_CLAIMED', false, now() - interval '4 hours'),
  (v_kannika, 'Vet quote submitted', 'Dr. Siriporn submitted a treatment quote of 4,500 THB.', 'QUOTE_SUBMITTED', true, now() - interval '2 days 12 hours'),
  (v_kannika, 'Funding opened!', 'Your rescue case is now open for community funding. Goal: 4,500 THB.', 'FUNDING_OPENED', true, now() - interval '2 days 12 hours'),
  (v_nattaya, 'Treatment update', 'Dr. Anuwat: Surgery completed successfully.', 'TREATMENT_UPDATED', false, now() - interval '3 days'),
  (v_kannika, 'Adoption matched!', 'You have been matched with the tabby cat for adoption.', 'ADOPTION_REQUEST', true, now() - interval '3 days'),
  (v_somchai, 'Welcome to TabbyFund!', 'Thank you for joining. Every life matters.', 'SYSTEM', true, now() - interval '30 days'),
  (v_somchai, 'Your transport is active', 'You are transporting the kitten from Ratchadamri.', 'TRANSPORT_CLAIMED', false, now() - interval '1 hour'),
  (v_prawit, 'Funding complete!', 'The ear infection case has been fully funded.', 'FUNDING_COMPLETED', false, now() - interval '3 days'),
  (v_thana, 'Sad news', 'The cat with internal injuries did not survive. Donations refunded.', 'SYSTEM', true, now() - interval '12 days'),
  (v_admin, 'New vet application', 'Dr. Somjai has applied for vet verification.', 'SYSTEM', false, now() - interval '1 day');

  -- ========================================================================
  -- STEP 11: Case Status History (for Case 10 — complete lifecycle)
  -- ========================================================================

  INSERT INTO case_status_history (case_id, previous_status, new_status, changed_by, changed_at) VALUES
  ('c0000000-0000-0000-0000-000000000010', NULL, 'REPORTED', v_thana, now() - interval '21 days'),
  ('c0000000-0000-0000-0000-000000000010', 'REPORTED', 'AWAITING_TRANSPORT', v_thana, now() - interval '21 days'),
  ('c0000000-0000-0000-0000-000000000010', 'AWAITING_TRANSPORT', 'IN_TRANSIT', v_thana, now() - interval '20 days 20 hours'),
  ('c0000000-0000-0000-0000-000000000010', 'IN_TRANSIT', 'AT_VET', v_thana, now() - interval '20 days 18 hours'),
  ('c0000000-0000-0000-0000-000000000010', 'AT_VET', 'FUNDING_OPEN', v_anuwat, now() - interval '20 days'),
  ('c0000000-0000-0000-0000-000000000010', 'FUNDING_OPEN', 'FUNDED', v_admin, now() - interval '18 days'),
  ('c0000000-0000-0000-0000-000000000010', 'FUNDED', 'IN_TREATMENT', v_anuwat, now() - interval '18 days'),
  ('c0000000-0000-0000-0000-000000000010', 'IN_TREATMENT', 'TREATED', v_anuwat, now() - interval '10 days'),
  ('c0000000-0000-0000-0000-000000000010', 'TREATED', 'IN_FOSTER', v_admin, now() - interval '10 days'),
  ('c0000000-0000-0000-0000-000000000010', 'IN_FOSTER', 'ADOPTED', v_admin, now() - interval '3 days');

  RAISE NOTICE 'Cloud demo seed completed successfully! 15 cases, 9 users.';
END $$;
