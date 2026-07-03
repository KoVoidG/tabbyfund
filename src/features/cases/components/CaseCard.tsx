import Link from "next/link";
import {
  MapPin,
  Clock,
  CircleAlert,
  TriangleAlert,
  Info,
  CircleCheck,
  HandCoins,
  Truck,
  Navigation,
  Stethoscope,
  HeartHandshake,
  HeartPulse,
  House,
  PawPrint,
  ShieldCheck,
  CircleOff,
  FileText,
  BriefcaseMedical,
  BadgeCheck,
  Banknote,
  ClipboardList,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { CaseStatus, Severity } from "../types";

const severityConfig = {
  CRITICAL: { bg: "bg-red-100 border border-red-200/50", text: "text-red-800", icon: CircleAlert },
  HIGH: { bg: "bg-orange-100 border border-orange-200/50", text: "text-orange-800", icon: TriangleAlert },
  MEDIUM: { bg: "bg-amber-100 border border-amber-200/50", text: "text-amber-800", icon: Info },
  LOW: { bg: "bg-emerald-100 border border-emerald-200/50", text: "text-emerald-800", icon: CircleCheck },
};

const statusLabels: Record<CaseStatus, { label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; bg: string; text: string }> = {
  REPORTED:          { label: "Reported",       Icon: FileText,        bg: "bg-blue-50/90 border border-blue-200/50",    text: "text-blue-700" },
  TRIAGED:           { label: "Triaged",         Icon: ClipboardList,   bg: "bg-teal-50/90 border border-teal-200/50",    text: "text-teal-700" },
  AWAITING_TRANSPORT:{ label: "Needs Transport", Icon: Truck,           bg: "bg-red-50/90 border border-red-200/50",      text: "text-red-700 font-semibold" },
  IN_TRANSIT:        { label: "In Transit",      Icon: Navigation,      bg: "bg-amber-50/90 border border-amber-200/50",  text: "text-amber-700" },
  AT_VET:            { label: "At Vet",          Icon: Stethoscope,     bg: "bg-purple-50/90 border border-purple-200/50",text: "text-purple-700" },
  QUOTED:            { label: "Quoted",          Icon: BriefcaseMedical,bg: "bg-indigo-50/90 border border-indigo-200/50",text: "text-indigo-700" },
  FUNDING_OPEN:      { label: "Funding Open",    Icon: HeartHandshake,  bg: "bg-amber-50/90 border border-amber-200/50",  text: "text-amber-700 font-semibold" },
  FUNDED:            { label: "Funded",          Icon: BadgeCheck,      bg: "bg-emerald-50/90 border border-emerald-200/50",text: "text-emerald-700" },
  IN_TREATMENT:      { label: "In Treatment",    Icon: HeartPulse,      bg: "bg-purple-50/90 border border-purple-200/50",text: "text-purple-700 font-semibold" },
  TREATED:           { label: "Treated",         Icon: BriefcaseMedical,bg: "bg-emerald-50/90 border border-emerald-200/50",text: "text-emerald-700" },
  FUNDS_RELEASED:    { label: "Funds Released",  Icon: Banknote,        bg: "bg-emerald-50/90 border border-emerald-200/50",text: "text-emerald-700" },
  IN_FOSTER:         { label: "In Foster",       Icon: House,           bg: "bg-purple-50/90 border border-purple-200/50",text: "text-purple-700 font-semibold" },
  ADOPTED:           { label: "Adopted",         Icon: PawPrint,        bg: "bg-pink-50/90 border border-pink-200/50",    text: "text-pink-700 font-semibold" },
  SHELTERED:         { label: "Sheltered",       Icon: ShieldCheck,     bg: "bg-gray-50/90 border border-gray-200/50",    text: "text-gray-700" },
  REUNITED:          { label: "Reunited",        Icon: HeartHandshake,  bg: "bg-emerald-50/90 border border-emerald-200/50",text: "text-emerald-700" },
  CANCELLED:         { label: "Cancelled",       Icon: CircleOff,       bg: "bg-gray-50/90 border border-gray-200/50",    text: "text-gray-700" },
  LOST_CONTACT:      { label: "Lost Contact",    Icon: CircleOff,       bg: "bg-gray-50/90 border border-gray-200/50",    text: "text-gray-700" },
  DECEASED:          { label: "Deceased",        Icon: CircleOff,       bg: "bg-gray-50/90 border border-gray-200/50",    text: "text-gray-700" },
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
  isClosed?: boolean;
}

/**
 * CaseCard — full rescue case card for the /cases feed grid.
 * Photo, severity, status, description, funding progress, location.
 * Status badges use Lucide icons (no emojis).
 */
export function CaseCard({ id, photo, description, status, severity, condition, location, reportedAgo, goal, raised, isClosed }: CaseCardProps) {
  const sev = severityConfig[severity];
  const SevIcon = sev.icon;
  const percent = goal && raised ? Math.min(Math.round((raised / goal) * 100), 100) : null;
  const statusInfo = statusLabels[status];
  const StatusIcon = statusInfo.Icon;
  const isPlaceholder = !photo || photo.includes("placehold.co") || photo.includes("placeholder");

  return (
    <Link
      href={`/cases/${id}`}
      className={`group flex flex-col overflow-hidden rounded-[16px] border border-[#A788FA]/15 bg-white shadow-[0_2px_12px_rgba(108,92,231,0.06)] transition-all hover:shadow-[0_8px_28px_rgba(108,92,231,0.14)] hover:border-[#6C5CE7]/20 h-[340px] ${
        isClosed ? "opacity-65 grayscale-[30%] hover:opacity-95 hover:grayscale-[5%]" : ""
      }`}
    >
      {/* Photo */}
      <div className="relative h-40 shrink-0 overflow-hidden bg-[#F7F7FB]">
        {isPlaceholder ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6C5CE7]/5 via-[#A788FA]/5 to-[#FFF3E0]/10">
            <PawPrint size={36} strokeWidth={1} className="text-[#6C5CE7]/30" />
          </div>
        ) : (
          <img src={photo} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        )}

        {/* Severity badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`inline-flex items-center gap-1 rounded-full ${sev.bg} px-2 py-0.5 text-[10px] font-bold ${sev.text}`}>
            <SevIcon size={10} strokeWidth={2} /> {severity}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-sm border ${statusInfo.bg} ${statusInfo.text}`}>
            <StatusIcon size={10} strokeWidth={2} />
            <span>{statusInfo.label}</span>
          </span>
        </div>
      </div>

      {/* Content — fills remaining space, overflow hidden */}
      <div className="flex flex-col flex-1 p-4 overflow-hidden">
        <p className="text-xs font-semibold text-[#6C5CE7] mb-1 truncate">{condition}</p>
        <p className="text-sm text-[#2D3748] line-clamp-2 leading-relaxed flex-1">{description}</p>

        {/* Funding progress */}
        {percent !== null && goal && raised !== undefined && (
          <div className="mt-3 shrink-0">
            <Progress value={percent} className="h-1.5 bg-[#A788FA]/15 [&>div]:bg-[#6C5CE7]" />
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#2D3748]/60">
              <span className="flex items-center gap-0.5"><HandCoins size={10} strokeWidth={1.5} className="text-[#6C5CE7]" />฿{raised.toLocaleString()}</span>
              <span>of ฿{goal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="mt-3 shrink-0 flex items-center gap-3 text-[10px] text-[#2D3748]/50">
          <span className="flex items-center gap-0.5 truncate"><MapPin size={10} strokeWidth={1.5} />{location}</span>
          <span className="flex items-center gap-0.5 shrink-0"><Clock size={10} strokeWidth={1.5} />{reportedAgo}</span>
        </div>
      </div>
    </Link>
  );
}
