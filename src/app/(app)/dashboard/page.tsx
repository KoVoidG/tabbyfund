import { getProfile } from "@/lib/supabase/auth-helpers";
import { redirect } from "next/navigation";
import { PawPrint, Truck, HandCoins, Heart, Plus, Search } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { QuickActionCard } from "@/features/dashboard/components/QuickActionCard";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { CasePreviewCard } from "@/features/dashboard/components/CasePreviewCard";
import { DonationProgressCard } from "@/features/dashboard/components/DonationProgressCard";
import { TreatmentUpdateCard } from "@/features/dashboard/components/TreatmentUpdateCard";
import { AdoptionPreviewCard } from "@/features/dashboard/components/AdoptionPreviewCard";
import { NotificationPreviewCard } from "@/features/dashboard/components/NotificationPreviewCard";
import { createClient } from "@/lib/supabase/server";
import { CaretakerVolunteerCard } from "@/features/cases/components/CaretakerVolunteerCard";
import {
  getDashboardStats,
  getCasesNeedingTransport,
  getActiveFundraisers,
  getTreatmentUpdates,
  getAdoptionReadyCats,
  getRecentNotifications,
} from "@/lib/dashboard";

export const metadata = {
  title: "Dashboard — TabbyFund",
};

export default async function DashboardPage() {
  const profile = await getProfile();
  if (!profile) redirect("/profile-error");

  const [stats, transportCases, fundraisers, treatments, adoptionCats, notifications] = await Promise.all([
    getDashboardStats(profile.id),
    getCasesNeedingTransport(),
    getActiveFundraisers(),
    getTreatmentUpdates(),
    getAdoptionReadyCats(),
    getRecentNotifications(),
  ]);

  // Fetch pending foster decisions for transporter priority
  const supabase = await createClient();
  const { data: myTransports } = await supabase
    .from("transport_requests")
    .select("case_id")
    .eq("claimed_by", profile.id);

  const myCaseIds = (myTransports ?? []).map((t) => t.case_id);

  let pendingFosterDecisions: any[] = [];
  if (myCaseIds.length > 0) {
    const { data: candidateCases } = await supabase
      .from("cases")
      .select("id, status, ai_condition, photo_url")
      .in("id", myCaseIds)
      .in("status", ["TREATED", "FUNDS_RELEASED"]);

    if (candidateCases && candidateCases.length > 0) {
      const candidateIds = candidateCases.map((c) => c.id);

      const { data: fosterRecords } = await supabase
        .from("foster_records")
        .select("case_id, status, caretaker_id")
        .in("case_id", candidateIds);

      pendingFosterDecisions = candidateCases.filter((c) => {
        const caseFosters = (fosterRecords ?? []).filter((f) => f.case_id === c.id);
        const hasActiveFoster = caseFosters.some((f) => f.status === "ACTIVE");
        const hasDeclined = caseFosters.some((f) => f.caretaker_id === profile.id && f.status === "REASSIGNED");
        return !hasActiveFoster && !hasDeclined;
      });
    }
  }

  const endingSoonFundraisers = fundraisers.filter((f) => {
    const pct = f.goal > 0 ? (f.raised / f.goal) * 100 : 0;
    return pct >= 75 && pct < 100;
  });
  const regularFundraisers = fundraisers.filter((f) => {
    const pct = f.goal > 0 ? (f.raised / f.goal) * 100 : 0;
    return pct < 75;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Welcome Hero */}
      <div className="flex items-center gap-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <TabbyMascot variant="wave" size="lg" />
        <div>
          <h1 className="font-heading text-xl font-bold text-[#2D3748] sm:text-2xl">
            Welcome back, {profile.display_name}!
          </h1>
          <p className="mt-1 text-sm text-[#2D3748]/60">
            Ready to help rescue some cats today?
          </p>
        </div>
      </div>

      {/* Needs Your Attention Section */}
      {(pendingFosterDecisions.length > 0 || transportCases.length > 0 || endingSoonFundraisers.length > 0) && (
        <div className="rounded-[20px] border border-red-100 bg-red-50/10 p-5 sm:p-6 shadow-[0_4px_20px_rgba(239,68,68,0.02)] space-y-4">
          <h2 className="font-heading text-base font-bold text-[#2D3748] flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            Needs Your Attention
          </h2>
          <div className="space-y-4">
            {/* Transporter Foster Decisions */}
            {pendingFosterDecisions.map((decisionCase) => (
              <div key={decisionCase.id} className="relative overflow-hidden rounded-[16px] border border-[#6C5CE7]/20 bg-white p-5 shadow-[0_2px_12px_rgba(108,92,231,0.04)]">
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                  {decisionCase.photo_url && (
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[12px] border border-[#A788FA]/20">
                      <img src={decisionCase.photo_url} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#6C5CE7] px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                      Priority Decision
                    </span>
                    <h3 className="font-heading text-base font-bold text-[#2D3748]">
                      Caretaker Decision: {decisionCase.ai_condition ?? "Rescue Cat"}
                    </h3>
                    <p className="text-xs text-[#2D3748]/60 leading-relaxed max-w-xl">
                      As the transporter, you have first priority to foster this cat during recovery. Please accept or decline.
                    </p>
                  </div>
                  <div className="w-full shrink-0 md:w-80">
                    <CaretakerVolunteerCard caseId={decisionCase.id} isTransporter={true} />
                  </div>
                </div>
              </div>
            ))}

            {/* Needs Transport */}
            {transportCases.length > 0 && (
              <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_2px_12px_rgba(108,92,231,0.04)] space-y-3">
                <h3 className="text-xs font-bold text-[#6C5CE7] flex items-center gap-1.5 uppercase tracking-wider">
                  <Truck size={14} className="text-[#6C5CE7]" /> Transport Needed
                </h3>
                <div className="space-y-2">
                  {transportCases.map((c) => (
                    <CasePreviewCard key={c.id} {...c} />
                  ))}
                </div>
              </div>
            )}

            {/* Funding Ending Soon */}
            {endingSoonFundraisers.length > 0 && (
              <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_2px_12px_rgba(108,92,231,0.04)] space-y-3">
                <h3 className="text-xs font-bold text-amber-600 flex items-center gap-1.5 uppercase tracking-wider">
                  <HandCoins size={14} className="text-amber-600" /> Funding Ending Soon (Almost Funded!)
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {endingSoonFundraisers.map((f) => (
                    <DonationProgressCard key={f.id} {...f} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={PawPrint} label="My Reports" value={stats.catsReported} />
        <StatCard icon={Truck} label="My Transports" value={stats.transportMissions} />
        <StatCard icon={HandCoins} label="My Donations" value={`฿${stats.totalDonated.toLocaleString()}`} />
        <StatCard icon={Heart} label="Foster Cases" value={stats.successfulAdoptions} />
      </div>

      {/* Quick Actions */}
      <DashboardSection title="Quick Actions">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickActionCard icon={Plus} label="Report Cat" href="/report" description="Found an injured cat?" />
          <QuickActionCard icon={Search} label="Browse Cases" href="/cases" description="View rescue feed" />
          <QuickActionCard icon={Heart} label="Adopt" href="/adopt" description="Give a cat a home" />
          <QuickActionCard icon={HandCoins} label="Donate" href="/donate" description="Fund a treatment" />
        </div>
      </DashboardSection>

      {/* Active Fundraisers */}
      {regularFundraisers.length > 0 && (
        <DashboardSection title="Active Fundraisers" viewAllHref="/donate">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {regularFundraisers.map((f) => (
              <DonationProgressCard key={f.id} {...f} />
            ))}
          </div>
        </DashboardSection>
      )}

      {/* Treatment Updates */}
      {treatments.length > 0 && (
        <DashboardSection title="Treatment Updates" viewAllHref="/cases?status=IN_TREATMENT">
          <div className="grid gap-3 sm:grid-cols-2">
            {treatments.map((t) => (
              <TreatmentUpdateCard key={t.id} {...t} />
            ))}
          </div>
        </DashboardSection>
      )}

      {/* Adoption Ready */}
      {adoptionCats.length > 0 && (
        <DashboardSection title="Ready for Adoption" viewAllHref="/adopt">
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {adoptionCats.map((a) => (
              <AdoptionPreviewCard key={a.id} {...a} />
            ))}
          </div>
        </DashboardSection>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <DashboardSection title="Recent Notifications" viewAllHref="/notifications">
          <NotificationPreviewCard notifications={notifications} />
        </DashboardSection>
      )}
    </div>
  );
}
