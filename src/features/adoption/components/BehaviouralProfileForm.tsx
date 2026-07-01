"use client";

import { useState, useTransition } from "react";
import { PawPrint, Save, Camera, CircleCheck, LoaderCircle } from "lucide-react";
import { updateBehaviouralProfile } from "@/features/foster/actions";

const personalityOptions = ["Affectionate", "Playful", "Shy", "Curious", "Calm", "Lap Cat", "Independent", "Talkative", "Energetic", "Gentle"];
const energyOptions = ["low", "medium", "high"] as const;

interface BehaviouralProfileFormProps {
  caseId: string;
}

/**
 * BehaviouralProfileForm — foster caregiver completes the cat's personality profile.
 * This data is owned by the foster, NOT the vet.
 * Saves to real Supabase foster_records.
 */
export function BehaviouralProfileForm({ caseId }: BehaviouralProfileFormProps) {
  const [personality, setPersonality] = useState<string[]>([]);
  const [energy, setEnergy] = useState<"low" | "medium" | "high">("medium");
  const [goodWithChildren, setGoodWithChildren] = useState<boolean | null>(null);
  const [goodWithCats, setGoodWithCats] = useState<boolean | null>(null);
  const [indoorOnly, setIndoorOnly] = useState(true);
  const [idealHome, setIdealHome] = useState("");
  const [activities, setActivities] = useState("");
  const [observations, setObservations] = useState("");
  const [markComplete, setMarkComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function togglePersonality(tag: string) {
    setPersonality((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateBehaviouralProfile({
        caseId,
        personality,
        energyLevel: energy,
        goodWithChildren,
        goodWithCats,
        indoorOnly,
        idealHome: idealHome ? idealHome.split(",").map((s) => s.trim()).filter(Boolean) : [],
        favouriteActivities: activities ? activities.split(",").map((s) => s.trim()).filter(Boolean) : [],
        observations,
        markComplete,
      });

      if (result.success) {
        setSaved(true);
      } else {
        setError(result.error ?? "Failed to save profile.");
      }
    });
  }

  if (saved) {
    return (
      <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3">
        <CircleCheck size={32} strokeWidth={1.5} className="mx-auto text-emerald-600" />
        <h3 className="font-heading text-sm font-bold text-emerald-700">Profile Saved!</h3>
        {markComplete && (
          <p className="text-xs text-emerald-600">Behavioural profile is now complete. This cat may appear on the adoption page.</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748] mb-4">
        <PawPrint size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Behavioural Profile
        <span className="text-[10px] font-normal text-[#2D3748]/50 ml-auto">Completed by Foster</span>
      </h3>

      <div className="space-y-5">
        {/* Personality tags */}
        <div>
          <label className="mb-2 block text-xs font-medium text-[#2D3748]">Personality (select all that apply)</label>
          <div className="flex flex-wrap gap-1.5">
            {personalityOptions.map((tag) => (
              <button key={tag} type="button" onClick={() => togglePersonality(tag)} className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${personality.includes(tag) ? "bg-[#6C5CE7] text-white" : "bg-[#F7F7FB] text-[#2D3748]/60 hover:bg-[#6C5CE7]/10"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Energy level */}
        <div>
          <label className="mb-2 block text-xs font-medium text-[#2D3748]">Energy Level</label>
          <div className="flex gap-2">
            {energyOptions.map((level) => (
              <button key={level} type="button" onClick={() => setEnergy(level)} className={`flex-1 rounded-[10px] py-2 text-xs font-medium capitalize transition ${energy === level ? "bg-[#6C5CE7] text-white" : "border border-[#A788FA]/20 text-[#2D3748]/60 hover:border-[#6C5CE7]/30"}`}>
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Compatibility */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#2D3748]">Good with children?</label>
            <div className="flex gap-2">
              {[true, false].map((val) => (
                <button key={String(val)} type="button" onClick={() => setGoodWithChildren(val)} className={`flex-1 rounded-[8px] py-1.5 text-[10px] font-medium transition ${goodWithChildren === val ? "bg-[#6C5CE7] text-white" : "border border-[#A788FA]/20 text-[#2D3748]/60"}`}>
                  {val ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#2D3748]">Good with cats?</label>
            <div className="flex gap-2">
              {[true, false].map((val) => (
                <button key={String(val)} type="button" onClick={() => setGoodWithCats(val)} className={`flex-1 rounded-[8px] py-1.5 text-[10px] font-medium transition ${goodWithCats === val ? "bg-[#6C5CE7] text-white" : "border border-[#A788FA]/20 text-[#2D3748]/60"}`}>
                  {val ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Indoor */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={indoorOnly} onChange={(e) => setIndoorOnly(e.target.checked)} className="h-4 w-4 rounded border-[#A788FA]/30 text-[#6C5CE7] focus:ring-[#6C5CE7]" />
          <span className="text-xs font-medium text-[#2D3748]">Indoor only recommended</span>
        </label>

        {/* Text fields */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#2D3748]">Ideal Home (comma separated)</label>
          <input type="text" value={idealHome} onChange={(e) => setIdealHome(e.target.value)} placeholder="e.g. Quiet apartment, patient owner" className="h-9 w-full rounded-[10px] border border-[#A788FA]/20 bg-white px-3 text-xs text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none" />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#2D3748]">Favourite Activities (comma separated)</label>
          <input type="text" value={activities} onChange={(e) => setActivities(e.target.value)} placeholder="e.g. Sunbathing, playing with string toys" className="h-9 w-full rounded-[10px] border border-[#A788FA]/20 bg-white px-3 text-xs text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none" />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#2D3748]">Daily Observations</label>
          <textarea rows={2} value={observations} onChange={(e) => setObservations(e.target.value)} placeholder="Notes about behaviour, eating, sleep..." className="w-full rounded-[10px] border border-[#A788FA]/20 bg-white px-3 py-2 text-xs text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none resize-none" />
        </div>

        {/* Mark complete checkbox */}
        <div className="rounded-[12px] border border-[#6C5CE7]/15 bg-[#6C5CE7]/[0.03] p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={markComplete} onChange={(e) => setMarkComplete(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-[#A788FA]/30 text-[#6C5CE7] focus:ring-[#6C5CE7]" />
            <div>
              <p className="text-sm font-semibold text-[#6C5CE7]">Mark Profile Complete</p>
              <p className="text-[11px] text-[#2D3748]/60 mt-0.5">
                Once marked complete, this cat will be eligible for the public adoption listing (if the vet has also approved).
              </p>
            </div>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-[10px] bg-red-50 border border-red-200 p-3">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition hover:bg-[#A788FA] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <><LoaderCircle size={14} strokeWidth={2} className="animate-spin" /> Saving...</>
          ) : (
            <><Save size={14} strokeWidth={1.5} /> Save Behavioural Profile</>
          )}
        </button>
      </div>
    </div>
  );
}
