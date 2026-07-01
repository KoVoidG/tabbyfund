"use client";

import { useState } from "react";
import { MapPin, HandCoins, CircleAlert, TriangleAlert, Info, CircleCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DonationSheet } from "./DonationSheet";
import type { FundingCase } from "@/lib/donations";

const severityConfig = {
  CRITICAL: { bg: "bg-red-600", text: "text-white", icon: CircleAlert },
  HIGH: { bg: "bg-orange-500", text: "text-white", icon: TriangleAlert },
  MEDIUM: { bg: "bg-amber-400", text: "text-[#2D3748]", icon: Info },
  LOW: { bg: "bg-emerald-500", text: "text-white", icon: CircleCheck },
};

interface DonationCaseCardProps {
  caseData: FundingCase;
}

/**
 * DonationCaseCard — fundraiser card with integrated donation flow.
 * Shows case info, progress, and opens DonationSheet on click.
 */
export function DonationCaseCard({ caseData }: DonationCaseCardProps) {
  const [showDonation, setShowDonation] = useState(false);
  const percent = caseData.goal > 0 ? Math.min(Math.round((caseData.raised / caseData.goal) * 100), 100) : 0;
  const severity = (caseData.ai_severity ?? "MEDIUM") as keyof typeof severityConfig;
  const sev = severityConfig[severity] ?? severityConfig.MEDIUM;
  const SevIcon = sev.icon;
  const remaining = Math.max(caseData.goal - caseData.raised, 0);
  const title = caseData.ai_condition ?? "Rescue Case";
  const location = `${caseData.fuzzed_lat.toFixed(3)}°N, ${caseData.fuzzed_lng.toFixed(3)}°E`;

  return (
    <>
      <div className="overflow-hidden rounded-[16px] border border-[#A788FA]/15 bg-white shadow-[0_2px_12px_rgba(108,92,231,0.06)] transition-all hover:shadow-[0_8px_28px_rgba(108,92,231,0.12)] hover:border-[#6C5CE7]/20">
        {/* Photo */}
        <div className="relative h-36 overflow-hidden bg-[#F7F7FB]">
          <img src={caseData.photo_url} alt="" className="h-full w-full object-cover" />
          <div className="absolute top-2.5 left-2.5">
            <span className={`inline-flex items-center gap-1 rounded-full ${sev.bg} px-2 py-0.5 text-[10px] font-bold ${sev.text}`}>
              <SevIcon size={10} strokeWidth={2} /> {severity}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm font-semibold text-[#2D3748] line-clamp-1">{title}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#2D3748]/50">
            <MapPin size={10} strokeWidth={1.5} /> {location}
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
        caseData={{
          id: caseData.id,
          title,
          goal: caseData.goal,
          raised: caseData.raised,
          donors: caseData.donors,
        }}
        open={showDonation}
        onClose={() => setShowDonation(false)}
      />
    </>
  );
}
