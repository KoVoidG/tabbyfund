"use client";

import { useTransition } from "react";
import { Home, LoaderCircle, Heart } from "lucide-react";
import { startFoster } from "@/features/foster/actions";

interface CaretakerVolunteerCardProps {
  caseId: string;
}

/**
 * CaretakerVolunteerCard — shown on case detail when a TREATED cat
 * has no assigned caretaker. Allows any community user to volunteer.
 */
export function CaretakerVolunteerCard({ caseId }: CaretakerVolunteerCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleVolunteer() {
    startTransition(async () => {
      const result = await startFoster({ caseId });
      if (!result.success) {
        alert(result.error ?? "Failed to volunteer as caretaker.");
      }
    });
  }

  return (
    <div className="rounded-[16px] border border-[#6C5CE7]/15 bg-gradient-to-br from-[#6C5CE7]/5 to-[#A788FA]/5 p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748] mb-2">
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
