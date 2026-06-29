import Link from "next/link";
import { MapPin, Clock, CircleAlert, TriangleAlert, Info, CircleCheck, ChevronRight } from "lucide-react";
import type { VetCase } from "../mock-data";

const severityConfig = {
  CRITICAL: { bg: "bg-red-600", text: "text-white", icon: CircleAlert },
  HIGH: { bg: "bg-orange-500", text: "text-white", icon: TriangleAlert },
  MEDIUM: { bg: "bg-amber-400", text: "text-[#2D3748]", icon: Info },
  LOW: { bg: "bg-emerald-500", text: "text-white", icon: CircleCheck },
};

const statusConfig = {
  waiting: { label: "Awaiting Exam", color: "bg-orange-100 text-orange-700" },
  quoted: { label: "Quote Sent", color: "bg-purple-100 text-purple-700" },
  in_treatment: { label: "In Treatment", color: "bg-blue-100 text-blue-700" },
  recovering: { label: "Recovering", color: "bg-cyan-100 text-cyan-700" },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
};

interface VetCaseCardProps {
  vetCase: VetCase;
}

/**
 * VetCaseCard — case card tailored for the vet dashboard.
 * Shows severity, status, condition, location. Links to vet case detail.
 */
export function VetCaseCard({ vetCase }: VetCaseCardProps) {
  const sev = severityConfig[vetCase.severity];
  const SevIcon = sev.icon;
  const stat = statusConfig[vetCase.status];

  return (
    <Link
      href={`/vet/cases/${vetCase.id}`}
      className="flex items-center gap-3 rounded-[14px] border border-[#A788FA]/15 bg-white p-3 shadow-[0_2px_12px_rgba(108,92,231,0.06)] transition-all hover:shadow-[0_6px_20px_rgba(108,92,231,0.12)] hover:border-[#6C5CE7]/20"
    >
      {/* Thumbnail */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[10px] bg-[#F7F7FB]">
        <img src={vetCase.photo} alt="" className="h-full w-full object-cover" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className={`inline-flex items-center gap-0.5 rounded-full ${sev.bg} px-1.5 py-0.5 text-[9px] font-bold ${sev.text}`}>
            <SevIcon size={8} strokeWidth={2} /> {vetCase.severity}
          </span>
          <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${stat.color}`}>
            {stat.label}
          </span>
        </div>
        <p className="text-xs font-semibold text-[#2D3748] truncate">{vetCase.condition}</p>
        <p className="text-[10px] text-[#2D3748]/50 truncate">{vetCase.description}</p>
        <div className="mt-1 flex items-center gap-2 text-[9px] text-[#2D3748]/40">
          <span className="flex items-center gap-0.5"><MapPin size={8} strokeWidth={1.5} />{vetCase.location}</span>
          <span className="flex items-center gap-0.5"><Clock size={8} strokeWidth={1.5} />{vetCase.reportedAgo}</span>
        </div>
      </div>

      <ChevronRight size={16} strokeWidth={1.5} className="shrink-0 text-[#2D3748]/20" />
    </Link>
  );
}
