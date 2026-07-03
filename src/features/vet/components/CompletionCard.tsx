"use client";

import { useState, useTransition } from "react";
import { CircleCheck, ShieldCheck, Heart, LoaderCircle, Camera, X } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { completeTreatment } from "../actions";
import { uploadTreatmentPhoto, deleteTreatmentPhoto } from "../lib/upload-photo";

interface CompletionCardProps {
  caseId: string;
}

/**
 * CompletionCard — treatment completion + adoption readiness approval.
 * Vet confirms recovery outcome AND approves for adoption (medical clearance).
 */
export function CompletionCard({ caseId }: CompletionCardProps) {
  const [outcome, setOutcome] = useState<"RECOVERED" | "DECEASED">("RECOVERED");
  const [vaccination, setVaccination] = useState("complete");
  const [neutered, setNeutered] = useState(true);
  const [specialNeeds, setSpecialNeeds] = useState("");
  const [readyForAdoption, setReadyForAdoption] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const localUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(localUrl);
    setPhotoUrl(null);
    setStoragePath(null);

    // Reset file input value so the same file can be re-selected if removed
    e.target.value = "";
  }

  async function handleRemovePhoto() {
    if (storagePath) {
      try {
        await deleteTreatmentPhoto(storagePath);
      } catch (err) {
        console.error("Failed to delete photo from storage:", err);
      }
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setPhotoUrl(null);
    setStoragePath(null);
  }

  async function handleCloudUpload() {
    if (!selectedFile) return;

    setIsUploadingPhoto(true);
    setError(null);
    try {
      const res = await uploadTreatmentPhoto(selectedFile);
      if (res.success && res.publicUrl && res.storagePath) {
        setPhotoUrl(res.publicUrl);
        setStoragePath(res.storagePath);
      } else {
        setError(res.error ?? "Failed to upload photo.");
      }
    } catch (err) {
      setError("Failed to upload photo.");
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      let finalPhotoUrl = photoUrl;

      if (selectedFile && !finalPhotoUrl) {
        setIsUploadingPhoto(true);
        try {
          const res = await uploadTreatmentPhoto(selectedFile);
          if (res.success && res.publicUrl) {
            finalPhotoUrl = res.publicUrl;
          } else {
            setError(res.error ?? "Failed to upload photo to storage.");
            setIsUploadingPhoto(false);
            return;
          }
        } catch (err) {
          setError("Failed to upload photo to storage.");
          setIsUploadingPhoto(false);
          return;
        } finally {
          setIsUploadingPhoto(false);
        }
      }

      const result = await completeTreatment({
        caseId,
        outcome,
        vaccinationStatus: vaccination,
        isNeutered: neutered,
        specialNeeds,
        readyForAdoption,
        photoUrl: finalPhotoUrl || undefined,
      });

      if (result.success) {
        setConfirmed(true);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      } else {
        setError(result.error ?? "Failed to complete treatment.");
      }
    });
  }

  if (confirmed) {
    return (
      <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 p-6 text-center space-y-4">
        <TabbyMascot variant="celebrate" size="lg" className="mx-auto" />
        <h3 className="font-heading text-base font-bold text-emerald-700">Treatment Complete!</h3>
        <p className="text-xs text-emerald-600">
          Escrow funds will be released to your account.
        </p>
        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600">
          <ShieldCheck size={14} strokeWidth={1.5} /> Treatment confirmed
        </div>
        {readyForAdoption && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#6C5CE7]">
            <Heart size={14} strokeWidth={1.5} /> Approved for adoption — awaiting foster profile
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748] mb-4">
        <CircleCheck size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Complete Treatment
      </h3>

      <div className="space-y-4">
        {/* Outcome */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#2D3748]">Treatment Outcome</label>
          <select value={outcome} onChange={(e) => setOutcome(e.target.value as typeof outcome)} className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 text-sm text-[#2D3748] focus:border-[#6C5CE7] focus:outline-none">
            <option value="RECOVERED">Recovered</option>
            <option value="DECEASED">Deceased</option>
          </select>
        </div>

        {/* Medical readiness fields */}
        {outcome === "RECOVERED" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#2D3748]">Vaccination</label>
                <select value={vaccination} onChange={(e) => setVaccination(e.target.value)} className="h-9 w-full rounded-[10px] border border-[#A788FA]/20 bg-white px-3 text-xs text-[#2D3748] focus:border-[#6C5CE7] focus:outline-none">
                  <option value="complete">Complete</option>
                  <option value="partial">Partial</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 h-9 cursor-pointer">
                  <input type="checkbox" checked={neutered} onChange={(e) => setNeutered(e.target.checked)} className="h-4 w-4 rounded border-[#A788FA]/30 text-[#6C5CE7] focus:ring-[#6C5CE7]" />
                  <span className="text-xs font-medium text-[#2D3748]">Neutered / Spayed</span>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#2D3748]">Special Needs (if any)</label>
              <input type="text" value={specialNeeds} onChange={(e) => setSpecialNeeds(e.target.value)} placeholder="e.g. requires daily medication" className="h-9 w-full rounded-[10px] border border-[#A788FA]/20 bg-white px-3 text-xs text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none" />
            </div>

            {/* Post-Treatment Photo (Optional) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-[#2D3748]">Post-Treatment Photo</label>
                <span className="rounded-full bg-[#2D3748]/5 border border-[#2D3748]/10 px-2 py-0.5 text-[9px] font-semibold text-[#2D3748]/45 uppercase tracking-wide">Optional</span>
              </div>
              
              {previewUrl ? (
                <div className="space-y-3">
                  <div className="relative w-full max-w-[240px] overflow-hidden rounded-[12px] border border-[#A788FA]/15 h-32 bg-slate-50">
                    <img src={previewUrl} alt="Post-treatment cat preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                      aria-label="Remove photo"
                    >
                      <X size={14} strokeWidth={2} />
                    </button>
                  </div>
                  {photoUrl ? (
                    <span className="text-[10px] text-emerald-600 font-medium block">✓ Uploaded to cloud successfully</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCloudUpload}
                        disabled={isUploadingPhoto}
                        className="flex h-8 items-center gap-1.5 rounded-[8px] bg-[#6C5CE7] px-3 text-xs font-semibold text-white hover:bg-[#A788FA] transition disabled:opacity-50"
                      >
                        {isUploadingPhoto ? (
                          <LoaderCircle size={12} className="animate-spin text-white" />
                        ) : (
                          <Camera size={12} strokeWidth={1.5} />
                        )}
                        Upload
                      </button>
                      <span className="text-[10px] text-amber-600 font-medium">Selected (Draft preview)</span>
                    </div>
                  )}
                </div>
              ) : (
                /* No photo selected — drop zone */
                <label className="flex flex-col gap-2.5 items-center justify-center rounded-[12px] border-2 border-dashed border-[#A788FA]/25 bg-[#F7F7FB] px-4 py-5 text-center cursor-pointer hover:border-[#6C5CE7]/40 hover:bg-[#6C5CE7]/[0.02] transition-all group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] group-hover:bg-[#6C5CE7]/15 transition">
                    <Camera size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#2D3748]">Upload post-treatment photo</p>
                    <p className="text-[10px] text-[#2D3748]/45 mt-0.5">JPG, PNG, WEBP · Max 10MB · 1 photo only</p>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isPending}
                  />
                </label>
              )}
            </div>

            {/* Adoption approval */}
            <div className="rounded-[12px] border border-[#6C5CE7]/15 bg-[#6C5CE7]/[0.03] p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={readyForAdoption} onChange={(e) => setReadyForAdoption(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-[#A788FA]/30 text-[#6C5CE7] focus:ring-[#6C5CE7]" />
                <div>
                  <p className="text-sm font-semibold text-[#6C5CE7]">Approve for Adoption</p>
                  <p className="text-[11px] text-[#2D3748]/60 mt-0.5">
                    I confirm this cat is medically recovered, vaccinated, and ready for a permanent home. This is medical clearance only — the foster will complete the behavioural profile.
                  </p>
                </div>
              </label>
            </div>
          </>
        )}

        {/* Escrow notice */}
        <div className="rounded-[10px] bg-[#6C5CE7]/5 p-3">
          <p className="flex items-start gap-1.5 text-[11px] text-[#6C5CE7]">
            <ShieldCheck size={12} strokeWidth={1.5} className="mt-0.5 shrink-0" />
            Confirming completion will release escrow funds to your account.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-[10px] bg-red-50 border border-red-200 p-3">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={isPending || isUploadingPhoto}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] text-sm font-bold text-white transition hover:bg-[#A788FA] shadow-[0_4px_12px_rgba(108,92,231,0.20)] hover:shadow-[0_6px_20px_rgba(108,92,231,0.28)] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isPending || isUploadingPhoto ? (
            <><LoaderCircle size={16} strokeWidth={2} className="animate-spin" /> {isUploadingPhoto ? "Uploading Photo..." : "Completing..."}</>
          ) : (
            <><CircleCheck size={16} strokeWidth={1.5} /> Confirm Completion</>
          )}
        </button>
      </div>
    </div>
  );
}
