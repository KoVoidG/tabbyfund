import Link from "next/link";
import { Heart, ChevronRight, PawPrint, Zap } from "lucide-react";
import { PersonalityTags } from "./PersonalityTags";
import { HealthTags } from "./HealthTags";
import type { AdoptableCatRow } from "@/lib/adoption";

interface AdoptionCardProps {
  cat: AdoptableCatRow;
}

/**
 * AdoptionCard — discovery card for the adoption feed.
 * Larger, image-first design. Consistent card heights with clamped text.
 * Friendly branded placeholder when no real photo is available.
 */
export function AdoptionCard({ cat }: AdoptionCardProps) {
  const healthTags: string[] = [];
  if (cat.vaccinationStatus === "complete") healthTags.push("Vaccinated");
  if (cat.isNeutered) healthTags.push("Neutered");
  if (cat.specialNeeds) healthTags.push("Special Needs");
  if (!cat.specialNeeds) healthTags.push("Recovered");

  const personalityTags = cat.personality?.slice(0, 3) ?? [];
  const description = cat.observations ?? cat.description ?? cat.treatmentSummary ?? "";
  const hasPhoto = !!cat.photoUrl && !cat.photoUrl.includes("placehold.co") && !cat.photoUrl.includes("placeholder");
  const name = cat.listingPersonality ?? "Rescue Cat";
  const energy = cat.energyLevel ?? "Medium";

  return (
    <div className="group flex flex-col overflow-hidden rounded-[20px] border border-[#A788FA]/15 bg-white shadow-[0_4px_24px_rgba(108,92,231,0.09)] transition-all duration-200 hover:shadow-[0_12px_40px_rgba(108,92,231,0.18)] hover:border-[#6C5CE7]/25 hover:-translate-y-0.5 h-[500px]">

      {/* Photo Area — taller, more impactful */}
      <div className="relative h-64 shrink-0 overflow-hidden bg-[#F7F7FB]">
        {hasPhoto ? (
          <img
            src={cat.photoUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Branded placeholder — not empty-looking */
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#6C5CE7]/8 via-[#A788FA]/6 to-[#FFF3E0]/20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur-sm">
              <PawPrint size={32} strokeWidth={1.2} className="text-[#6C5CE7]/60" />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-bold text-[#6C5CE7]/70 uppercase tracking-widest">TabbyFund Resident</p>
              <p className="text-[10px] text-[#2D3748]/40 mt-0.5">Photo coming soon</p>
            </div>
          </div>
        )}

        {/* Bottom gradient scrim for readability */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Energy badge — bottom left */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/85 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-[#6C5CE7] border border-white/50">
            <Zap size={9} strokeWidth={2} className="text-amber-500" />
            {energy} Energy
          </span>
        </div>

        {/* Favorite button */}
        <button
          aria-label="Save to favourites"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 backdrop-blur-sm text-[#6C5CE7] transition hover:bg-white hover:scale-110 shadow-sm"
        >
          <Heart size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 overflow-hidden">
        {/* Name */}
        <h3 className="text-base font-bold text-[#2D3748] truncate leading-tight" title={name}>
          {name}
        </h3>

        {/* Personality tags */}
        <div className="mt-2 flex flex-wrap gap-1.5 min-h-[26px]">
          {personalityTags.length > 0 ? (
            <PersonalityTags tags={personalityTags} />
          ) : (
            <span className="text-[10px] text-[#2D3748]/40 italic">Sweet &amp; friendly</span>
          )}
        </div>

        {/* Health tags */}
        <div className="mt-2 min-h-[22px]">
          <HealthTags tags={healthTags.slice(0, 3)} />
        </div>

        {/* Description — clamped, allows breathing room */}
        {description ? (
          <p className="mt-2 text-xs text-[#2D3748]/60 line-clamp-2 leading-relaxed flex-1">
            {description}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        {/* CTA */}
        <div className="mt-4 flex gap-2 shrink-0">
          <Link
            href={`/adopt/${cat.caseId}`}
            className="flex flex-1 h-11 items-center justify-center gap-1.5 rounded-[12px] bg-[#6C5CE7] text-xs font-bold text-white transition hover:bg-[#A788FA] active:scale-[0.98] shadow-[0_2px_8px_rgba(108,92,231,0.20)]"
          >
            <Heart size={12} strokeWidth={2} /> Meet This Cat
          </Link>
          <Link
            href={`/adopt/${cat.caseId}`}
            aria-label="View details"
            className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#A788FA]/20 text-[#6C5CE7] transition hover:bg-[#6C5CE7]/5"
          >
            <ChevronRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
