import { PawPrint, HandCoins, Heart, Users, Stethoscope, ShieldCheck, UserCheck, FileText, BarChart3, Settings } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { AdminStatCard } from "@/features/admin/components/AdminStatCard";
import { AnalyticsCard } from "@/features/admin/components/AnalyticsCard";
import { PlatformHealthCard } from "@/features/admin/components/PlatformHealthCard";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { QuickActionCard } from "@/features/dashboard/components/QuickActionCard";
import { adminStats, monthlyRescues, donationGrowth, recentUsers, platformHealth } from "@/features/admin/mock-data";

export const metadata = {
  title: "Admin — TabbyFund",
};

/**
 * /admin — Admin dashboard with stats, analytics, and quick actions.
 */
export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="flex items-center gap-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <TabbyMascot variant="celebrate" size="lg" />
        <div>
          <h1 className="font-heading text-xl font-bold text-[#2D3748]">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-[#2D3748]/60">Platform overview and management tools.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <AdminStatCard icon={PawPrint} label="Active Cases" value={adminStats.activeCases} color="text-[#6C5CE7] bg-[#6C5CE7]/10" />
        <AdminStatCard icon={HandCoins} label="Fundraisers" value={adminStats.activeFundraisers} color="text-amber-600 bg-amber-100" />
        <AdminStatCard icon={Heart} label="Total Donated" value={`฿${(adminStats.totalDonations / 1000).toFixed(1)}k`} color="text-emerald-600 bg-emerald-100" />
        <AdminStatCard icon={Heart} label="Rehomed" value={adminStats.catsRehomed} color="text-pink-600 bg-pink-100" />
        <AdminStatCard icon={Users} label="Volunteers" value={adminStats.activeVolunteers} color="text-blue-600 bg-blue-100" />
        <AdminStatCard icon={Stethoscope} label="Vets" value={adminStats.verifiedVets} color="text-teal-600 bg-teal-100" />
      </div>

      {/* Quick Actions */}
      <DashboardSection title="Quick Actions">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <QuickActionCard icon={UserCheck} label="Approve Vet" href="/admin/vets" description="Pending verifications" />
          <QuickActionCard icon={FileText} label="Review Reports" href="/admin/reports" description="Moderate rescue cases" />
          <QuickActionCard icon={BarChart3} label="Analytics" href="/admin/analytics" description="Platform insights" />
        </div>
      </DashboardSection>

      {/* Analytics preview (small) */}
      <DashboardSection title="Analytics Preview" viewAllHref="/admin/analytics">
        <div className="grid gap-4 sm:grid-cols-2">
          <AnalyticsCard title="Monthly Rescues" data={monthlyRescues} valueKey="count" formatType="count" />
          <AnalyticsCard title="Donation Growth" data={donationGrowth} valueKey="amount" formatType="currency" color="#10B981" />
        </div>
      </DashboardSection>

      {/* Recent Users */}
      <DashboardSection title="Recent Users" viewAllHref="/admin/vets">
        <div className="rounded-[14px] border border-[#A788FA]/15 bg-white shadow-[0_2px_12px_rgba(108,92,231,0.06)] divide-y divide-[#A788FA]/5">
          {recentUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6C5CE7]/10 text-xs font-semibold text-[#6C5CE7]">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-medium text-[#2D3748]">{u.name}</p>
                  <p className="text-[10px] text-[#2D3748]/50">{u.role} · {u.joinedAgo}</p>
                </div>
              </div>
              {u.pending && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                  Pending
                </span>
              )}
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* Platform Health */}
      <PlatformHealthCard {...platformHealth} />
    </div>
  );
}
