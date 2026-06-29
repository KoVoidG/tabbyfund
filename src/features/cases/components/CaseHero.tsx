import { MapPin, Clock, User, CircleAlert, TriangleAlert, Info, CircleCheck, HandCoins, Share2, Flag } from "lucide-react";
import type { CaseStatus, Severity } from "../mock-data";

const severityConfig = {
  CRITICAL: { bg: "bg-red-600", text: "text-white", icon: CircleAlert, label: "Critical" },
  HIGH: { bg: "bg-orange-500", text: "text-white", icon: TriangleAlert, label: "High" },
  MEDIUM: { bg: "bg-amber-400", text: "text-[#2D3748]", icon: Info, label: "Medium" },
  LOW: { bg: "bg-emerald-500", text: "text-white", icon: CircleCheck, label: "Low" },
};

const statusLabels: Record<string, string> = {
  REPORTED: "Reported", TRIAGED: "Triaged", AWAITING_TRANSPORT: "Needs Transport",
  IN_TRANSIT: "In Transit", AT_VET: "At Vet", QUOTED: "Quoted",
  FUNDING_OPEN: "Funding Open", FUNDED: "Funded", IN_TREATMENT: "In Treatment",
  TREATED: "Treated", FUNDS_RELEASED: "Funds Released",
  IN_FOSTER: "In Foster", ADOPTED: "Adopted",
};

interface CaseHeroProps {
  photo: string;
  description: string;
  status: CaseStatus;
  severity: Severity;
  condition: string;
  location: string;
  reporter: string;
  reportedAgo: string;
}

/**
 * CaseHero — compact, informative header for case detail page.
 * Shows photo (reduced), cat name/condition, badges, meta, and quick actions.
 */
export function CaseHero({ photo, description, status, severity, condition, location, reporter, reportedAgo }: CaseHeroProps) {
  const sev = severityConfig[severity];
  const SevIcon = sev.icon;

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#A788FA]/15 bg-white shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <div className="flex flex-col sm:flex-row">
        {/* Photo — compact */}
        <div className="relative h-40 sm:h-auto sm:w-48 shrink-0 overflow-hidden bg-[#F7F7FB]">
          <img src={photo} alt="" className="h-full w-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 rounded-full ${sev.bg} px-2.5 py-0.5 text-[11px] font-bold ${sev.text}`}>
              <SevIcon size={11} strokeWidth={2} /> {sev.label}
            </span>
            <span className="rounded-full bg-[#6C5CE7]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#6C5CE7]">
              {statusLabels[status]}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-base font-bold text-[#2D3748] leading-tight">
            {condition}
          </h1>
          <p className="mt-1.5 text-sm text-[#2D3748]/70 leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#2D3748]/55">
            <span className="flex items-center gap-1"><MapPin size={12} strokeWidth={1.5} />{location}</span>
            <span className="flex items-center gap-1"><Clock size={12} strokeWidth={1.5} />{reportedAgo}</span>
            <span className="flex items-center gap-1"><User size={12} strokeWidth={1.5} />{reporter}</span>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="flex items-center gap-1.5 rounded-[10px] bg-[#6C5CE7] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#A788FA]">
              <HandCoins size={14} strokeWidth={1.5} /> Donate
            </button>
            <button className="flex items-center gap-1.5 rounded-[10px] border border-[#A788FA]/30 px-3.5 py-2 text-xs font-medium text-[#6C5CE7] transition hover:bg-[#6C5CE7]/5">
              <Share2 size={14} strokeWidth={1.5} /> Share
            </button>
            <button className="flex items-center gap-1.5 rounded-[10px] border border-[#A788FA]/30 px-3.5 py-2 text-xs font-medium text-[#6C5CE7] transition hover:bg-[#6C5CE7]/5">
              <Flag size={14} strokeWidth={1.5} /> Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
