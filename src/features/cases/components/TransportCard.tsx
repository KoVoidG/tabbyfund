"use client";

import { useTransition } from "react";
import { Truck, Clock, CircleCheck, User, LoaderCircle, MapPin, Navigation } from "lucide-react";
import { claimTransport, deliverTransport } from "@/features/transport/actions";

export interface ClinicDestination {
  vetName: string;
  clinicName: string;
  clinicAddress: string | null;
  distance: number | null;
}

interface TransportCardProps {
  caseId: string;
  status: "OPEN" | "CLAIMED" | "DELIVERED";
  transporter?: string;
  isAssignedTransporter?: boolean;
  /** Nearest vet clinics for transport guidance */
  nearestClinics?: ClinicDestination[];
}

const statusConfig = {
  OPEN: { color: "text-orange-600", bg: "bg-orange-100", label: "Awaiting Volunteer", icon: Clock },
  CLAIMED: { color: "text-blue-600", bg: "bg-blue-100", label: "In Transit", icon: Truck },
  DELIVERED: { color: "text-emerald-600", bg: "bg-emerald-100", label: "Delivered to Vet", icon: CircleCheck },
};

export function TransportCard({ caseId, status, transporter, isAssignedTransporter, nearestClinics }: TransportCardProps) {
  const [isPending, startTransition] = useTransition();

  const config = statusConfig[status];
  const Icon = config.icon;

  function handleClaim() {
    startTransition(async () => {
      const result = await claimTransport(caseId);
      if (!result.success) alert(result.error ?? "Failed to claim transport.");
    });
  }

  function handleDeliver() {
    startTransition(async () => {
      const result = await deliverTransport(caseId);
      if (!result.success) alert(result.error ?? "Failed to mark as delivered.");
    });
  }

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748] mb-3">
        <Truck size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Transport
      </h3>

      {/* Status */}
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bg}`}>
          <Icon size={18} strokeWidth={1.5} className={config.color} />
        </div>
        <div>
          <p className={`text-sm font-semibold ${config.color}`}>{config.label}</p>
          {transporter && (
            <p className="flex items-center gap-1 text-xs text-[#2D3748]/60 mt-0.5">
              <User size={11} strokeWidth={1.5} /> {transporter}
            </p>
          )}
        </div>
      </div>

      {/* Destination guidance — shown when not yet delivered */}
      {status !== "DELIVERED" && nearestClinics && nearestClinics.length > 0 && (
        <div className="mt-4 rounded-[10px] bg-[#F7F7FB] p-3 space-y-2">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2D3748]">
            <Navigation size={11} strokeWidth={1.5} className="text-[#6C5CE7]" />
            Recommended destination
          </p>
          {nearestClinics.slice(0, 2).map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <MapPin size={11} strokeWidth={1.5} className="mt-0.5 text-[#A788FA] shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-[#2D3748]">{c.clinicName}</p>
                <p className="text-[10px] text-[#2D3748]/50">
                  {c.vetName}{c.distance != null ? ` · ~${c.distance} km` : " · Distance unavailable"}
                </p>
                {c.clinicAddress && (
                  <p className="text-[9px] text-[#2D3748]/40">{c.clinicAddress}</p>
                )}
              </div>
            </div>
          ))}
          <p className="text-[9px] text-[#2D3748]/40 italic">
            Approx. distance from fuzzed rescue area. Coordinate with rescue team if unsure.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-3">
        {status === "OPEN" && (
          <button
            onClick={handleClaim}
            disabled={isPending}
            className="rounded-[10px] bg-[#6C5CE7] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#A788FA] transition-colors disabled:opacity-60"
          >
            {isPending ? (
              <span className="flex items-center gap-1"><LoaderCircle size={12} className="animate-spin" /> Claiming...</span>
            ) : "Volunteer to Transport"}
          </button>
        )}

        {status === "CLAIMED" && isAssignedTransporter && (
          <button
            onClick={handleDeliver}
            disabled={isPending}
            className="rounded-[10px] bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors disabled:opacity-60"
          >
            {isPending ? (
              <span className="flex items-center gap-1"><LoaderCircle size={12} className="animate-spin" /> Updating...</span>
            ) : "Mark Delivered to Vet"}
          </button>
        )}
      </div>
    </div>
  );
}
