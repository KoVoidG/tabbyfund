"use client";

import { useState } from "react";
import { MapPin, HandCoins, CircleAlert, TriangleAlert, Info, CircleCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DonationSheet } from "./DonationSheet";
import type { DonationCase } from "../mock-data";

const severityConfig = {
  CRITICAL: { bg: "bg-red-600", text: "text-white", icon: CircleAlert },
  HIGH: { bg: "bg-orange-500", text: "text-white", icon: TriangleAlert },
  MEDIUM: { bg: "bg-amber-400", text: "text-[#2D3748]", icon: Info },
  LOW: { bg: "bg-emerald-500", text: "text-white", icon: CircleCheck },
};

interface DonationCaseCardProps {
  caseData: DonationCase;
}

/**
 * DonationCaseCard — fundraiser card with integrated donation flow.
 * Shows case info, progress, and opens DonationSheet on click.
 */
export function DonationCaseCard({ caseData }: DonationCaseCardProps) {
  const [showDonation, setShowDonation] = useState(false);
  const percent = Math.min(Math.round((caseData.raised / caseData.goal) * 100), 100);
  const sev = severityConfig[caseData.severity];
  const SevIcon = sev.icon;
  const remaining = Math.max(caseData.goal - caseData.raised, 0);

  return (
    <>
      <div className="overflow-hidden rounded-[16px] border border-[#A788FA]/15 bg-white shadow-[0_2px_12px_rgba(108,92,231,0.06)] transition-all hover:shadow-[0_8px_28px_rgba(108,92,231,0.12)] hover:border-[#6C5CE7]/20">
        {/* Photo */}
        <div className="relative h-36 overflow-hidden bg-[#F7F7FB]">
          <img src={caseData.photo} alt="" className="h-full w-full object-cover" />
          <div className="absolute top-2.5 left-2.5">
            <span className={`inline-flex items-center gap-1 rounded-full ${sev.bg} px-2 py-0.5 text-[10px] font-bold ${sev.text}`}>
              <SevIcon size={10} strokeWidth={2} /> {caseData.severity}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm font-semibold text-[#2D3748] line-clamp-1">{caseData.title}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#2D3748]/50">
            <MapPin size={10} strokeWidth={1.5} /> {caseData.location}
          </p>

          {/* Progress */}
          <div className="mt-3">
            <Progress value={percent} className="h-2 bg-[#A788FA]/15 [&>div]:bg-[#6C5CE7] [&>div]:rounded-full rounded-full" />
            <div className="mt-1.5 flex items-center justify-between text-[10px]">
              <span className="font-medium text-[#6C5CE7]">฿{caseData.raised.toLocaleString()}</span>
              <span className="text-[#2D3748]/50">฿{remaining.toLocaleString()} left</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => setShowDonation(true)}
            className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#6C5CE7] text-xs font-semibold text-white transition hover:bg-[#A788FA] active:scale-[0.98]"
          >
            <HandCoins size={14} strokeWidth={1.5} /> Donate
          </button>
        </div>
      </div>

      <DonationSheet
        caseData={caseData}
        open={showDonation}
        onClose={() => setShowDonation(false)}
      />
    </>
  );
}
