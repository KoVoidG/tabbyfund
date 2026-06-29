-- Migration 008: Storage bucket policies
-- Buckets are configured in supabase/config.toml with:
--   allowed_mime_types: image/jpeg, image/png, image/webp
--   file_size_limit: 10MiB (rescue/treatment), 5MiB (avatars)
--
-- Folder ownership model: bucket-name/{user_id}/{filename}
-- All uploads enforce folder ownership via:
--   auth.uid()::text = (storage.foldername(name))[1]
--
-- SELECT policies are authenticated-only (not fully public)
-- to prevent unauthenticated scraping of image URLs.

-- ============================================================
-- rescue-photos: uploaded during case reporting
-- Folder structure: rescue-photos/{user_id}/{filename}
-- MIME/size configured in config.toml: image/jpeg, image/png, image/webp, max 10MiB
-- ============================================================

CREATE POLICY "Authenticated users can view rescue photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'rescue-photos'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authenticated users can upload rescue photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'rescue-photos'
    AND auth.uid() IS NOT NULL
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own rescue photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'rescue-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- treatment-photos: uploaded by verified vets during treatment
-- Folder structure: treatment-photos/{vet_user_id}/{filename}
-- MIME/size configured in config.toml: image/jpeg, image/png, image/webp, max 10MiB
-- ============================================================

CREATE POLICY "Authenticated users can view treatment photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'treatment-photos'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Verified vets can upload treatment photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'treatment-photos'
    AND (SELECT is_verified_vet())
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Verified vets can delete own treatment photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'treatment-photos'
    AND (SELECT is_verified_vet())
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- avatars: user profile pictures
-- Folder structure: avatars/{user_id}/{filename}
-- MIME/size configured in config.toml: image/jpeg, image/png, image/webp, max 5MiB
-- ============================================================

CREATE POLICY "Authenticated users can view avatars"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
