import { PawPrint, HandCoins, Heart, Users, Stethoscope, UserCheck, FileText, BarChart3 } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { AdminStatCard } from "@/features/admin/components/AdminStatCard";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { QuickActionCard } from "@/features/dashboard/components/QuickActionCard";
import { getAdminStats, getPendingVets } from "@/lib/admin";

export const metadata = {
  title: "Admin — TabbyFund",
};

/**
 * /admin — Admin dashboard with real stats from Supabase.
 */
export default async function AdminPage() {
  const stats = await getAdminStats();
  const pendingVets = await getPendingVets();

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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <AdminStatCard icon={PawPrint} label="Active Cases" value={stats.activeCases} color="text-[#6C5CE7] bg-[#6C5CE7]/10" />
        <AdminStatCard icon={HandCoins} label="Fundraisers Open" value={stats.activeFundraisers} color="text-amber-600 bg-amber-100" />
        <AdminStatCard icon={Heart} label="Total Donated" value={`฿${(stats.totalDonations / 1000).toFixed(1)}k`} color="text-emerald-600 bg-emerald-100" />
        <AdminStatCard icon={Heart} label="Cats Adopted" value={stats.catsRehomed} color="text-pink-600 bg-pink-100" />
        <AdminStatCard icon={Users} label="Community Users" value={stats.communityUsers} color="text-blue-600 bg-blue-100" />
        <AdminStatCard icon={Stethoscope} label="Vets (Verified / Pending)" value={`${stats.verifiedVets} / ${stats.pendingVets}`} color="text-teal-600 bg-teal-100" />
      </div>

      {/* Quick Actions */}
      <DashboardSection title="Quick Actions">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <QuickActionCard icon={UserCheck} label="Approve Vet" href="/admin/vets" description={`${pendingVets.length} pending`} />
          <QuickActionCard icon={FileText} label="Review Reports" href="/admin/reports" description="Moderate rescue cases" />
          <QuickActionCard icon={BarChart3} label="Analytics" href="/admin/analytics" description="Platform insights" />
        </div>
      </DashboardSection>

      {/* Pending Vets */}
      {pendingVets.length > 0 && (
        <DashboardSection title="Pending Vet Verifications" viewAllHref="/admin/vets">
          <div className="rounded-[14px] border border-amber-200 bg-amber-50/50 divide-y divide-amber-100">
            {pendingVets.slice(0, 5).map((v) => (
              <div key={v.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700">
                    {v.display_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#2D3748]">{v.display_name}</p>
                    <p className="text-[10px] text-[#2D3748]/50">vet · pending</p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </DashboardSection>
      )}
    </div>
  );
}
