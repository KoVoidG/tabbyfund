import Link from "next/link";
import { MapPin, Clock, CircleAlert, TriangleAlert, Info, CircleCheck, ChevronRight, Stethoscope, FileText, HeartPulse, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { VetCaseRow } from "@/lib/vet-cases";

const severityConfig = {
  CRITICAL: { bg: "bg-red-100 border border-red-200/50", text: "text-red-800", icon: CircleAlert },
  HIGH: { bg: "bg-orange-100 border border-orange-200/50", text: "text-orange-800", icon: TriangleAlert },
  MEDIUM: { bg: "bg-amber-100 border border-amber-200/50", text: "text-amber-800", icon: Info },
  LOW: { bg: "bg-emerald-100 border border-emerald-200/50", text: "text-emerald-800", icon: CircleCheck },
};

const statusConfig = {
  waiting: { label: "Awaiting Exam", color: "bg-orange-100 text-orange-700 border-orange-200/50" },
  quoted: { label: "Quote Sent", color: "bg-[#6C5CE7]/10 text-[#6C5CE7] border-[#A788FA]/20" },
  in_treatment: { label: "In Treatment", color: "bg-blue-100 text-blue-700 border-blue-200/50" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700 border-emerald-200/50" },
};

/** Map vetStatus → primary CTA for this case */
function getAction(vetStatus: VetCaseRow["vetStatus"]): {
  label: string;
  Icon: typeof Stethoscope;
  className: string;
} {
  switch (vetStatus) {
    case "waiting":
      return { label: "Review Case", Icon: Stethoscope, className: "bg-orange-500 hover:bg-orange-600 text-white" };
    case "quoted":
      return { label: "View Funding", Icon: FileText, className: "bg-[#6C5CE7] hover:bg-[#A788FA] text-white" };
    case "in_treatment":
      return { label: "Update Treatment", Icon: HeartPulse, className: "bg-[#6C5CE7] hover:bg-[#A788FA] text-white" };
    case "completed":
    default:
      return { label: "View Record", Icon: Eye, className: "bg-[#2D3748]/10 hover:bg-[#2D3748]/15 text-[#2D3748]/75" };
  }
}

interface VetCaseCardProps {
  vetCase: VetCaseRow;
}

/**
 * VetCaseCard — case card tailored for the vet dashboard.
 * Shows severity, status, condition, location. Links to vet case detail.
 * Has a prominent primary action button mapped to the case stage.
 */
export function VetCaseCard({ vetCase }: VetCaseCardProps) {
  const severity = vetCase.ai_severity ?? "MEDIUM";
  const sev = severityConfig[severity];
  const SevIcon = sev.icon;
  const stat = statusConfig[vetCase.vetStatus];
  const action = getAction(vetCase.vetStatus);
  const ActionIcon = action.Icon;
  const reportedAgo = formatDistanceToNow(new Date(vetCase.created_at), { addSuffix: true });
  const location = `${vetCase.fuzzed_lat.toFixed(3)}°N, ${vetCase.fuzzed_lng.toFixed(3)}°E`;
  const percent = vetCase.goal > 0 ? Math.min(vetCase.percentFunded, 100) : null;

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white shadow-[0_2px_12px_rgba(108,92,231,0.06)] hover:shadow-[0_6px_20px_rgba(108,92,231,0.12)] hover:border-[#6C5CE7]/20 transition-all">
      {/* Top row: thumbnail + summary + chevron */}
      <Link href={`/vet/cases/${vetCase.id}`} className="flex items-start gap-3 p-4">
        {/* Thumbnail */}
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[12px] bg-[#F7F7FB]">
          <img src={vetCase.photo_url} alt="" className="h-full w-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className={`inline-flex items-center gap-0.5 rounded-full border ${sev.bg} px-1.5 py-0.5 text-[9px] font-bold ${sev.text}`}>
              <SevIcon size={8} strokeWidth={2} /> {severity}
            </span>
            <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${stat.color}`}>
              {stat.label}
            </span>
          </div>
          <p className="text-xs font-semibold text-[#2D3748] truncate">{vetCase.ai_condition ?? "Unknown"}</p>
          <p className="text-[10px] text-[#2D3748]/50 truncate mt-0.5">{vetCase.description}</p>
          <div className="mt-1.5 flex items-center gap-2.5 text-[9px] text-[#2D3748]/40">
            <span className="flex items-center gap-0.5"><MapPin size={8} strokeWidth={1.5} />{location}</span>
            <span className="flex items-center gap-0.5"><Clock size={8} strokeWidth={1.5} />{reportedAgo}</span>
          </div>
        </div>

        <ChevronRight size={15} strokeWidth={1.5} className="shrink-0 text-[#2D3748]/20 mt-0.5" />
      </Link>

      {/* Detail grid */}
      <div className="mx-4 border-t border-[#2D3748]/5 pt-3 pb-1 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[11px]">
        <div className="space-y-0.5">
          <span className="block text-[9px] font-bold text-[#2D3748]/40 uppercase tracking-wider">Reporter</span>
          <span className="font-semibold text-[#2D3748] truncate block">{vetCase.reporter?.display_name ?? "Anonymous"}</span>
        </div>
        <div className="space-y-0.5">
          <span className="block text-[9px] font-bold text-[#2D3748]/40 uppercase tracking-wider">Assigned Clinic</span>
          <span className="font-semibold text-[#2D3748] truncate block">{vetCase.assignedClinic ?? "Unassigned"}</span>
        </div>

        {/* Funding */}
        <div className="col-span-2 space-y-1">
          <span className="block text-[9px] font-bold text-[#2D3748]/40 uppercase tracking-wider">Funding Progress</span>
          {percent !== null && vetCase.goal > 0 ? (
            <>
              <div className="w-full h-1.5 rounded-full bg-[#A788FA]/10 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    percent >= 100 ? "bg-emerald-500" : percent >= 60 ? "bg-[#6C5CE7]" : "bg-orange-400"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#2D3748]/55">
                <span>฿{vetCase.totalRaised.toLocaleString()} raised</span>
                <span>{percent}% of ฿{vetCase.goal.toLocaleString()}</span>
              </div>
            </>
          ) : (
            <span className="text-[#2D3748]/35 font-medium block">Pending Quote</span>
          )}
        </div>
      </div>

      {/* Primary action button — compact on desktop, full on mobile */}
      <div className="p-3 pt-2 flex justify-end">
        <Link
          href={`/vet/cases/${vetCase.id}`}
          className={`flex h-9 w-full sm:w-auto items-center justify-center gap-1.5 rounded-[10px] px-4 text-xs font-bold transition active:scale-[0.98] ${action.className}`}
        >
          <ActionIcon size={13} strokeWidth={2} />
          {action.label}
        </Link>
      </div>
    </div>
  );
}
