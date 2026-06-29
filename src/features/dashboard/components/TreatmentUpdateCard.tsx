import { Stethoscope, HeartPulse } from "lucide-react";

interface TreatmentUpdateCardProps {
  id: string;
  title: string;
  vet: string;
  outcome: "ONGOING" | "RECOVERED" | "DECEASED" | "REFERRED";
  lastUpdate: string;
  summary: string;
}

const outcomeConfig = {
  ONGOING: { color: "text-blue-600", bg: "bg-blue-100", label: "Ongoing" },
  RECOVERED: { color: "text-emerald-600", bg: "bg-emerald-100", label: "Recovered" },
  DECEASED: { color: "text-gray-500", bg: "bg-gray-100", label: "Deceased" },
  REFERRED: { color: "text-amber-600", bg: "bg-amber-100", label: "Referred" },
};

/**
 * TreatmentUpdateCard — shows treatment progress for a case.
 * Reusable in dashboard and vet portal.
 */
export function TreatmentUpdateCard({ title, vet, outcome, lastUpdate, summary }: TreatmentUpdateCardProps) {
  const config = outcomeConfig[outcome];

  return (
    <div className="rounded-[14px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.06)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6C5CE7]/8">
            <HeartPulse size={16} strokeWidth={1.5} className="text-[#6C5CE7]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2D3748] leading-tight">{title}</p>
            <p className="flex items-center gap-1 text-[11px] text-[#2D3748]/50">
              <Stethoscope size={10} strokeWidth={1.5} /> {vet}
            </p>
          </div>
        </div>
        <span className={`rounded-full ${config.bg} px-2 py-0.5 text-[10px] font-semibold ${config.color}`}>
          {config.label}
        </span>
      </div>
      <p className="mt-2.5 text-xs text-[#2D3748]/70 leading-relaxed">{summary}</p>
      <p className="mt-2 text-[10px] text-[#2D3748]/40">Updated {lastUpdate}</p>
    </div>
  );
}
