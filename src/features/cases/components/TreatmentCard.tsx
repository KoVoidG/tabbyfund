import { HeartPulse, Stethoscope, Camera } from "lucide-react";

interface TreatmentCardProps {
  vet: string;
  summary: string;
  outcome: "ONGOING" | "RECOVERED" | "DECEASED" | "REFERRED";
  beforePhoto: string;
  afterPhoto: string | null;
}

/**
 * TreatmentCard — treatment progress with before/after photo.
 */
export function TreatmentCard({ vet, summary, outcome, beforePhoto, afterPhoto }: TreatmentCardProps) {
  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748] mb-4">
        <HeartPulse size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Treatment Progress
      </h3>

      {/* Status + vet */}
      <div className="flex items-center gap-3 mb-4">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          outcome === "RECOVERED" ? "bg-emerald-100 text-emerald-700" :
          outcome === "DECEASED" ? "bg-gray-100 text-gray-700" :
          outcome === "REFERRED" ? "bg-amber-100 text-amber-700" :
          "bg-blue-100 text-blue-700"
        }`}>
          {outcome === "RECOVERED" ? "✓ Recovered" :
           outcome === "DECEASED" ? "✝ Deceased" :
           outcome === "REFERRED" ? "→ Referred" :
           "● Ongoing"}
        </span>
        <span className="flex items-center gap-1 text-xs text-[#2D3748]/60">
          <Stethoscope size={12} strokeWidth={1.5} /> {vet}
        </span>
      </div>

      {/* Summary */}
      <p className="text-sm text-[#2D3748]/80 leading-relaxed mb-5">{summary}</p>

      {/* Before / After photo */}
      {afterPhoto ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5 rounded-[12px] border border-[#A788FA]/15 p-2 bg-[#F7F7FB]">
            <img src={beforePhoto} alt="Before Treatment" className="w-full h-32 object-cover rounded-[8px]" />
            <p className="text-[10px] text-[#2D3748]/60 font-semibold text-center mt-1">Before Treatment</p>
          </div>
          <div className="flex flex-col gap-1.5 rounded-[12px] border border-[#A788FA]/15 p-2 bg-[#F7F7FB]">
            <img src={afterPhoto} alt="After Treatment" className="w-full h-32 object-cover rounded-[8px]" />
            <p className="text-[10px] text-[#2D3748]/60 font-semibold text-center mt-1">After Treatment</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5 rounded-[12px] border border-[#A788FA]/15 p-2 bg-[#F7F7FB]">
            <img src={beforePhoto} alt="Before Treatment" className="w-full h-32 object-cover rounded-[8px]" />
            <p className="text-[10px] text-[#2D3748]/60 font-semibold text-center mt-1">Before Treatment</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-[12px] border border-dashed border-[#A788FA]/20 p-2 bg-white min-h-[160px]">
            <Camera size={24} strokeWidth={1} className="text-[#A788FA]/30 mb-1" />
            <p className="text-[10px] text-[#2D3748]/40 font-medium text-center">No post-treatment photo uploaded yet.</p>
          </div>
        </div>
      )}
    </div>
  );
}
