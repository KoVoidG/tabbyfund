"use client";

import { useState } from "react";
import { HandCoins, Users, PartyPopper } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { DonationSheet } from "@/features/donation/components/DonationSheet";
import type { DonationCase } from "@/features/donation/mock-data";

interface FundingCardProps {
  goal: number;
  raised: number;
  donors: number;
  /** Optional case data to enable inline donation flow */
  caseData?: DonationCase;
}

/**
 * FundingCard — celebratory funding progress with donate CTA.
 * Shows percentage, raised/goal, remaining, donor count.
 * Fully funded state shows a celebration message.
 */
export function FundingCard({ goal, raised, donors, caseData }: FundingCardProps) {
  const [showDonation, setShowDonation] = useState(false);
  const percent = Math.min(Math.round((raised / goal) * 100), 100);
  const remaining = Math.max(goal - raised, 0);
  const isFullyFunded = remaining === 0;

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748] mb-5">
        <HandCoins size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Community Funding
      </h3>

      {/* Fully funded celebration */}
      {isFullyFunded && (
        <div className="flex flex-col items-center text-center mb-5 rounded-[12px] bg-emerald-50 p-4">
          <TabbyMascot variant="celebrate" size="xl" />
          <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            <PartyPopper size={16} strokeWidth={1.5} /> Community successfully funded this rescue!
          </p>
        </div>
      )}

      {/* Large percentage */}
      <div className="text-center mb-4">
        <p className="text-4xl font-bold text-[#6C5CE7]">{percent}%</p>
        <p className="mt-1 text-sm text-[#2D3748]/60">
          ฿{raised.toLocaleString()} raised of ฿{goal.toLocaleString()}
        </p>
      </div>

      {/* Progress bar */}
      <Progress value={percent} className="h-3 bg-[#A788FA]/15 [&>div]:bg-[#6C5CE7] [&>div]:rounded-full rounded-full" />

      {/* Stats row */}
      <div className="mt-4 flex items-center justify-between text-xs text-[#2D3748]/60">
        <span className="flex items-center gap-1">
          <Users size={13} strokeWidth={1.5} /> {donors} donor{donors !== 1 ? "s" : ""}
        </span>
        {!isFullyFunded && (
          <span className="font-medium text-[#2D3748]">฿{remaining.toLocaleString()} remaining</span>
        )}
      </div>

      {/* CTA */}
      {!isFullyFunded && (
        <button
          onClick={() => setShowDonation(true)}
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition hover:bg-[#A788FA] active:scale-[0.98]"
        >
          <HandCoins size={16} strokeWidth={1.5} /> Donate Now
        </button>
      )}

      {/* Donation Sheet */}
      {caseData && (
        <DonationSheet caseData={caseData} open={showDonation} onClose={() => setShowDonation(false)} />
      )}
    </div>
  );
}
