"use client";

import { Camera, X, LoaderCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(previewUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with incoming draft values if any (e.g. on restoration)
  useEffect(() => {
    if (previewUrl || photoUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalPreview(previewUrl || photoUrl || null);
    } else {
      setLocalPreview(null);
      setSelectedFile(null);
    }
  }, [previewUrl, photoUrl]);

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

    if (localPreview && !photoUrl) {
      URL.revokeObjectURL(localPreview);
    }

    const preview = URL.createObjectURL(file);
    setSelectedFile(file);
    setLocalPreview(preview);
    onPhotoUploaded(undefined); // Clear any previous uploaded data
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
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
    if (storagePath) {
      await deleteUploadedPhoto(storagePath);
    }
    if (localPreview && !photoUrl) {
      URL.revokeObjectURL(localPreview);
    }
    setLocalPreview(null);
    setSelectedFile(null);
    onPhotoUploaded(undefined);
  }

  async function handleCloudUpload() {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    try {
      const result = await uploadRescuePhoto(selectedFile);
      if (result.success && result.publicUrl && result.storagePath) {
        onPhotoUploaded({
          photoUrl: result.publicUrl,
          storagePath: result.storagePath,
          previewUrl: localPreview || result.publicUrl,
        });
      } else {
        setError(result.error ?? "Failed to upload photo.");
      }
    } catch (err) {
      setError("Failed to upload photo.");
    } finally {
      setIsUploading(false);
    }
  }

  // Show uploaded photo or preview
  if (localPreview) {
    return (
      <div className="space-y-4">
        <label className="mb-1.5 block text-xs font-medium text-[#2D3748]">Upload one rescue photo</label>
        
        <div className="relative overflow-hidden rounded-[12px] border border-[#A788FA]/15 w-full max-w-[320px] h-56 bg-slate-50">
          <img src={localPreview} alt="Rescue cat preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
            aria-label="Remove photo"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {photoUrl ? (
          <span className="text-[10px] text-emerald-600 font-medium block">✓ Uploaded to cloud successfully</span>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCloudUpload}
              disabled={isUploading}
              className="flex h-9 items-center gap-1.5 rounded-[10px] bg-[#6C5CE7] px-4 py-2 text-xs font-semibold text-white hover:bg-[#A788FA] transition disabled:opacity-50"
            >
              {isUploading ? (
                <LoaderCircle size={12} className="animate-spin text-white" />
              ) : (
                <Camera size={12} strokeWidth={1.5} />
              )}
              Upload
            </button>
            <span className="text-[10px] text-amber-600 font-medium">Selected (Draft preview)</span>
          </div>
        )}

        {error && (
          <div className="rounded-[10px] bg-red-50 border border-red-200 p-3 text-xs text-red-700 mt-2">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="mb-1.5 block text-xs font-semibold text-[#2D3748]">Upload Rescue Photo</label>
      <div className="text-xs text-[#2D3748]/70 space-y-1">
        <p className="font-medium">Accepted formats:</p>
        <ul className="list-disc list-inside pl-1 space-y-0.5 text-[#2D3748]/60">
          <li>JPG</li>
          <li>PNG</li>
          <li>WEBP</li>
        </ul>
        <p className="font-medium mt-1.5">Maximum size: <span className="font-normal text-[#2D3748]/60">10 MB</span></p>
      </div>

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
            Drag & drop on desktop
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-[10px] bg-red-50 border border-red-200 p-3 text-xs text-red-700">
          {error}
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
