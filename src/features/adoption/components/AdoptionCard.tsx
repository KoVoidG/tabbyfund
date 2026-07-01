import Link from "next/link";
import { MapPin, Heart, ChevronRight } from "lucide-react";
import { PersonalityTags } from "./PersonalityTags";
import { HealthTags } from "./HealthTags";
import type { AdoptableCatRow } from "@/lib/adoption";

interface AdoptionCardProps {
  cat: AdoptableCatRow;
}

/**
 * AdoptionCard — discovery card for the adoption feed.
 * Uses real data from public_adoptable_cats view.
 */
export function AdoptionCard({ cat }: AdoptionCardProps) {
  const healthTags: string[] = [];
  if (cat.vaccinationStatus === "complete") healthTags.push("Vaccinated");
  if (cat.isNeutered) healthTags.push("Neutered");
  if (cat.specialNeeds) healthTags.push("Special Needs");
  if (!cat.specialNeeds) healthTags.push("Recovered");

  const personalityTags = cat.personality?.slice(0, 4) ?? [];
  const description = cat.observations ?? cat.description ?? cat.treatmentSummary ?? "";

  return (
    <div className="group overflow-hidden rounded-[20px] border border-[#A788FA]/15 bg-white shadow-[0_4px_20px_rgba(108,92,231,0.08)] transition-all hover:shadow-[0_12px_36px_rgba(108,92,231,0.16)] hover:border-[#6C5CE7]/20">
      {/* Photo */}
      <div className="relative h-72 sm:h-80 overflow-hidden bg-[#F7F7FB]">
        <img
          src={cat.photoUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5 pt-16">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">{cat.listingPersonality ?? "Rescue Cat"}</h3>
              <p className="mt-0.5 text-sm text-white/80">{cat.energyLevel ?? "Medium"} energy</p>
            </div>
          </div>
        </div>
        {/* Favorite button */}
        <button className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-[#6C5CE7] transition hover:bg-white hover:scale-110">
          <Heart size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {personalityTags.length > 0 && <PersonalityTags tags={personalityTags} />}
        <HealthTags tags={healthTags.slice(0, 3)} />

        <p className="text-xs text-[#2D3748]/60 line-clamp-2 leading-relaxed">{description}</p>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Link
            href={`/adopt/${cat.caseId}`}
            className="flex flex-1 h-10 items-center justify-center gap-1.5 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition hover:bg-[#A788FA] active:scale-[0.98]"
          >
            <Heart size={14} strokeWidth={1.5} /> Meet This Cat
          </Link>
          <Link
            href={`/adopt/${cat.caseId}`}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#A788FA]/20 text-[#6C5CE7] transition hover:bg-[#6C5CE7]/5"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
