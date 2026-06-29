"use client";

import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import { useRef } from "react";

interface PhotoUploaderProps {
  photoDataUrl?: string;
  onPhotoChange: (dataUrl: string | undefined) => void;
}

/**
 * PhotoUploader — Step 1 of the rescue wizard.
 * Supports file input, drag & drop (desktop), and photo preview.
 */
export function PhotoUploader({ photoDataUrl, onPhotoChange }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onPhotoChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  if (photoDataUrl) {
    return (
      <div className="space-y-4">
        <h2 className="font-heading text-base font-semibold text-[#2D3748]">Photo Uploaded</h2>
        <div className="relative overflow-hidden rounded-[12px] border border-[#A788FA]/15">
          <img src={photoDataUrl} alt="Rescue cat" className="w-full h-56 object-cover" />
          <button
            onClick={() => onPhotoChange(undefined)}
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
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
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
