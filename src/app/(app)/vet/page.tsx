import { Stethoscope, FileText, HeartPulse, ClipboardList, Clock, ShieldCheck, BadgeCheck } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { VetKpiCards } from "@/features/vet/components/VetKpiCards";
import { VetCaseCard } from "@/features/vet/components/VetCaseCard";
import { VetFinancialOverview } from "@/features/vet/components/VetFinancialOverview";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { getVetCases, getVetStats } from "@/lib/vet-cases";
import { requireRole } from "@/lib/supabase/auth-helpers";
import Link from "next/link";

export const metadata = {
  title: "Vet Dashboard — TabbyFund",
};

/**
 * /vet — Vet portal dashboard.
 * Shows real cases by status, stats, and quick actions.
 */
export default async function VetDashboardPage() {
  const profile = await requireRole("vet");

  // Unverified vet: show pending screen inline at /vet
  if (!profile.is_verified) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-12 text-center">
        <TabbyMascot variant="think" size="lg" className="mx-auto" />
        <div>
          <h1 className="text-2xl font-bold text-[#2D3748]">
            Verification Pending
          </h1>
          <p className="mt-2 text-sm text-[#2D3748]/60">
            Your vet verification is pending. Admin approval is required before you can access vet tools.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-medium text-amber-700">
          <Clock size={14} strokeWidth={1.5} />
          Awaiting Admin Verification
        </div>
        <div className="rounded-[12px] bg-[#6C5CE7]/5 p-4">
          <p className="flex items-start gap-2 text-[11px] text-[#6C5CE7] text-left">
            <ShieldCheck size={14} strokeWidth={1.5} className="mt-0.5 shrink-0" />
            Once an admin approves your account, you will have access to the vet dashboard, case management, and treatment tools.
          </p>
        </div>
      </div>
    );
  }

  const cases = await getVetCases(profile.id);
  const stats = await getVetStats(profile.id);

  const waiting = cases.filter((c) => c.status === "AT_VET");
  const quoted = cases.filter((c) => ["QUOTED", "FUNDING_OPEN", "FUNDED"].includes(c.status));
  const inTreatment = cases.filter((c) => c.status === "IN_TREATMENT");
  const completed = cases.filter((c) => c.treatmentCompleted);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = profile.display_name.toLowerCase().startsWith("dr.") ? profile.display_name : `Dr. ${profile.display_name}`;

  const quickActions = [
    {
      icon: Stethoscope,
      label: "Review New Cases",
      description: "Examine patients waiting for triage",
      href: "/vet/cases?status=waiting",
      accent: "bg-orange-50 border-orange-200/60 text-orange-600",
    },
    {
      icon: FileText,
      label: "Create Quote",
      description: "Submit a treatment cost estimate",
      href: "/vet/cases?status=quote-needed",
      accent: "bg-[#6C5CE7]/8 border-[#A788FA]/20 text-[#6C5CE7]",
    },
    {
      icon: HeartPulse,
      label: "Update Treatment",
      description: "Complete or update active cases",
      href: "/vet/cases?status=in-treatment",
      accent: "bg-blue-50 border-blue-200/60 text-blue-600",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      {/* ── Hero / Greeting ── */}
      <div className="relative overflow-hidden rounded-[20px] border border-[#A788FA]/15 bg-white shadow-[0_4px_24px_rgba(108,92,231,0.08)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/[0.03] via-transparent to-[#FFF3E0]/15 pointer-events-none" />
        <div className="relative p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <TabbyMascot variant="happy" size="lg" className="shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-lg font-bold text-[#2D3748]">
                  {greeting}, {displayName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  <BadgeCheck size={10} strokeWidth={2} /> Verified Vet
                </span>
              </div>
              <p className="text-xs text-[#2D3748]/55 mb-0 sm:mb-3">Here&apos;s your patient overview for today.</p>

              {/* Desktop-only badges */}
              <div className="hidden sm:flex flex-wrap gap-2">
                {stats.waiting > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200/60 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
                    <Clock size={11} strokeWidth={2} />
                    {stats.waiting} waiting
                  </span>
                )}
                {stats.inTreatment > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/60 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                    <HeartPulse size={11} strokeWidth={2} />
                    {stats.inTreatment} in treatment
                  </span>
                )}
                {stats.waiting === 0 && stats.inTreatment === 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    All clear — no urgent cases
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6C5CE7]/8 border border-[#A788FA]/20 px-2.5 py-1 text-[11px] font-semibold text-[#6C5CE7]">
                  ฿{stats.pendingEscrow.toLocaleString()} in escrow
                </span>
              </div>
            </div>
          </div>

          {/* Mobile-only badges: renders below mascot + greeting block */}
          <div className="flex sm:hidden flex-wrap gap-2 mt-4 justify-start">
            {stats.waiting > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200/60 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
                <Clock size={11} strokeWidth={2} />
                {stats.waiting} waiting
              </span>
            )}
            {stats.inTreatment > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/60 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                <HeartPulse size={11} strokeWidth={2} />
                {stats.inTreatment} in treatment
              </span>
            )}
            {stats.waiting === 0 && stats.inTreatment === 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                All clear — no urgent cases
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6C5CE7]/8 border border-[#A788FA]/20 px-2.5 py-1 text-[11px] font-semibold text-[#6C5CE7]">
              ฿{stats.pendingEscrow.toLocaleString()} in escrow
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI Cards (clickable → scroll to section) ── */}
      <VetKpiCards
        waiting={stats.waiting}
        inTreatment={stats.inTreatment}
        completed={stats.completed}
        releasedEarnings={stats.releasedEarnings}
      />

      {/* ── Quick Actions ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#2D3748]/60 uppercase tracking-wider px-0.5">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center gap-3 rounded-[14px] border border-[#A788FA]/15 bg-white px-4 py-3.5 shadow-[0_2px_10px_rgba(108,92,231,0.05)] transition-all hover:shadow-[0_6px_20px_rgba(108,92,231,0.12)] hover:border-[#6C5CE7]/20 active:scale-[0.98]"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${action.accent}`}>
                  <Icon size={17} strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#2D3748] group-hover:text-[#6C5CE7] transition-colors">{action.label}</p>
                  <p className="text-[10px] text-[#2D3748]/45 truncate mt-0.5">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Financial Overview ── */}
      <VetFinancialOverview pendingEscrow={stats.pendingEscrow} releasedEarnings={stats.releasedEarnings} />

      {/* ── Patients Waiting ── */}
      <div id="patients-waiting" className="scroll-mt-32 sm:scroll-mt-20 space-y-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${waiting.length > 0 ? "bg-orange-500 animate-pulse" : "bg-[#A788FA]/40"}`} />
          <h2 className="text-sm font-bold text-[#2D3748]">
            Patients Waiting <span className="text-[#2D3748]/40 font-normal">({waiting.length})</span>
          </h2>
        </div>
        {waiting.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-6 text-center space-y-2">
            <TabbyMascot variant="sleep" size="md" className="opacity-60" />
            <p className="text-sm font-bold text-[#6C5CE7]">All clear!</p>
            <p className="text-xs font-medium text-[#2D3748]/70">No cats are currently waiting for care.</p>
            <p className="text-[10px] text-[#2D3748]/40">Patients appear here once transported to your clinic.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {waiting.map((c) => <VetCaseCard key={c.id} vetCase={c} />)}
          </div>
        )}
      </div>

      {/* ── Quotes & Active Campaigns ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${quoted.length > 0 ? "bg-[#6C5CE7] animate-pulse" : "bg-[#A788FA]/40"}`} />
          <h2 className="text-sm font-bold text-[#2D3748]">
            Quotes &amp; Active Campaigns <span className="text-[#2D3748]/40 font-normal">({quoted.length})</span>
          </h2>
        </div>
        {quoted.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-6 text-center space-y-2">
            <TabbyMascot variant="think" size="md" className="opacity-60" />
            <p className="text-sm font-bold text-[#6C5CE7]">All good!</p>
            <p className="text-xs font-medium text-[#2D3748]/70">No active fundraising campaigns right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quoted.map((c) => <VetCaseCard key={c.id} vetCase={c} />)}
          </div>
        )}
      </div>

      {/* ── In Treatment ── */}
      <div id="in-treatment" className="scroll-mt-32 sm:scroll-mt-20 space-y-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${inTreatment.length > 0 ? "bg-blue-500 animate-pulse" : "bg-[#A788FA]/40"}`} />
          <h2 className="text-sm font-bold text-[#2D3748]">
            In Treatment <span className="text-[#2D3748]/40 font-normal">({inTreatment.length})</span>
          </h2>
        </div>
        {inTreatment.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-6 text-center space-y-2">
            <TabbyMascot variant="sleep" size="md" className="opacity-60" />
            <p className="text-sm font-bold text-[#6C5CE7]">All good!</p>
            <p className="text-xs font-medium text-[#2D3748]/70">No cats are currently undergoing active treatment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inTreatment.map((c) => <VetCaseCard key={c.id} vetCase={c} />)}
          </div>
        )}
      </div>

      {/* ── Completed Treatments ── */}
      <div id="completed-treatments" className="scroll-mt-32 sm:scroll-mt-20 space-y-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${completed.length > 0 ? "bg-emerald-500 animate-pulse" : "bg-[#A788FA]/40"}`} />
          <h2 className="text-sm font-bold text-[#2D3748]">
            Completed Treatments <span className="text-[#2D3748]/40 font-normal">({completed.length})</span>
          </h2>
        </div>
        {completed.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-6 text-center space-y-2">
            <TabbyMascot variant="happy" size="md" className="opacity-60" />
            <p className="text-xs font-semibold text-[#2D3748]">No completed treatments yet.</p>
            <p className="text-[10px] text-[#2D3748]/40">Treated and recovered patient cases will be archived here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completed.map((c) => <VetCaseCard key={c.id} vetCase={c} />)}
          </div>
        )}
      </div>

    </div>
  );
}
