import Link from "next/link";
import { MapPin, Clock, CircleAlert, TriangleAlert } from "lucide-react";

interface CasePreviewCardProps {
  id: string;
  photo: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  location: string;
  reportedAgo: string;
}

const severityConfig = {
  CRITICAL: { bg: "bg-red-600", text: "text-white", icon: CircleAlert, label: "Critical" },
  HIGH: { bg: "bg-orange-500", text: "text-white", icon: TriangleAlert, label: "High" },
  MEDIUM: { bg: "bg-amber-400", text: "text-[#2D3748]", icon: CircleAlert, label: "Medium" },
  LOW: { bg: "bg-emerald-500", text: "text-white", icon: CircleAlert, label: "Low" },
};

/**
 * CasePreviewCard — compact rescue case card for dashboard lists.
 * Shows photo, severity, location, and time. Links to case detail.
 */
export function CasePreviewCard({ id, photo, description, severity, location, reportedAgo }: CasePreviewCardProps) {
  const sev = severityConfig[severity];

  return (
    <Link
      href={`/cases/${id}`}
      className="flex gap-3 rounded-[14px] border border-[#A788FA]/15 bg-white p-3 shadow-[0_2px_12px_rgba(108,92,231,0.06)] transition-all hover:shadow-[0_6px_24px_rgba(108,92,231,0.12)] hover:border-[#6C5CE7]/20"
    >
      {/* Thumbnail */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[10px] bg-[#F7F7FB]">
        <img src={photo} alt="" className="h-full w-full object-cover" />
      </div>
      {/* Content */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <span className={`inline-flex items-center gap-1 rounded-full ${sev.bg} px-2 py-0.5 text-[10px] font-bold ${sev.text}`}>
            <sev.icon size={10} strokeWidth={2} /> {sev.label}
          </span>
          <p className="mt-1 text-xs text-[#2D3748] line-clamp-2 leading-relaxed">{description}</p>
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-[10px] text-[#2D3748]/50">
          <span className="flex items-center gap-0.5"><MapPin size={10} strokeWidth={1.5} />{location}</span>
          <span className="flex items-center gap-0.5"><Clock size={10} strokeWidth={1.5} />{reportedAgo}</span>
        </div>
      </div>
    </Link>
  );
}
