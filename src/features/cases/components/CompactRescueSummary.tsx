import { User, Truck, Stethoscope, Home, Activity, DollarSign, HeartPulse } from "lucide-react";
import type { CaseStatus } from "../types";

interface CompactRescueSummaryProps {
  reporter: string;
  transporter: string | null;
  assignedVet: string | null;
  currentFoster: string | null;
  status: CaseStatus;
  fundingStatus: string;
  treatmentStatus: string;
}

export function formatVetName(name: string | null): string | null {
  if (!name) return null;
  if (name.toLowerCase().startsWith("dr.")) return name;
  return `Dr. ${name}`;
}

function getStageLabel(status: CaseStatus): string {
  switch (status) {
    case "REPORTED": return "Reported";
    case "TRIAGED": return "Triaged";
    case "AWAITING_TRANSPORT": return "Awaiting Transport";
    case "IN_TRANSIT": return "In Transit";
    case "AT_VET": return "Awaiting Exam";
    case "QUOTED": return "Quote Created";
    case "FUNDING_OPEN": return "Funding";
    case "FUNDED": return "Fully Funded";
    case "IN_TREATMENT": return "Treatment";
    case "TREATED": return "Treatment Complete";
    case "FUNDS_RELEASED": return "Released";
    case "IN_FOSTER": return "Temporary Care";
    case "ADOPTED": return "Adopted";
    case "SHELTERED": return "Sheltered";
    case "REUNITED": return "Reunited";
    case "DECEASED": return "Deceased";
    default: return status.replace("_", " ");
  }
}

export function CompactRescueSummary({
  reporter,
  transporter,
  assignedVet,
  currentFoster,
  status,
  fundingStatus,
  treatmentStatus,
}: CompactRescueSummaryProps) {
  const stageLabel = getStageLabel(status);

  // Setup badge classes based on status
  let badgeStyles = "bg-slate-100 text-slate-800 border-slate-200/50";
  if (status === "FUNDING_OPEN") {
    badgeStyles = "bg-purple-100 text-purple-800 border-purple-200/50";
  } else if (status === "IN_TREATMENT") {
    badgeStyles = "bg-blue-100 text-blue-800 border-blue-200/50";
  } else if (["FUNDS_RELEASED", "FUNDED", "TREATED"].includes(status)) {
    badgeStyles = "bg-emerald-100 text-emerald-800 border-emerald-200/50";
  } else if (status === "ADOPTED") {
    badgeStyles = "bg-indigo-100 text-indigo-800 border-indigo-200/50";
  } else if (["REPORTED", "TRIAGED", "AWAITING_TRANSPORT", "IN_TRANSIT", "AT_VET"].includes(status)) {
    badgeStyles = "bg-amber-100 text-amber-800 border-amber-200/50";
  }

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.06)] space-y-4">
      <h3 className="text-xs font-bold text-[#2D3748]/55 uppercase tracking-wider pl-0.5">
        Rescue Summary
      </h3>

      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:divide-x sm:divide-[#2D3748]/5 text-xs">
        {/* Reporter */}
        <div className="space-y-1 pl-0.5 min-w-0">
          <span className="flex items-center gap-1.5 font-bold text-[#2D3748]/45 uppercase tracking-wider text-[9px]">
            <User size={12} className="text-[#2D3748]/40" /> Reporter
          </span>
          <p className="font-bold text-[#2D3748] truncate" title={reporter}>{reporter}</p>
        </div>

        {/* Transporter */}
        <div className="space-y-1 sm:pl-4 min-w-0">
          <span className="flex items-center gap-1.5 font-bold text-[#2D3748]/45 uppercase tracking-wider text-[9px]">
            <Truck size={12} className="text-[#2D3748]/40" /> Transporter
          </span>
          <p className="font-bold text-[#2D3748] truncate" title={transporter ?? undefined}>
            {transporter ?? <span className="text-[#2D3748]/35 font-medium">Awaiting claim</span>}
          </p>
        </div>

        {/* Vet */}
        <div className="space-y-1 sm:pl-4 min-w-0">
          <span className="flex items-center gap-1.5 font-bold text-[#2D3748]/45 uppercase tracking-wider text-[9px]">
            <Stethoscope size={12} className="text-[#2D3748]/40" /> Assigned Vet
          </span>
          <p className="font-bold text-[#2D3748] truncate" title={formatVetName(assignedVet) ?? undefined}>
            {formatVetName(assignedVet) ?? <span className="text-[#2D3748]/35 font-medium">Unassigned</span>}
          </p>
        </div>

        {/* Current Foster */}
        <div className="space-y-1 sm:pl-4 min-w-0">
          <span className="flex items-center gap-1.5 font-bold text-[#2D3748]/45 uppercase tracking-wider text-[9px]">
            <Home size={12} className="text-[#2D3748]/40" /> Current Foster
          </span>
          <p className="font-bold text-[#2D3748] truncate" title={currentFoster ?? undefined}>
            {currentFoster === "Waiting for volunteer" ? (
              <span className="text-[#6C5CE7] font-semibold">{currentFoster}</span>
            ) : (
              currentFoster ?? <span className="text-[#2D3748]/35 font-medium">Not ready</span>
            )}
          </p>
        </div>
      </div>

      <div className="border-t border-[#2D3748]/5" />

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-4 text-xs pt-1">
        {/* Stage */}
        <div className="space-y-1 pl-0.5">
          <span className="flex items-center gap-1.5 font-bold text-[#2D3748]/45 uppercase tracking-wider text-[9px]">
            <Activity size={12} className="text-[#2D3748]/40" /> Current Stage
          </span>
          <div>
            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badgeStyles}`}>
              {stageLabel}
            </span>
          </div>
        </div>

        {/* Funding Status */}
        <div className="space-y-1 min-w-0">
          <span className="flex items-center gap-1.5 font-bold text-[#2D3748]/45 uppercase tracking-wider text-[9px]">
            <DollarSign size={12} className="text-[#2D3748]/40" /> Funding Status
          </span>
          <p className="font-bold text-[#2D3748] truncate" title={fundingStatus}>{fundingStatus}</p>
        </div>

        {/* Treatment Status */}
        <div className="space-y-1 min-w-0">
          <span className="flex items-center gap-1.5 font-bold text-[#2D3748]/45 uppercase tracking-wider text-[9px]">
            <HeartPulse size={12} className="text-[#2D3748]/40" /> Treatment Status
          </span>
          <p className="font-bold text-[#2D3748] truncate" title={treatmentStatus}>{treatmentStatus}</p>
        </div>
      </div>
    </div>
  );
}