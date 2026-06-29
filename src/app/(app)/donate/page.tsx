import { HandCoins, Siren, TrendingUp } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { DonationCaseCard } from "@/features/donation/components/DonationCaseCard";
import { EscrowExplainer } from "@/features/donation/components/EscrowExplainer";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { activeFundraisers, urgentCases, almostFunded } from "@/features/donation/mock-data";

export const metadata = {
  title: "Donate — TabbyFund",
};

/**
 * /donate — Donation hub showing active fundraisers.
 */
export default function DonatePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="flex items-center gap-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <TabbyMascot variant="donate" size="lg" />
        <div>
          <h1 className="font-heading text-xl font-bold text-[#2D3748]">
            Fund a Rescue
          </h1>
          <p className="mt-1 text-sm text-[#2D3748]/60">
            Every baht brings a cat closer to recovery. Your donation is held safely in escrow until treatment is complete.
          </p>
        </div>
      </div>

      {/* Escrow explanation */}
      <EscrowExplainer />

      {/* Urgent Cases */}
      {urgentCases.length > 0 && (
        <DashboardSection title="Urgent Cases" viewAllHref="/cases?severity=HIGH">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {urgentCases.map((c) => (
              <DonationCaseCard key={c.id} caseData={c} />
            ))}
          </div>
        </DashboardSection>
      )}

      {/* Almost Funded */}
      {almostFunded.length > 0 && (
        <DashboardSection title="Almost Funded — Help Finish!">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {almostFunded.map((c) => (
              <DonationCaseCard key={c.id} caseData={c} />
            ))}
          </div>
        </DashboardSection>
      )}

      {/* All Active */}
      <DashboardSection title="All Active Fundraisers">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeFundraisers.map((c) => (
            <DonationCaseCard key={c.id} caseData={c} />
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
