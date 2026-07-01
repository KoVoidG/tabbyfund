"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Home, Heart, LoaderCircle, ChevronRight } from "lucide-react";
import { startFoster } from "@/features/foster/actions";
import type { CaretakerNeededCase } from "@/lib/volunteer";

interface CaretakerVolunteerCardProps {
  caseData: CaretakerNeededCase;
}

export function CaretakerVolunteerCard({ caseData }: CaretakerVolunteerCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleVolunteer(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await startFoster({ caseId: caseData.id });
      if (!result.success) {
        alert(result.error ?? "Failed to volunteer as caretaker.");
      }
    });
  }

  return (
    <Link
      href={`/cases/${caseData.id}`}
      className="flex items-center gap-4 rounded-[14px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.06)] transition-all hover:shadow-[0_6px_20px_rgba(108,92,231,0.12)] hover:border-[#6C5CE7]/20"
    >
      <div className="h-16 w-16 shrink-0 rounded-[10px] overflow-hidden bg-[#F7F7FB]">
        <img src={caseData.photo} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#2D3748]">{caseData.condition}</p>
        <p className="mt-0.5 text-[10px] text-[#2D3748]/60 line-clamp-1">{caseData.description}</p>
        <p className="mt-1 text-[9px] text-emerald-600 font-medium">✓ Recovered · Ready for adoption</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={handleVolunteer}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-[10px] bg-[#6C5CE7] px-4 py-2 text-xs font-semibold text-white hover:bg-[#A788FA] transition disabled:opacity-60"
        >
          {isPending ? <LoaderCircle size={12} className="animate-spin" /> : <Heart size={12} strokeWidth={1.5} />}
          Care
        </button>
        <ChevronRight size={14} strokeWidth={1.5} className="text-[#2D3748]/20" />
      </div>
    </Link>
  );
}
