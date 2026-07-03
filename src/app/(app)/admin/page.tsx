import Link from "next/link";
import {
  PawPrint,
  HandCoins,
  Heart,
  Users,
  Stethoscope,
  ClipboardList,
  TriangleAlert,
  BarChart3,
  History,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Plus,
  Home,
  AlertCircle,
} from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { AdminStatCard } from "@/features/admin/components/AdminStatCard";
import { getAdminStats, getPlatformActivities } from "@/lib/admin";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Admin Dashboard — TabbyAdmin",
};

export default async function AdminPage() {
  const stats = await getAdminStats();
  const recentActivities = await getPlatformActivities();

  // Active items for Needs Attention
  const attentionItems = [
    {
      id: "pending-vets",
      count: stats.pendingVets,
      label: `${stats.pendingVets} Veterinarian${stats.pendingVets > 1 ? "s" : ""} awaiting verification`,
      description: "Review credentials and clinic locations to grant access.",
      href: "/admin/vets",
      icon: Stethoscope,
      color: "border-amber-200 bg-amber-50/40 text-amber-700 hover:bg-amber-50 hover:border-amber-300",
      iconColor: "text-amber-600 bg-amber-100",
    },
    {
      id: "reported-cases",
      count: stats.reportedAwaitingModeration,
      label: `${stats.reportedAwaitingModeration} Rescue Case${stats.reportedAwaitingModeration > 1 ? "s" : ""} awaiting moderation`,
      description: "Moderate reported incidents and review Gemini triage confidence.",
      href: "/admin/moderation",
      icon: TriangleAlert,
      color: "border-red-200 bg-red-50/40 text-red-700 hover:bg-red-50 hover:border-red-300",
      iconColor: "text-red-600 bg-red-100",
    },
    {
      id: "needing-foster",
      count: stats.casesNeedingFoster,
      label: `${stats.casesNeedingFoster} Cat${stats.casesNeedingFoster > 1 ? "s" : ""} ready for foster placement`,
      description: "Treatment is complete. Coordinate with fosters or shelters.",
      href: "/admin/cases?status=foster_needed",
      icon: PawPrint,
      color: "border-purple-200 bg-purple-50/40 text-purple-700 hover:bg-purple-50 hover:border-purple-300",
      iconColor: "text-purple-600 bg-purple-100",
    },
    {
      id: "ongoing-treatment",
      count: stats.fundedOngoingTreatment,
      label: `${stats.fundedOngoingTreatment} Fundraiser${stats.fundedOngoingTreatment > 1 ? "s" : ""} funded (treatment ongoing)`,
      description: "Monitor veterinarian updates and medical outcome confirmations.",
      href: "/admin/cases?status=IN_TREATMENT",
      icon: HandCoins,
      color: "border-emerald-200 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300",
      iconColor: "text-emerald-600 bg-emerald-100",
    },
  ].filter(item => item.count > 0);

  function getActivityIcon(type: string) {
    switch (type) {
      case "rescue_reported":
        return <Plus className="text-blue-600" size={12} />;
      case "vet_approved":
        return <Stethoscope className="text-teal-600" size={12} />;
      case "quote_created":
        return <ClipboardList className="text-indigo-600" size={12} />;
      case "donation_received":
        return <HandCoins className="text-emerald-600" size={12} />;
      case "funding_completed":
        return <SparkleIcon className="text-amber-500" />;
      case "treatment_completed":
        return <Heart className="text-pink-600" size={12} />;
      case "foster_assigned":
        return <Home className="text-purple-600" size={12} />;
      case "adoption_completed":
        return <Heart className="text-red-600" size={12} />;
      default:
        return <AlertCircle className="text-slate-600" size={12} />;
    }
  }

  function SparkleIcon(props: any) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Hero */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[20px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C5CE7]/5 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <TabbyMascot variant="celebrate" size="lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold text-[#2D3748]">Admin Operations Center</h1>
              <span className="flex items-center gap-1 rounded-full bg-[#6C5CE7]/10 px-2 py-0.5 text-[10px] font-semibold text-[#6C5CE7]">
                <ShieldCheck size={11} /> Admin
              </span>
            </div>
            <p className="mt-1 text-sm text-[#2D3748]/60">Platform-wide overview, moderation queues, and operational metrics.</p>
          </div>
        </div>
      </div>

      {/* Needs Attention */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748]">
          <AlertTriangle size={16} className="text-amber-500" />
          Action Items & Alerts
        </h2>
        {attentionItems.length === 0 ? (
          <div className="rounded-[16px] border border-emerald-100 bg-emerald-50/20 p-5 text-center flex flex-col items-center gap-2">
            <TabbyMascot variant="wave" size="sm" />
            <div>
              <p className="text-sm font-medium text-emerald-700">All quiet! No pending actions require attention.</p>
              <p className="text-xs text-emerald-600/70 mt-0.5">Platform is healthy and up-to-date.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {attentionItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-start gap-3.5 rounded-[16px] border p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] ${item.color}`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm ${item.iconColor}`}>
                  <item.icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold leading-tight">{item.label}</p>
                  <p className="mt-1 text-[11px] opacity-85 leading-normal">{item.description}</p>
                </div>
                <ArrowRight size={14} className="shrink-0 self-center opacity-60" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Platform Health KPI cards */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[#2D3748]">Platform Health & KPIs</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <AdminStatCard icon={PawPrint} label="Active Cases" value={stats.activeCases} color="text-[#6C5CE7] bg-[#6C5CE7]/8" href="/admin/cases?status=active" />
          <AdminStatCard icon={HandCoins} label="Open Fundraisers" value={stats.activeFundraisers} color="text-amber-600 bg-amber-50" href="/admin/cases?status=FUNDING_OPEN" />
          <AdminStatCard icon={Heart} label="Total Donated" value={`฿${(stats.totalDonations / 1000).toFixed(1)}k`} color="text-emerald-600 bg-emerald-50" href="/admin/activity?type=donations" />
          <AdminStatCard icon={Heart} label="Cats Adopted" value={stats.catsRehomed} color="text-pink-600 bg-pink-50" href="/admin/cases?status=ADOPTED" />
          <AdminStatCard icon={Users} label="Community Users" value={stats.communityUsers} color="text-blue-600 bg-blue-50" href="/admin/users" />
          <AdminStatCard icon={Stethoscope} label="Verified Vets" value={`${stats.verifiedVets}`} color="text-teal-600 bg-teal-50" href="/admin/vets" />
          <AdminStatCard icon={PawPrint} label="Ready for Foster" value={stats.casesNeedingFoster} color="text-purple-600 bg-purple-50" href="/admin/cases?status=foster_needed" />
          <AdminStatCard icon={FileCheck2} label="Closed Cases" value={stats.closedCases} color="text-slate-600 bg-slate-100" href="/admin/cases?status=closed" />
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[#2D3748]">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
          {[
            { href: "/admin/cases", label: "Manage Cases", icon: ClipboardList, desc: "Rescue database" },
            { href: "/admin/moderation", label: "Case Moderation", icon: TriangleAlert, desc: "Rescue reports" },
            { href: "/admin/vets", label: "Approve Vets", icon: Stethoscope, desc: `${stats.pendingVets} pending` },
            { href: "/admin/users", label: "Manage Users", icon: Users, desc: "Profiles & activities" },
            { href: "/admin/analytics", label: "Analytics", icon: BarChart3, desc: "Platform metrics" },
            { href: "/admin/activity", label: "Audit Timeline", icon: History, desc: "System audit log" },
          ].map((act) => (
            <Link
              key={act.label}
              href={act.href}
              className="flex flex-col items-center justify-between text-center rounded-[16px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.04)] hover:border-[#6C5CE7]/30 hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C5CE7]/6 text-[#6C5CE7] mb-2.5 group-hover:bg-[#6C5CE7] group-hover:text-white transition-colors">
                <act.icon size={18} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2D3748]">{act.label}</p>
                <p className="text-[9px] text-[#2D3748]/40 mt-0.5">{act.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity Chronological Feed */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#2D3748] flex items-center gap-2">
            <History size={16} className="text-[#6C5CE7]" />
            Recent Activity Log
          </h2>
          <Link href="/admin/activity" className="text-[11px] font-medium text-[#6C5CE7] hover:underline flex items-center gap-0.5">
            Full Audit Log <ArrowRight size={10} />
          </Link>
        </div>
        <div className="rounded-[20px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.06)]">
          {recentActivities.length === 0 ? (
            <p className="text-xs text-[#2D3748]/40 text-center py-4">No recent platform activities recorded.</p>
          ) : (
            <div className="relative border-l-2 border-[#6C5CE7]/10 ml-4 pl-7 space-y-5">
              {recentActivities.slice(0, 6).map((activity) => (
                <div key={activity.id} className="relative group">
                  {/* Timeline Dot with Lucide Icon */}
                  <span className="absolute -left-[38px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-[#6C5CE7] shadow-sm">
                    {getActivityIcon(activity.type)}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-[#2D3748]">{activity.title}</p>
                      <span className="text-[9px] text-[#2D3748]/40 flex items-center gap-0.5">
                        <Calendar size={10} />
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#2D3748]/60 leading-normal">{activity.description}</p>
                    {activity.caseId && (
                      <Link
                        href={`/cases/${activity.caseId}`}
                        className="mt-1 inline-flex items-center gap-0.5 text-[10px] text-[#6C5CE7] hover:underline font-semibold"
                      >
                        Inspect Case <ArrowRight size={8} />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
