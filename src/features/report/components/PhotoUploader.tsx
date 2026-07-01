"use client";

import { Camera, X, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { uploadRescuePhoto, deleteUploadedPhoto } from "../lib/upload-photo";

interface PhotoUploaderProps {
  /** Public URL of the uploaded photo (stored in draft) */
  photoUrl?: string;
  /** Storage path for cleanup */
  storagePath?: string;
  /** Local preview URL (blob URL for instant preview) */
  previewUrl?: string;
  onPhotoUploaded: (data: { photoUrl: string; storagePath: string; previewUrl: string } | undefined) => void;
}

/**
 * PhotoUploader — Step 1 of the rescue wizard.
 * Uploads directly to Supabase Storage from the client.
 * Only the URL (not file data) is passed to the server action.
 */
export function PhotoUploader({ photoUrl, storagePath, previewUrl, onPhotoUploaded }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);

    // Client-side validation
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }

    // Create local preview immediately
    const localPreview = URL.createObjectURL(file);

    setIsUploading(true);
    const result = await uploadRescuePhoto(file);
    setIsUploading(false);

    if (result.success && result.publicUrl && result.storagePath) {
      onPhotoUploaded({
        photoUrl: result.publicUrl,
        storagePath: result.storagePath,
        previewUrl: localPreview,
      });
    } else {
      URL.revokeObjectURL(localPreview);
      setError(result.error ?? "Upload failed. Please try again.");
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  async function handleRemove() {
    // Attempt to delete from storage
    if (storagePath) {
      await deleteUploadedPhoto(storagePath);
    }
    onPhotoUploaded(undefined);
  }

  // Show uploaded photo
  if (photoUrl || previewUrl) {
    const displayUrl = previewUrl || photoUrl;
    return (
      <div className="space-y-4">
        <h2 className="font-heading text-base font-semibold text-[#2D3748]">Photo Uploaded</h2>
        <div className="relative overflow-hidden rounded-[12px] border border-[#A788FA]/15">
          <img src={displayUrl} alt="Rescue cat" className="w-full h-56 object-cover" />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
            aria-label="Remove photo"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-[10px] border border-[#A788FA]/20 py-2.5 text-xs font-medium text-[#6C5CE7] transition hover:bg-[#6C5CE7]/5"
        >
          Replace Photo
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleInputChange} />
      </div>
    );
  }

  // Upload state
  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <LoaderCircle size={32} strokeWidth={2} className="animate-spin text-[#6C5CE7] mb-3" />
        <p className="text-sm font-medium text-[#2D3748]">Uploading photo...</p>
        <p className="mt-1 text-xs text-[#2D3748]/50">This may take a moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-base font-semibold text-[#2D3748]">
        Take or upload a photo
      </h2>
      <p className="text-sm text-[#2D3748]/60">
        A clear photo helps the AI assess the cat&apos;s condition and helps volunteers find it.
      </p>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-3 rounded-[14px] border-2 border-dashed border-[#A788FA]/30 bg-[#F7F7FB] p-10 cursor-pointer transition hover:border-[#6C5CE7]/40 hover:bg-[#6C5CE7]/[0.02]"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6C5CE7]/10">
          <Camera size={24} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-[#2D3748]">
            Tap to take a photo or upload
          </p>
          <p className="mt-0.5 text-xs text-[#2D3748]/50">
            Drag & drop on desktop · JPG, PNG, WEBP · Max 10MB
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-[10px] bg-red-50 border border-red-200 p-3">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
