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
 * Upload a rescue photo directly from the client to Supabase Storage.
 * Uses the browser Supabase client (authenticated session via cookies).
 * Path: rescue-photos/{user_id}/{timestamp}.{ext}
 */
export async function uploadRescuePhoto(file: File): Promise<UploadResult> {
  // Validate type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: "Please upload a JPG, PNG, or WEBP image." };
  }

  // Validate size
  if (file.size > MAX_SIZE) {
    return { success: false, error: "Image must be under 10MB." };
  }

  const supabase = createClient();

  // Get current user ID for path
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "You must be logged in to upload photos." };
  }

  const extension = getExtension(file.type);
  const fileName = `${user.id}/${Date.now()}.${extension}`;

  const { data, error } = await supabase.storage
    .from("rescue-photos")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("[upload] Failed:", error.message);
    return { success: false, error: "Upload failed. Please try again." };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("rescue-photos")
    .getPublicUrl(data.path);

  return {
    success: true,
    publicUrl: urlData.publicUrl,
    storagePath: data.path,
  };
}

/**
 * Delete an uploaded photo from storage (cleanup on cancel/retry).
 */
export async function deleteUploadedPhoto(storagePath: string): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from("rescue-photos").remove([storagePath]);
}

function getExtension(mime: string): string {
  switch (mime) {
    case "image/png": return "png";
    case "image/webp": return "webp";
    default: return "jpg";
  }
}
