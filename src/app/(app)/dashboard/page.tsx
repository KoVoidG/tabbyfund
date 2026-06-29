import { getProfile } from "@/lib/supabase/auth-helpers";
import { redirect } from "next/navigation";
import { PawPrint, Truck, HandCoins, Heart, Plus, Search, Siren } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { QuickActionCard } from "@/features/dashboard/components/QuickActionCard";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { CasePreviewCard } from "@/features/dashboard/components/CasePreviewCard";
import { DonationProgressCard } from "@/features/dashboard/components/DonationProgressCard";
import { TreatmentUpdateCard } from "@/features/dashboard/components/TreatmentUpdateCard";
import { AdoptionPreviewCard } from "@/features/dashboard/components/AdoptionPreviewCard";
import { NotificationPreviewCard } from "@/features/dashboard/components/NotificationPreviewCard";
import {
  dashboardStats,
  casesNeedingTransport,
  activeFundraisers,
  treatmentUpdates,
  adoptionReady,
  recentNotifications,
} from "@/features/dashboard/mock-data";

export const metadata = {
  title: "Dashboard — TabbyFund",
};

export default async function DashboardPage() {
  const profile = await getProfile();
  if (!profile) redirect("/profile-error");

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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={PawPrint} label="Cats Reported" value={dashboardStats.catsReported} trend="+2 this week" />
        <StatCard icon={Truck} label="Transport Missions" value={dashboardStats.transportMissions} />
        <StatCard icon={HandCoins} label="Total Donated" value={`฿${dashboardStats.totalDonated.toLocaleString()}`} trend="+฿1,200 today" />
        <StatCard icon={Heart} label="Adoptions" value={dashboardStats.successfulAdoptions} />
      </div>

      {/* Quick Actions */}
      <DashboardSection title="Quick Actions">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickActionCard icon={Plus} label="Report Cat" href="/report" description="Found an injured cat?" />
          <QuickActionCard icon={Search} label="Browse Cases" href="/cases" description="View rescue feed" />
          <QuickActionCard icon={Heart} label="Adopt" href="/adopt" description="Give a cat a home" />
          <QuickActionCard icon={HandCoins} label="Donate" href="/cases" description="Fund a treatment" />
        </div>
      </DashboardSection>

      {/* Cases Needing Transport */}
      <DashboardSection title="Needs Transport" viewAllHref="/cases?status=AWAITING_TRANSPORT">
        <div className="space-y-2">
          {casesNeedingTransport.map((c) => (
            <CasePreviewCard key={c.id} {...c} />
          ))}
        </div>
      </DashboardSection>

      {/* Active Fundraisers */}
      <DashboardSection title="Active Fundraisers" viewAllHref="/cases?status=FUNDING_OPEN">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeFundraisers.map((f) => (
            <DonationProgressCard key={f.id} {...f} />
          ))}
        </div>
      </DashboardSection>

      {/* Treatment Updates */}
      <DashboardSection title="Treatment Updates" viewAllHref="/cases?status=IN_TREATMENT">
        <div className="grid gap-3 sm:grid-cols-2">
          {treatmentUpdates.map((t) => (
            <TreatmentUpdateCard key={t.id} {...t} />
          ))}
        </div>
      </DashboardSection>

      {/* Adoption Ready */}
      <DashboardSection title="Ready for Adoption" viewAllHref="/adopt">
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {adoptionReady.map((a) => (
            <AdoptionPreviewCard key={a.id} {...a} />
          ))}
        </div>
      </DashboardSection>

      {/* Notifications */}
      <DashboardSection title="Recent Notifications" viewAllHref="/notifications">
        <NotificationPreviewCard notifications={recentNotifications} />
      </DashboardSection>
    </div>
  );
}
