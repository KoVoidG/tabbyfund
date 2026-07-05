import Link from "next/link";
import {
  MapPin,
  Clock,
  CircleAlert,
  TriangleAlert,
  Info,
  CircleCheck,
  Stethoscope,
  FileText,
  HeartPulse,
  Eye,
  HandCoins,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { VetCaseRow } from "@/lib/vet-cases";

const severityConfig = {
  CRITICAL: {
    bg: "bg-red-50 text-[#EF4444] border-red-200/50",
    icon: CircleAlert,
  },
  HIGH: {
    bg: "bg-orange-50 text-[#F59E0B] border-orange-200/50",
    icon: TriangleAlert,
  },
  MEDIUM: {
    bg: "bg-[#6C5CE7]/5 text-[#6C5CE7] border-[#ECEAF8]",
    icon: Info,
  },
  LOW: {
    bg: "bg-blue-50 text-blue-700 border-blue-200/50",
    icon: CircleCheck,
  },
};

const statusConfig = {
  waiting: {
    label: "Awaiting Exam",
    color: "bg-orange-50 text-[#F59E0B] border-orange-200/50",
  },
  quoted: {
    label: "Quote Sent",
    color: "bg-[#6C5CE7]/10 text-[#6C5CE7] border-[#ECEAF8]",
  },
  in_treatment: {
    label: "In Treatment",
    color: "bg-blue-50 text-blue-700 border-blue-200/50",
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-50 text-[#22C55E] border-emerald-200/50",
  },
};

/** Map vetStatus → primary CTA for this case */
function getAction(vetStatus: VetCaseRow["vetStatus"]): {
  label: string;
  Icon: typeof Stethoscope;
  className: string;
} {
  switch (vetStatus) {
    case "waiting":
      return {
        label: "Review Case",
        Icon: Stethoscope,
        className: "bg-orange-500 hover:bg-orange-600 text-white shadow-sm",
      };
    case "quoted":
      return {
        label: "View Funding",
        Icon: FileText,
        className: "bg-[#6C5CE7] hover:bg-[#7A6AF0] text-white shadow-sm",
      };
    case "in_treatment":
      return {
        label: "Update Treatment",
        Icon: HeartPulse,
        className: "bg-[#6C5CE7] hover:bg-[#7A6AF0] text-white shadow-sm",
      };
    case "completed":
    default:
      return {
        label: "View Record",
        Icon: Eye,
        className: "bg-[#1F2940]/5 hover:bg-[#1F2940]/10 text-[#1F2940]",
      };
  }
}

interface VetCaseCardProps {
  vetCase: VetCaseRow;
}

/**
 * VetCaseCard — case card tailored for the vet dashboard.
 * Designed with a premium Linear-like UI, highlighting scanning ease,
 * clear visual focus on funding, and consistent hover interactions.
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

  // Determine progress bar fill color
  let progressBgClass = "bg-[#6C5CE7]";
  if (percent !== null && percent >= 100) {
    progressBgClass = "bg-[#22C55E]"; // success green
  } else if (vetCase.vetStatus === "waiting") {
    progressBgClass = "bg-[#F59E0B]"; // overdue / waiting orange
  }

  return (
    <div className="group rounded-[24px] border border-[#ECEAF8] bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.02)] hover:shadow-[0_12px_30px_rgba(108,92,231,0.08)] hover:border-[#6C5CE7]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
      {/* Top Row: Thumbnail + Title Block + Status Badges */}
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
        <Link href={`/vet/cases/${vetCase.id}`} className="flex gap-4 flex-1 min-w-0 items-start">
          {/* Thumbnail */}
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-[16px] border border-[#ECEAF8] bg-[#F7F7FB]">
            {vetCase.photo_url ? (
              <img
                src={vetCase.photo_url}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#F7F7FB] text-[#A7AEC3]">
                <Sparkles size={24} />
              </div>
            )}
          </div>

          {/* Title & Metadata */}
          <div className="flex-1 min-w-0 space-y-1.5 text-left">
            <h3 className="text-xl font-bold text-[#1F2940] leading-snug truncate">
              {vetCase.ai_condition ?? "Unknown Condition"}
            </h3>
            <p className="text-base text-[#697386] line-clamp-1 leading-relaxed">
              {vetCase.description}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-[#A7AEC3] font-semibold mt-1">
              <span className="flex items-center gap-1">
                <MapPin size={11} strokeWidth={2} />
                {location}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} strokeWidth={2} />
                {reportedAgo}
              </span>
            </div>
          </div>
        </Link>

        {/* Status badges right-aligned */}
        <div className="flex flex-row sm:flex-col gap-2 sm:items-end shrink-0 w-full sm:w-auto mt-2 sm:mt-0 justify-start sm:justify-end">
          <span className={`inline-flex items-center gap-1 rounded-full border ${sev.bg} px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider`}>
            <SevIcon size={10} strokeWidth={2.5} />
            {severity}
          </span>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${stat.color}`}>
            {stat.label}
          </span>
        </div>
      </div>

      {/* Middle Section: Two-Column Information Grid */}
      <div className="grid grid-cols-2 gap-4 border-t border-[#ECEAF8] pt-4">
        <div className="space-y-0.5 text-left">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#A7AEC3]">Reporter</span>
          <span className="text-base font-medium text-[#1F2940] block truncate">{vetCase.reporter?.display_name ?? "Anonymous"}</span>
        </div>
        <div className="space-y-0.5 text-left">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#A7AEC3]">Clinic</span>
          <span className="text-base font-medium text-[#1F2940] block truncate">{vetCase.assignedClinic ?? "Unassigned"}</span>
        </div>
      </div>

      {/* Funding Progress Section */}
      <div className="border-t border-[#ECEAF8] pt-4 space-y-2 text-left">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#A7AEC3]">
          <span>Funding Progress</span>
          {percent !== null && (
            <span className="text-[#1F2940] font-bold tracking-normal text-[13px]">{percent}%</span>
          )}
        </div>
        {percent !== null && vetCase.goal > 0 ? (
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-[#ECEAF8] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressBgClass} ${percent >= 100 ? "animate-pulse" : ""}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[13px] font-semibold text-[#697386]">
              <span className="text-[#6C5CE7]">฿{vetCase.totalRaised.toLocaleString()} raised</span>
              <span>Goal: ฿{vetCase.goal.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <span className="text-[#A7AEC3] font-medium block text-xs">Pending Quote</span>
        )}
      </div>

      {/* Bottom Action Area: Horizontal Action Bar */}
      <div className="border-t border-[#ECEAF8] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs font-bold text-[#697386] select-none justify-start">
          <Link
            href={`/vet/cases/${vetCase.id}`}
            className="hover:text-[#6C5CE7] flex items-center gap-1.5 transition duration-200"
          >
            <FileText size={14} className="text-[#A7AEC3]" />
            <span>View Case</span>
          </Link>
          <div className="w-px h-3.5 bg-[#ECEAF8]" />
          <Link
            href={`/cases/${vetCase.id}`}
            className="hover:text-[#6C5CE7] flex items-center gap-1.5 transition duration-200"
          >
            <HandCoins size={14} className="text-[#A7AEC3]" />
            <span>Funding</span>
          </Link>
        </div>

        <Link
          href={`/vet/cases/${vetCase.id}`}
          className={`group/btn flex h-10 w-full sm:w-auto items-center justify-center gap-1.5 rounded-[12px] px-5 text-xs font-bold transition-all duration-200 shadow-sm active:scale-[0.98] ${action.className}`}
        >
          <ActionIcon size={14} strokeWidth={2.5} className="group-hover/btn:translate-x-0.5 transition-transform" />
          {action.label}
        </Link>
      </div>
    </div>
  );
}
