"use client";

import { createClient } from "@/lib/supabase/client";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  storagePath?: string;
  error?: string;
}

/**
 * Upload a foster behaviour photo to the "foster-photos" bucket.
 * Separate from rescue-photos to keep foster media isolated.
 * Path: foster-photos/{user_id}/{timestamp}.{ext}
 */
export async function uploadFosterPhoto(file: File): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: "Please upload a JPG, PNG, or WEBP image." };
  }

  if (file.size > MAX_SIZE) {
    return { success: false, error: "Image must be under 10MB." };
  }

  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "You must be logged in to upload photos." };
  }

  const extension = getExtension(file.type);
  const fileName = `${user.id}/${Date.now()}.${extension}`;

  const { data, error } = await supabase.storage
    .from("foster-photos")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("[foster-upload] Failed:", error.message);
    return { success: false, error: "Upload failed. Please try again." };
  }

  const { data: urlData } = supabase.storage
    .from("foster-photos")
    .getPublicUrl(data.path);

  return {
    success: true,
    publicUrl: urlData.publicUrl,
    storagePath: data.path,
  };
}

/**
 * Delete a foster photo from the foster-photos bucket.
 */
export async function deleteFosterPhoto(storagePath: string): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from("foster-photos").remove([storagePath]);
}

function getExtension(mime: string): string {
  switch (mime) {
    case "image/png": return "png";
    case "image/webp": return "webp";
    default: return "jpg";
  }
}
