import { Stethoscope, Plus, FileText, Camera } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { VetDashboardStats } from "@/features/vet/components/VetDashboardStats";
import { VetCaseCard } from "@/features/vet/components/VetCaseCard";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { QuickActionCard } from "@/features/dashboard/components/QuickActionCard";
import { vetStats, vetCases } from "@/features/vet/mock-data";

export const metadata = {
  title: "Vet Dashboard — TabbyFund",
};

/**
 * /vet — Vet portal dashboard.
 * Shows cases by status, stats, and quick actions.
 */
export default function VetDashboardPage() {
  const waiting = vetCases.filter((c) => c.status === "waiting");
  const quoted = vetCases.filter((c) => c.status === "quoted");
  const inTreatment = vetCases.filter((c) => c.status === "in_treatment");
  const completed = vetCases.filter((c) => c.status === "completed");

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="flex items-center gap-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <TabbyMascot variant="happy" size="lg" />
        <div>
          <h1 className="font-heading text-xl font-bold text-[#2D3748]">
            Vet Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#2D3748]/60">
            Manage your patients. Every treatment saves a life.
          </p>
        </div>
      </div>

      {/* Stats */}
      <VetDashboardStats {...vetStats} />

      {/* Quick Actions */}
      <DashboardSection title="Quick Actions">
        <div className="grid grid-cols-3 gap-3">
          <QuickActionCard icon={Stethoscope} label="Review Case" href="/vet/cases" description="Examine new patients" />
          <QuickActionCard icon={FileText} label="Create Quote" href="/vet/cases" description="Submit treatment plan" />
          <QuickActionCard icon={Camera} label="Update Treatment" href="/vet/cases" description="Upload progress" />
        </div>
      </DashboardSection>

      {/* Cases Waiting */}
      {waiting.length > 0 && (
        <DashboardSection title="Awaiting Examination" viewAllHref="/vet/cases">
          <div className="space-y-2">
            {waiting.map((c) => <VetCaseCard key={c.id} vetCase={c} />)}
          </div>
        </DashboardSection>
      )}

      {/* Quoted */}
      {quoted.length > 0 && (
        <DashboardSection title="Quote Submitted — Funding">
          <div className="space-y-2">
            {quoted.map((c) => <VetCaseCard key={c.id} vetCase={c} />)}
          </div>
        </DashboardSection>
      )}

      {/* In Treatment */}
      {inTreatment.length > 0 && (
        <DashboardSection title="Active Treatments">
          <div className="space-y-2">
            {inTreatment.map((c) => <VetCaseCard key={c.id} vetCase={c} />)}
          </div>
        </DashboardSection>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <DashboardSection title="Completed">
          <div className="space-y-2">
            {completed.map((c) => <VetCaseCard key={c.id} vetCase={c} />)}
          </div>
        </DashboardSection>
      )}
    </div>
  );
}
