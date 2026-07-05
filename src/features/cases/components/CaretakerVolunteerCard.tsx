"use client";

import { useTransition } from "react";
import { Home, LoaderCircle, Heart } from "lucide-react";
import { startFoster, declineFoster } from "@/features/foster/actions";

interface CaretakerVolunteerCardProps {
  caseId: string;
  isTransporter?: boolean;
  transporterPending?: boolean;
}

/**
 * CaretakerVolunteerCard — shown on case detail when a TREATED/FUNDS_RELEASED cat
 * has no assigned caretaker. Allows transporter to claim/decline, or any user to volunteer.
 */
export function CaretakerVolunteerCard({ caseId, isTransporter, transporterPending }: CaretakerVolunteerCardProps) {
  const [isPending, startTransition] = useTransition();

  if (transporterPending) {
    return (
      <div className="rounded-[16px] border border-[#A788FA]/20 bg-slate-50 p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748] mb-2">
          <Home size={16} strokeWidth={1.5} className="text-amber-600" /> Temporary Caretaker Pending
        </h3>
        <p className="text-xs text-[#2D3748]/60 mb-4">
          The transporter who rescued this cat has priority to foster. Other volunteers can caretaker if they decline.
        </p>
        <button
          disabled
          className="w-full flex h-10 items-center justify-center gap-2 rounded-[12px] bg-slate-100 text-xs font-semibold text-slate-400 cursor-not-allowed border border-slate-200"
        >
          Volunteer (Pending Transporter Decision)
        </button>
      </div>
    );
  }

  function handleVolunteer() {
    startTransition(async () => {
      const result = await startFoster({ caseId });
      if (!result.success) {
        alert(result.error ?? "Failed to volunteer as caretaker.");
      }
    });
  }

  function handleDecline() {
    startTransition(async () => {
      const result = await declineFoster({ caseId });
      if (!result.success) {
        alert(result.error ?? "Failed to decline caretaker role.");
      }
    });
  }

  if (isTransporter) {
    return (
      <div className="rounded-[16px] border border-[#6C5CE7]/15 bg-gradient-to-br from-[#6C5CE7]/5 to-[#A788FA]/5 p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748] mb-2">
          <Home size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Continue as Temporary Caretaker?
        </h3>
        <p className="text-xs text-[#2D3748]/60 mb-4">
          As the transporter who brought this cat to safety, you have first priority to become their temporary caretaker during recovery.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleVolunteer}
            disabled={isPending}
            className="flex-1 flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition hover:bg-[#A788FA] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <><LoaderCircle size={14} strokeWidth={2} className="animate-spin" /> Accepting...</>
            ) : (
              <><Heart size={14} strokeWidth={1.5} /> Accept Role</>
            )}
          </button>
          <button
            onClick={handleDecline}
            disabled={isPending}
            className="flex-1 flex h-10 items-center justify-center gap-2 rounded-[12px] border border-[#2D3748]/10 bg-white text-sm font-semibold text-[#2D3748]/75 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Decline
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-[#6C5CE7]/15 bg-gradient-to-br from-[#6C5CE7]/5 to-[#A788FA]/5 p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748] mb-2">
        <Home size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Temporary Caretaker Needed
      </h3>
      <p className="text-xs text-[#2D3748]/60 mb-4">
        This cat has recovered and needs a temporary caretaker to complete its behavioural profile before adoption.
      </p>
      <button
        onClick={handleVolunteer}
        disabled={isPending}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition hover:bg-[#A788FA] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <><LoaderCircle size={14} strokeWidth={2} className="animate-spin" /> Volunteering...</>
        ) : (
          <><Heart size={14} strokeWidth={1.5} /> Volunteer as Temporary Caretaker</>
        )}
      </button>
    </div>
  );
}
