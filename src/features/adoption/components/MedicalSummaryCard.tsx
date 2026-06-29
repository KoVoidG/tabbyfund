import { Stethoscope, ShieldCheck, CircleCheck } from "lucide-react";

interface MedicalSummaryCardProps {
  vaccination: string;
  neutered: boolean;
  specialNeeds?: string;
  treatmentSummary: string;
  vet: string;
}

/**
 * MedicalSummaryCard — vet-owned medical information for adoption profile.
 * Clearly labeled as "Medical Clearance by Vet".
 */
export function MedicalSummaryCard({ vaccination, neutered, specialNeeds, treatmentSummary, vet }: MedicalSummaryCardProps) {
  return (
    <div className="rounded-[16px] border border-emerald-200/50 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748]">
          <Stethoscope size={16} strokeWidth={1.5} className="text-emerald-600" /> Medical Summary
        </h3>
        <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
          <ShieldCheck size={10} strokeWidth={1.5} /> Cleared by {vet}
        </span>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#2D3748]/60">Vaccination</span>
          <span className="flex items-center gap-1 font-medium text-[#2D3748]">
            {vaccination === "complete" && <CircleCheck size={11} strokeWidth={1.5} className="text-emerald-500" />}
            {vaccination === "complete" ? "Complete" : vaccination === "partial" ? "Partial" : "None"}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#2D3748]/60">Neutered/Spayed</span>
          <span className="font-medium text-[#2D3748]">{neutered ? "Yes" : "No"}</span>
        </div>
        {specialNeeds && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#2D3748]/60">Special Needs</span>
            <span className="font-medium text-[#2D3748]">{specialNeeds}</span>
          </div>
        )}
        <div className="mt-2 pt-2 border-t border-[#A788FA]/10">
          <p className="text-[10px] text-[#2D3748]/50 mb-1">Treatment Summary</p>
          <p className="text-xs text-[#2D3748]/80 leading-relaxed">{treatmentSummary}</p>
        </div>
      </div>
    </div>
  );
}
