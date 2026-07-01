import Link from "next/link";
import { MapPin, Clock, CircleAlert, TriangleAlert, Info, CircleCheck, HandCoins } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { CaseStatus, Severity } from "../types";

const severityConfig = {
  CRITICAL: { bg: "bg-red-600", text: "text-white", icon: CircleAlert },
  HIGH: { bg: "bg-orange-500", text: "text-white", icon: TriangleAlert },
  MEDIUM: { bg: "bg-amber-400", text: "text-[#2D3748]", icon: Info },
  LOW: { bg: "bg-emerald-500", text: "text-white", icon: CircleCheck },
};

const statusLabels: Record<CaseStatus, string> = {
  REPORTED: "Reported", TRIAGED: "Triaged", AWAITING_TRANSPORT: "Needs Transport",
  IN_TRANSIT: "In Transit", AT_VET: "At Vet", QUOTED: "Quoted",
  FUNDING_OPEN: "Funding Open", FUNDED: "Funded", IN_TREATMENT: "In Treatment",
  TREATED: "Treated", FUNDS_RELEASED: "Funds Released",
  IN_FOSTER: "In Foster", ADOPTED: "Adopted",
  SHELTERED: "Sheltered", REUNITED: "Reunited",
  CANCELLED: "Cancelled", LOST_CONTACT: "Lost Contact", DECEASED: "Deceased",
};

interface CaseCardProps {
  id: string;
  photo: string;
  description: string;
  status: CaseStatus;
  severity: Severity;
  condition: string;
  location: string;
  reportedAgo: string;
  goal?: number;
  raised?: number;
}

/**
 * CaseCard — full rescue case card for the /cases feed grid.
 * Photo, severity, status, description, funding progress, location.
 */
export function CaseCard({ id, photo, description, status, severity, condition, location, reportedAgo, goal, raised }: CaseCardProps) {
  const sev = severityConfig[severity];
  const SevIcon = sev.icon;
  const percent = goal && raised ? Math.min(Math.round((raised / goal) * 100), 100) : null;

  return (
    <Link
      href={`/cases/${id}`}
      className="group overflow-hidden rounded-[16px] border border-[#A788FA]/15 bg-white shadow-[0_2px_12px_rgba(108,92,231,0.06)] transition-all hover:shadow-[0_8px_28px_rgba(108,92,231,0.14)] hover:border-[#6C5CE7]/20"
    >
      {/* Photo */}
      <div className="relative h-40 overflow-hidden bg-[#F7F7FB]">
        <img src={photo} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span className={`inline-flex items-center gap-1 rounded-full ${sev.bg} px-2 py-0.5 text-[10px] font-bold ${sev.text}`}>
            <SevIcon size={10} strokeWidth={2} /> {severity}
          </span>
        </div>
        <div className="absolute top-2.5 right-2.5">
          <span className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-[#2D3748]">
            {statusLabels[status]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs font-medium text-[#6C5CE7] mb-1">{condition}</p>
        <p className="text-sm text-[#2D3748] line-clamp-2 leading-relaxed">{description}</p>

        {/* Funding progress */}
        {percent !== null && goal && raised !== undefined && (
          <div className="mt-3">
            <Progress value={percent} className="h-1.5 bg-[#A788FA]/15 [&>div]:bg-[#6C5CE7]" />
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#2D3748]/60">
              <span className="flex items-center gap-0.5"><HandCoins size={10} strokeWidth={1.5} className="text-[#6C5CE7]" />฿{raised.toLocaleString()}</span>
              <span>of ฿{goal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="mt-3 flex items-center gap-3 text-[10px] text-[#2D3748]/50">
          <span className="flex items-center gap-0.5"><MapPin size={10} strokeWidth={1.5} />{location}</span>
          <span className="flex items-center gap-0.5"><Clock size={10} strokeWidth={1.5} />{reportedAgo}</span>
        </div>
      </div>
    </Link>
  );
}
