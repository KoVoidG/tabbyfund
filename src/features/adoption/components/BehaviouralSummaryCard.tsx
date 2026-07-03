import { PawPrint, User } from "lucide-react";
import { PersonalityTags } from "./PersonalityTags";

interface BehaviouralSummaryCardProps {
  personality: string[];
  energyLevel: string;
  goodWithChildren?: boolean;
  goodWithCats?: boolean;
  goodWithDogs?: boolean;
  litterTrained?: boolean;
  indoorOnly: boolean;
  foster: string;
}

/**
 * BehaviouralSummaryCard — foster-owned behavioural information for adoption profile.
 * Clearly labeled as "Behavioural Profile by Foster".
 */
export function BehaviouralSummaryCard({
  personality,
  energyLevel,
  goodWithChildren,
  goodWithCats,
  goodWithDogs,
  litterTrained,
  indoorOnly,
  foster,
}: BehaviouralSummaryCardProps) {
  return (
    <div className="rounded-[16px] border border-[#6C5CE7]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748]">
          <PawPrint size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Behavioural Profile
        </h3>
        <span className="flex items-center gap-1 text-[10px] font-medium text-[#2D3748]/50">
          <User size={10} strokeWidth={1.5} /> By foster: {foster}
        </span>
      </div>

      <div className="space-y-4">
        {/* Personality */}
        <div>
          <p className="text-[10px] font-medium text-[#2D3748]/50 mb-1.5">Personality</p>
          <PersonalityTags tags={personality} />
        </div>

        {/* Quick facts */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-[8px] bg-[#F7F7FB] p-2.5">
            <p className="text-[9px] text-[#2D3748]/50">Energy</p>
            <p className="font-medium text-[#2D3748]">{energyLevel}</p>
          </div>
          <div className="rounded-[8px] bg-[#F7F7FB] p-2.5">
            <p className="text-[9px] text-[#2D3748]/50">Environment</p>
            <p className="font-medium text-[#2D3748]">{indoorOnly ? "Indoor only" : "Indoor/Outdoor"}</p>
          </div>
          {goodWithChildren !== undefined && goodWithChildren !== null && (
            <div className="rounded-[8px] bg-[#F7F7FB] p-2.5">
              <p className="text-[9px] text-[#2D3748]/50">Children</p>
              <p className="font-medium text-[#2D3748]">{goodWithChildren ? "Good ✓" : "Not recommended"}</p>
            </div>
          )}
          {goodWithCats !== undefined && goodWithCats !== null && (
            <div className="rounded-[8px] bg-[#F7F7FB] p-2.5">
              <p className="text-[9px] text-[#2D3748]/50">Other cats</p>
              <p className="font-medium text-[#2D3748]">{goodWithCats ? "Good ✓" : "Prefers alone"}</p>
            </div>
          )}
          {goodWithDogs !== undefined && goodWithDogs !== null && (
            <div className="rounded-[8px] bg-[#F7F7FB] p-2.5">
              <p className="text-[9px] text-[#2D3748]/50">Dogs</p>
              <p className="font-medium text-[#2D3748]">{goodWithDogs ? "Good ✓" : "Not recommended"}</p>
            </div>
          )}
          {litterTrained !== undefined && litterTrained !== null && (
            <div className="rounded-[8px] bg-[#F7F7FB] p-2.5">
              <p className="text-[9px] text-[#2D3748]/50">Litter trained</p>
              <p className="font-medium text-[#2D3748]">{litterTrained ? "Yes ✓" : "No"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
