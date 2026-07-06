"use client";

import { useState, useTransition, useEffect } from "react";
import { PawPrint, Save, Camera, CircleCheck, LoaderCircle, X, CheckCircle2, Circle } from "lucide-react";
import { updateBehaviouralProfile } from "@/features/foster/actions";
import { uploadFosterPhoto, deleteFosterPhoto } from "@/features/foster/lib/upload-foster-photo";

const personalityOptions = ["Affectionate", "Playful", "Shy", "Curious", "Calm", "Lap Cat", "Independent", "Talkative", "Energetic", "Gentle"];
const energyOptions = ["low", "medium", "high"] as const;

interface FosterPhotoItem {
  id: string;
  file?: File;
  previewUrl: string;
  photoUrl?: string;
}

interface BehaviouralProfileFormProps {
  caseId: string;
}

/**
 * BehaviouralProfileForm — foster caregiver completes the cat's personality profile.
 * This data is owned by the foster, NOT the vet.
 * Saves to real Supabase foster_records.
 */
export function BehaviouralProfileForm({ caseId }: BehaviouralProfileFormProps) {
  const [catName, setCatName] = useState("");
  const [personality, setPersonality] = useState<string[]>([]);
  const [energy, setEnergy] = useState<"low" | "medium" | "high">("medium");
  const [goodWithChildren, setGoodWithChildren] = useState<boolean | null>(null);
  const [goodWithCats, setGoodWithCats] = useState<boolean | null>(null);
  const [goodWithDogs, setGoodWithDogs] = useState<boolean | null>(null);
  const [litterTrained, setLitterTrained] = useState<boolean | null>(null);
  const [indoorOnly, setIndoorOnly] = useState(true);
  const [observations, setObservations] = useState("");
  const [photoItems, setPhotoItems] = useState<FosterPhotoItem[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [markComplete, setMarkComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadProfile() {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase
        .from("foster_records")
        .select("*")
        .eq("case_id", caseId)
        .eq("status", "ACTIVE")
        .maybeSingle();

      if (data) {
        if (data.cat_name) setCatName(data.cat_name);
        if (data.personality) setPersonality(data.personality);
        if (data.energy_level) setEnergy(data.energy_level as "low" | "medium" | "high");
        if (data.good_with_children !== null) setGoodWithChildren(data.good_with_children);
        if (data.good_with_cats !== null) setGoodWithCats(data.good_with_cats);
        if (data.good_with_dogs !== null) setGoodWithDogs(data.good_with_dogs);
        if (data.litter_trained !== null) setLitterTrained(data.litter_trained);
        if (data.indoor_only !== null) setIndoorOnly(data.indoor_only);
        if (data.observations) setObservations(data.observations);
        if (data.foster_photos && data.foster_photos.length > 0) {
          setPhotoItems(
            data.foster_photos.map((url: string) => ({
              id: Math.random().toString(36).substring(7),
              photoUrl: url,
              previewUrl: url,
            }))
          );
        }
        if (data.behaviour_profile_complete !== null) {
          setMarkComplete(data.behaviour_profile_complete);
        }
      }
    }
    loadProfile();
  }, [caseId]);

  function togglePersonality(tag: string) {
    setPersonality((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    const newItems: FosterPhotoItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Please upload only JPG, PNG, or WEBP images.");
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Each image must be under 10MB.");
        continue;
      }

      const localUrl = URL.createObjectURL(file);
      newItems.push({
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl: localUrl,
      });
    }

    setPhotoItems((prev) => [...prev, ...newItems]);
    e.target.value = "";
  }

  async function handleRemovePhotoItem(item: FosterPhotoItem) {
    if (item.photoUrl) {
      // Extract storage path from the foster-photos public URL
      const parts = item.photoUrl.split("/foster-photos/");
      if (parts.length > 1) {
        try {
          await deleteFosterPhoto(parts[1]);
        } catch (err) {
          console.error("Failed to delete foster photo:", err);
        }
      }
    }

    if (item.file) {
      URL.revokeObjectURL(item.previewUrl);
    }

    setPhotoItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  async function handleCloudUpload() {
    const pendingUploads = photoItems.filter((item) => item.file && !item.photoUrl);
    if (pendingUploads.length === 0) return;

    setIsUploadingPhoto(true);
    setError(null);
    try {
      const updatedItems = [...photoItems];
      for (const item of pendingUploads) {
        if (!item.file) continue;
        const res = await uploadFosterPhoto(item.file);
        if (res.success && res.publicUrl) {
          const idx = updatedItems.findIndex((i) => i.id === item.id);
          if (idx !== -1) {
            updatedItems[idx] = {
              ...updatedItems[idx],
              photoUrl: res.publicUrl,
              // Release the local object URL since we now have the cloud URL
              previewUrl: res.publicUrl,
            };
            URL.revokeObjectURL(item.previewUrl);
          }
        } else {
          setError(res.error ?? "Failed to upload one or more photos.");
          setIsUploadingPhoto(false);
          return;
        }
      }
      setPhotoItems(updatedItems);
    } catch (err) {
      setError("Failed to upload photos.");
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  function handleSave() {
    setError(null);
    if (!markComplete) {
      setError("Please check 'Mark Profile Complete' to save the profile and list this cat for adoption.");
      return;
    }
    startTransition(async () => {
      let finalPhotos = photoItems.map((i) => i.photoUrl).filter(Boolean) as string[];
      const pendingUploads = photoItems.filter((item) => item.file && !item.photoUrl);

      if (pendingUploads.length > 0) {
        setIsUploadingPhoto(true);
        try {
          const uploadedUrls: string[] = [];
          for (const item of pendingUploads) {
            if (!item.file) continue;
            const res = await uploadFosterPhoto(item.file);
            if (res.success && res.publicUrl) {
              uploadedUrls.push(res.publicUrl);
            } else {
              setError(res.error ?? "Failed to upload photos.");
              setIsUploadingPhoto(false);
              return;
            }
          }
          finalPhotos = [...finalPhotos, ...uploadedUrls];
        } catch (err) {
          setError("Failed to upload photos.");
          setIsUploadingPhoto(false);
          return;
        } finally {
          setIsUploadingPhoto(false);
        }
      }

      const result = await updateBehaviouralProfile({
        caseId,
        catName,
        personality,
        energyLevel: energy,
        goodWithChildren,
        goodWithCats,
        goodWithDogs,
        litterTrained,
        indoorOnly,
        observations,
        fosterPhotos: finalPhotos,
        markComplete,
      });

      if (result.success) {
        setSaved(true);
        if (result.message) {
          setSavedMessage(result.message);
        }
        photoItems.forEach((item) => {
          if (item.file) {
            URL.revokeObjectURL(item.previewUrl);
          }
        });
      } else {
        setError(result.error ?? "Failed to save profile.");
      }
    });
  }

  if (saved) {
    return (
      <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3">
        <CircleCheck size={32} strokeWidth={1.5} className="mx-auto text-emerald-600" />
        <h3 className="text-sm font-bold text-emerald-700">Profile Saved!</h3>
        {savedMessage ? (
          <p className="text-xs text-amber-700 font-medium">{savedMessage}</p>
        ) : (
          markComplete && (
            <p className="text-xs text-emerald-600">Behavioural profile is now complete. This cat may appear on the adoption page.</p>
          )
        )}
      </div>
    );
  }

  const checklist = [
    { label: "Choose personality tags", done: personality.length > 0 },
    { label: "Define energy level", done: !!energy },
    { label: "Answer compatibility checks", done: goodWithChildren !== null && goodWithCats !== null && goodWithDogs !== null && litterTrained !== null },
    { label: "Write daily observations", done: observations.trim().length > 0 },
    { label: "Upload foster photos", done: photoItems.length > 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <PawPrint size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#2D3748]">Behaviour Profile</h1>
          <p className="text-xs text-[#2D3748]/60">Complete the cat&apos;s observations and personality traits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN (~65% / lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Temperament */}
          <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.06)] space-y-4">
            <h2 className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">1. Temperament & Energy</h2>

            {/* Cat Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="cat-name-input" className="block text-xs font-semibold text-[#2D3748]">
                Cat Name <span className="text-[10px] text-[#2D3748]/45 font-normal">(Optional — defaults to &quot;Rescued Cat&quot;)</span>
              </label>
              <input
                id="cat-name-input"
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Som-O, Oat, Mimi..."
                className="w-full h-11 rounded-[12px] border border-[#A788FA]/20 bg-white px-3.5 text-xs text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/10"
              />
            </div>

            {/* Personality Tags */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#2D3748]">Personality Tags (select all that apply)</label>
              <div className="flex flex-wrap gap-1.5">
                {personalityOptions.map((tag) => {
                  const selected = personality.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => togglePersonality(tag)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        selected
                          ? "bg-[#6C5CE7] text-white shadow-sm border border-[#6C5CE7]"
                          : "border border-[#A788FA]/15 bg-[#F7F7FB] text-[#2D3748]/75 hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7] hover:border-[#6C5CE7]/20"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Energy Level */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-[#2D3748]">Energy Level</label>
              <div className="flex gap-2">
                {energyOptions.map((level) => {
                  const selected = energy === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setEnergy(level)}
                      className={`flex-1 rounded-[12px] py-2.5 text-xs font-bold capitalize transition-all border ${
                        selected
                          ? "bg-[#6C5CE7] text-white shadow-sm border-[#6C5CE7]"
                          : "border-[#A788FA]/15 bg-[#F7F7FB] text-[#2D3748]/75 hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7] hover:border-[#6C5CE7]/20"
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Household & Compatibility */}
          <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.06)] space-y-4">
            <h2 className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">2. Compatibility & Habits</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Children */}
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-[#2D3748]">Good with kids?</label>
                <div className="flex gap-1.5">
                  {[true, false].map((val) => {
                    const selected = goodWithChildren === val;
                    return (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => setGoodWithChildren(val)}
                        className={`flex-1 rounded-[8px] py-1.5 text-xs font-bold transition-all border ${
                          selected
                            ? "bg-[#6C5CE7] text-white shadow-sm border-[#6C5CE7]"
                            : "border-[#A788FA]/15 bg-[#F7F7FB] text-[#2D3748]/75 hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7]"
                        }`}
                      >
                        {val ? "Yes" : "No"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cats */}
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-[#2D3748]">Good with cats?</label>
                <div className="flex gap-1.5">
                  {[true, false].map((val) => {
                    const selected = goodWithCats === val;
                    return (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => setGoodWithCats(val)}
                        className={`flex-1 rounded-[8px] py-1.5 text-xs font-bold transition-all border ${
                          selected
                            ? "bg-[#6C5CE7] text-white shadow-sm border-[#6C5CE7]"
                            : "border-[#A788FA]/15 bg-[#F7F7FB] text-[#2D3748]/75 hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7]"
                        }`}
                      >
                        {val ? "Yes" : "No"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dogs */}
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-[#2D3748]">Good with dogs?</label>
                <div className="flex gap-1.5">
                  {[true, false].map((val) => {
                    const selected = goodWithDogs === val;
                    return (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => setGoodWithDogs(val)}
                        className={`flex-1 rounded-[8px] py-1.5 text-xs font-bold transition-all border ${
                          selected
                            ? "bg-[#6C5CE7] text-white shadow-sm border-[#6C5CE7]"
                            : "border-[#A788FA]/15 bg-[#F7F7FB] text-[#2D3748]/75 hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7]"
                        }`}
                      >
                        {val ? "Yes" : "No"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Litter Trained */}
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold text-[#2D3748]">Litter trained?</label>
                <div className="flex gap-1.5">
                  {[true, false].map((val) => {
                    const selected = litterTrained === val;
                    return (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => setLitterTrained(val)}
                        className={`flex-1 rounded-[8px] py-1.5 text-xs font-bold transition-all border ${
                          selected
                            ? "bg-[#6C5CE7] text-white shadow-sm border-[#6C5CE7]"
                            : "border-[#A788FA]/15 bg-[#F7F7FB] text-[#2D3748]/75 hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7]"
                        }`}
                      >
                        {val ? "Yes" : "No"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Indoor Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer rounded-[12px] border border-[#A788FA]/10 bg-[#F7F7FB] p-3 transition hover:border-[#6C5CE7]/20">
                <input
                  type="checkbox"
                  checked={indoorOnly}
                  onChange={(e) => setIndoorOnly(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-[#A788FA]/30 text-[#6C5CE7] focus:ring-[#6C5CE7]"
                />
                <div className="text-left">
                  <span className="block text-xs font-semibold text-[#2D3748]">Indoor Only</span>
                  <span className="block text-[10px] text-[#2D3748]/55 mt-0.5">Recommended to keep this cat indoors only</span>
                </div>
              </label>
            </div>
          </div>

          {/* Card 3: Observations */}
          <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.06)] space-y-4">
            <h2 className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">3. Daily Observations</h2>
            <div className="space-y-2">
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Write observations about behaviour, temperament, diet, sleeping habits..."
                className="w-full min-h-[220px] rounded-[12px] border border-[#A788FA]/20 bg-white px-3.5 py-2.5 text-xs text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/10"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (~35% / lg:col-span-1) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Foster Photo Upload */}
          <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.06)] space-y-4">
            <h2 className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">Media Upload</h2>
            <div className="space-y-3">
              {/* Upload Drop Zone area */}
              <div className="flex flex-col gap-3 rounded-[12px] border-2 border-dashed border-[#A788FA]/20 bg-[#F7F7FB] p-6 items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7]">
                  <Camera size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2D3748]">Upload Foster Photos</p>
                  <p className="text-[10px] text-[#2D3748]/45 mt-0.5">JPG, PNG, WEBP · Max 10MB per file</p>
                </div>
                <label className="flex h-8 items-center gap-1.5 rounded-[8px] bg-white px-3.5 text-xs font-semibold text-[#2D3748] border border-[#A788FA]/20 cursor-pointer shadow-xs hover:bg-slate-50 transition active:scale-[0.98]">
                  Select Files
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handlePhotoSelect}
                    className="hidden"
                    disabled={isPending}
                  />
                </label>
              </div>

              {/* Photo state */}
              {photoItems.length > 0 && (() => {
                const allUploaded = photoItems.every((item) => !!item.photoUrl);
                const pendingCount = photoItems.filter((item) => !item.photoUrl).length;

                if (allUploaded) {
                  // All uploaded — no preview needed, show clean success state
                  return (
                    <div className="rounded-[12px] border border-emerald-200 bg-emerald-50/60 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} strokeWidth={2} className="text-emerald-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-emerald-700">
                            {photoItems.length} photo{photoItems.length !== 1 ? "s" : ""} uploaded
                          </p>
                          <p className="text-[10px] text-emerald-600/70 mt-0.5">Saved to foster-photos</p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Has pending (not yet uploaded) — show preview grid + upload button
                return (
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-3 gap-2">
                      {photoItems.map((item) => (
                        <div key={item.id} className="relative group rounded-[10px] overflow-hidden border border-[#A788FA]/15 h-16 bg-slate-100">
                          <img src={item.previewUrl} alt="Foster cat preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemovePhotoItem(item)}
                            className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75 shadow-xs"
                            aria-label="Remove photo"
                          >
                            <X size={10} strokeWidth={2.5} />
                          </button>
                          {/* Status dot: green = uploaded, amber = pending */}
                          <div className={`absolute bottom-1 left-1 h-2 w-2 rounded-full ${item.photoUrl ? "bg-emerald-400" : "bg-amber-400"}`} />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCloudUpload}
                        disabled={isUploadingPhoto}
                        className="flex h-8 items-center gap-1.5 rounded-[8px] bg-[#6C5CE7] px-3.5 text-xs font-semibold text-white hover:bg-[#A788FA] transition disabled:opacity-50"
                      >
                        {isUploadingPhoto ? (
                          <LoaderCircle size={12} className="animate-spin text-white" />
                        ) : (
                          <Camera size={12} strokeWidth={1.5} />
                        )}
                        {isUploadingPhoto ? "Uploading..." : `Upload ${pendingCount} photo${pendingCount !== 1 ? "s" : ""}`}
                      </button>
                      <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                        {pendingCount} pending
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Profile Completion Checklist Card */}
          <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.06)] space-y-3">
            <h2 className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">Completion Checklist</h2>
            <ul className="space-y-2 text-xs">
              {checklist.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-[#2D3748]/75">
                  {item.done ? (
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Circle size={15} className="text-[#2D3748]/25 shrink-0" />
                  )}
                  <span className={item.done ? "line-through text-[#2D3748]/45" : ""}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mark complete box */}
          <div className={`rounded-[16px] border p-4.5 transition-all duration-300 ${
            markComplete
              ? "border-emerald-200 bg-emerald-50/20 shadow-[0_2px_12px_rgba(16,185,129,0.02)]"
              : "border-[#6C5CE7]/15 bg-[#6C5CE7]/[0.02]"
          }`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={markComplete}
                onChange={(e) => setMarkComplete(e.target.checked)}
                className="mt-0.5 h-4.5 w-4.5 rounded border-[#A788FA]/30 text-[#6C5CE7] focus:ring-[#6C5CE7]"
              />
              <div>
                <p className={`text-sm font-bold ${markComplete ? "text-emerald-700" : "text-[#6C5CE7]"}`}>
                  Mark Profile Complete
                </p>
                <p className="text-[11px] text-[#2D3748]/60 mt-0.5 leading-relaxed">
                  Checking this enables public adoption listings for this cat once vet clearance is final.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button (Full Width, Centered below both columns) */}
      <div className="pt-6 border-t border-[#A788FA]/10 flex flex-col items-center gap-4 w-full">
        {error && (
          <div className="rounded-[10px] bg-red-50 border border-red-200 p-3 w-full max-w-md">
            <p className="text-xs text-red-700 font-medium text-center">{error}</p>
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={isPending || isUploadingPhoto}
          className="flex h-12 w-full max-w-md items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] text-sm font-bold text-white transition hover:bg-[#A788FA] shadow-[0_4px_12px_rgba(108,92,231,0.15)] hover:shadow-[0_6px_20px_rgba(108,92,231,0.25)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <><LoaderCircle size={15} strokeWidth={2.5} className="animate-spin" /> Saving Profile...</>
          ) : (
            <><Save size={15} strokeWidth={1.5} /> Save Behavioural Profile</>
          )}
        </button>
      </div>
    </div>
  );
}
