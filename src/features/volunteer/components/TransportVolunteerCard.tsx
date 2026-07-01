"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Truck, MapPin, Clock, LoaderCircle, ChevronRight } from "lucide-react";
import { claimTransport } from "@/features/transport/actions";
import type { TransportNeededCase } from "@/lib/volunteer";

interface TransportVolunteerCardProps {
  caseData: TransportNeededCase;
}

export function TransportVolunteerCard({ caseData }: TransportVolunteerCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleClaim(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await claimTransport(caseData.id);
      if (!result.success) {
        alert(result.error ?? "Failed to claim transport.");
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
        <p className="text-xs text-[#2D3748] line-clamp-2">{caseData.description}</p>
        <div className="mt-1.5 flex items-center gap-3 text-[10px] text-[#2D3748]/50">
          <span className="flex items-center gap-0.5"><MapPin size={10} strokeWidth={1.5} />{caseData.location}</span>
          <span className="flex items-center gap-0.5"><Clock size={10} strokeWidth={1.5} />{caseData.timeAgo}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={handleClaim}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-[10px] bg-[#6C5CE7] px-4 py-2 text-xs font-semibold text-white hover:bg-[#A788FA] transition disabled:opacity-60"
        >
          {isPending ? <LoaderCircle size={12} className="animate-spin" /> : <Truck size={12} strokeWidth={1.5} />}
          Transport
        </button>
        <ChevronRight size={14} strokeWidth={1.5} className="text-[#2D3748]/20" />
      </div>
    </Link>
  );
}
