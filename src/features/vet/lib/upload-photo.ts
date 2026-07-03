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
 * Upload a treatment photo directly from the client to Supabase Storage.
 * Path: treatment-photos/{vet_user_id}/{timestamp}.{ext}
 */
export async function uploadTreatmentPhoto(file: File): Promise<UploadResult> {
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
    .from("treatment-photos")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("[upload-treatment] Failed:", error.message);
    return { success: false, error: "Upload failed. Please try again." };
  }

  const { data: urlData } = supabase.storage
    .from("treatment-photos")
    .getPublicUrl(data.path);

  return {
    success: true,
    publicUrl: urlData.publicUrl,
    storagePath: data.path,
  };
}

function getExtension(mime: string): string {
  switch (mime) {
    case "image/png": return "png";
    case "image/webp": return "webp";
    default: return "jpg";
  }
}

/**
 * Delete an uploaded photo from storage.
 */
export async function deleteTreatmentPhoto(storagePath: string): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from("treatment-photos").remove([storagePath]);
}
