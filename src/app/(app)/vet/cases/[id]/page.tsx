import { notFound } from "next/navigation";
import { JourneyTracker } from "@/features/cases/components/JourneyTracker";
import { AIAnalysisCard } from "@/features/cases/components/AIAnalysisCard";
import { DiagnosisCard } from "@/features/vet/components/DiagnosisCard";
import { QuoteBuilder } from "@/features/vet/components/QuoteBuilder";
import { TreatmentTimeline } from "@/features/vet/components/TreatmentTimeline";
import { CompletionCard } from "@/features/vet/components/CompletionCard";
import { vetCases, treatmentTimeline } from "@/features/vet/mock-data";
import { MapPin, Clock, User, CircleCheck } from "lucide-react";

// Map vet case status to CaseStatus for Journey Tracker
const statusMap: Record<string, string> = {
  waiting: "AT_VET",
  quoted: "FUNDING_OPEN",
  in_treatment: "IN_TREATMENT",
  recovering: "TREATED",
  completed: "FUNDS_RELEASED",
};

interface VetCaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: VetCaseDetailPageProps) {
  const { id } = await params;
  const c = vetCases.find((vc) => vc.id === id);
  return { title: c ? `${c.condition} — Vet | TabbyFund` : "Case Not Found" };
}

/**
 * /vet/cases/[id] — Vet-specific case detail.
 * Shows case info, AI analysis, diagnosis form, quote builder, treatment timeline.
 */
export default async function VetCaseDetailPage({ params }: VetCaseDetailPageProps) {
  const { id } = await params;
  const c = vetCases.find((vc) => vc.id === id);

  if (!c) notFound();

  const caseStatus = (statusMap[c.status] ?? "AT_VET") as "AT_VET" | "FUNDING_OPEN" | "IN_TREATMENT" | "TREATED" | "FUNDS_RELEASED";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Journey Tracker */}
      <JourneyTracker status={caseStatus} />

      {/* Hero — compact */}
      <div className="flex gap-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <div className="h-20 w-20 shrink-0 rounded-[12px] overflow-hidden bg-[#F7F7FB]">
          <img src={c.photo} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-base font-bold text-[#2D3748]">{c.condition}</h1>
          <p className="mt-0.5 text-xs text-[#2D3748]/70 line-clamp-2">{c.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-[#2D3748]/50">
            <span className="flex items-center gap-0.5"><MapPin size={10} strokeWidth={1.5} />{c.location}</span>
            <span className="flex items-center gap-0.5"><Clock size={10} strokeWidth={1.5} />{c.reportedAgo}</span>
            <span className="flex items-center gap-0.5"><User size={10} strokeWidth={1.5} />{c.reporter}</span>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <AIAnalysisCard
        condition={c.condition}
        confidence={c.aiConfidence}
        reasoning={c.aiReasoning}
        firstAid={c.firstAid}
        severity={c.severity}
      />

      {/* Diagnosis — for cases waiting */}
      {c.status === "waiting" && <DiagnosisCard />}

      {/* Quote Builder — only for cases that haven't been quoted yet */}
      {c.status === "waiting" && <QuoteBuilder />}

      {/* Submitted quote summary — for quoted cases (read-only) */}
      {c.status === "quoted" && (
        <div className="rounded-[16px] border border-emerald-200 bg-emerald-50/50 p-5 shadow-[0_2px_12px_rgba(108,92,231,0.06)]">
          <div className="flex items-center gap-2 mb-2">
            <CircleCheck size={16} strokeWidth={1.5} className="text-emerald-600" />
            <h3 className="text-sm font-semibold text-emerald-700">Quote Submitted</h3>
          </div>
          <p className="text-xs text-[#2D3748]/60">
            Your treatment quote has been submitted. Community funding is in progress.
          </p>
        </div>
      )}

      {/* Treatment Timeline — for cases in treatment */}
      {(c.status === "in_treatment" || c.status === "recovering") && (
        <TreatmentTimeline updates={treatmentTimeline} />
      )}

      {/* Completion — for in treatment cases */}
      {c.status === "in_treatment" && <CompletionCard />}
    </div>
  );
}
