import { HandCoins } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { DonationCaseCard } from "@/features/donation/components/DonationCaseCard";
import { EscrowExplainer } from "@/features/donation/components/EscrowExplainer";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { getFundingCases } from "@/lib/donations";

export const metadata = {
  title: "Donate — TabbyFund",
};

/**
 * /donate — Donation hub showing active fundraisers from real Supabase data.
 */
export default async function DonatePage() {
  const cases = await getFundingCases();

  const urgentCases = cases.filter((c) => c.ai_severity === "HIGH" || c.ai_severity === "CRITICAL");
  const almostFunded = cases.filter((c) => c.goal > 0 && c.raised / c.goal >= 0.6)
    .sort((a, b) => b.raised / b.goal - a.raised / a.goal);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="flex items-center gap-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <TabbyMascot variant="donate" size="lg" />
        <div>
          <h1 className="text-xl font-bold text-[#2D3748]">
            Fund a Rescue
          </h1>
          <p className="mt-1 text-sm text-[#2D3748]/60">
            Every baht brings a cat closer to recovery. Your donation is held safely in escrow until treatment is complete.
          </p>
        </div>
      </div>

      {/* Escrow explanation */}
      <EscrowExplainer />

      {/* Empty state */}
      {cases.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-12 text-center space-y-3">
          <TabbyMascot variant="sleep" size="lg" />
          <div>
            <p className="text-sm font-bold text-[#6C5CE7]">Great news!</p>
            <p className="text-xs font-medium text-[#2D3748]/70 mt-0.5">There are currently no active fundraising campaigns.</p>
            <p className="mt-1 text-[10px] text-[#2D3748]/40">
              Cases will appear here once a vet submits a treatment quote!
            </p>
          </div>
        </div>
      )}

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
      {cases.length > 0 && (
        <DashboardSection title="All Active Fundraisers">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((c) => (
              <DonationCaseCard key={c.id} caseData={c} />
            ))}
          </div>
        </DashboardSection>
      )}
    </div>
  );
}
