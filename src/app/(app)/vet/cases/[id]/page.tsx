import { notFound, redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { JourneyTracker } from "@/features/cases/components/JourneyTracker";
import { AIAnalysisCard } from "@/features/cases/components/AIAnalysisCard";
import { DiagnosisCard } from "@/features/vet/components/DiagnosisCard";
import { QuoteBuilder } from "@/features/vet/components/QuoteBuilder";
import { CompletionCard } from "@/features/vet/components/CompletionCard";
import { StartTreatmentCard } from "@/features/vet/components/StartTreatmentCard";
import { getCaseDetail, parseAIReasoning } from "@/lib/cases";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { MapPin, Clock, User, CircleCheck, CircleAlert, TriangleAlert, Info, Banknote } from "lucide-react";
import type { CaseStatus, Severity } from "@/features/cases/types";

interface VetCaseDetailPageProps {
  params: Promise<{ id: string }>;
}

const severityConfig = {
  CRITICAL: { bg: "bg-red-100 border-red-200/50 text-red-800", icon: CircleAlert },
  HIGH: { bg: "bg-orange-100 border-orange-200/50 text-orange-800", icon: TriangleAlert },
  MEDIUM: { bg: "bg-amber-100 border-amber-200/50 text-amber-800", icon: Info },
  LOW: { bg: "bg-emerald-100 border-emerald-200/50 text-emerald-800", icon: CircleCheck },
};

export async function generateMetadata({ params }: VetCaseDetailPageProps) {
  const { id } = await params;
  const c = await getCaseDetail(id);
  return { title: c ? `${c.ai_condition ?? "Case"} — Vet | TabbyFund` : "Case Not Found" };
}

/**
 * /vet/cases/[id] — Vet-specific case detail.
 * Shows case info, AI analysis, diagnosis form, quote builder, treatment tools.
 */
export default async function VetCaseDetailPage({ params }: VetCaseDetailPageProps) {
  const profile = await requireRole("vet", { requireVerified: true });
  const { id } = await params;
  const c = await getCaseDetail(id);

  if (!c) notFound();

  // Enforce server-side check: non-assigned vets are redirected to the public detail page
  if (c.assigned_vet_id !== profile.id) {
    redirect(`/cases/${id}`);
  }

  const status = c.status as CaseStatus;
  const severity = (c.ai_severity ?? "MEDIUM") as Severity;
  const reportedAgo = formatDistanceToNow(new Date(c.created_at), { addSuffix: true });
  const location = `${c.fuzzed_lat.toFixed(3)}°N, ${c.fuzzed_lng.toFixed(3)}°E`;
  const reporterName = c.reporter?.display_name ?? "Anonymous";

  const sev = severityConfig[severity];
  const SevIcon = sev.icon;

  // Determine what vet actions to show
  const isWaiting = status === "AT_VET";
  const hasQuote = !!c.vet_quote;
  const isInTreatment = status === "IN_TREATMENT";
  const hasTreatment = !!c.treatment;
  const isQuotedOrFunding = ["QUOTED", "FUNDING_OPEN", "FUNDED"].includes(status);

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Journey Tracker */}
      <JourneyTracker status={status} />

      {/* Hero — photo + condition + meta */}
      <div className="flex gap-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        {/* Photo with severity badge */}
        <div className="relative h-24 w-24 shrink-0 rounded-[12px] overflow-hidden bg-[#F7F7FB]">
          <img src={c.photo_url} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-1.5 left-1.5">
            <span className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-bold backdrop-blur-sm ${sev.bg}`}>
              <SevIcon size={8} strokeWidth={2} /> {severity}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-[#2D3748] leading-tight">{c.ai_condition ?? "Unknown Condition"}</h1>
          <p className="mt-1 text-xs text-[#2D3748]/65 line-clamp-2 leading-relaxed">{c.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-[#2D3748]/50">
            <span className="flex items-center gap-1"><MapPin size={10} strokeWidth={1.5} />{location}</span>
            <span className="flex items-center gap-1"><Clock size={10} strokeWidth={1.5} />{reportedAgo}</span>
            <span className="flex items-center gap-1"><User size={10} strokeWidth={1.5} />{reporterName}</span>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      {c.ai_condition && (
        <AIAnalysisCard
          condition={c.ai_condition}
          confidence={c.ai_confidence ?? 0}
          reasoning={parseAIReasoning(c.ai_reasoning).reasoning}
          firstAid={c.ai_first_aid ?? []}
          severity={severity}
        />
      )}

      {/* Diagnosis — for cases waiting (AT_VET without a quote yet) */}
      {isWaiting && !hasQuote && <DiagnosisCard />}

      {/* Quote Builder — only for cases that haven't been quoted yet */}
      {isWaiting && !hasQuote && <QuoteBuilder caseId={c.id} />}

      {/* Submitted quote summary — for quoted/funding cases (read-only) */}
      {hasQuote && !isInTreatment && (
        <div className="rounded-[16px] border-2 border-[#6C5CE7]/20 bg-[#6C5CE7]/[0.03] p-5 shadow-[0_2px_12px_rgba(108,92,231,0.06)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#6C5CE7]/10">
              <CircleCheck size={16} strokeWidth={1.5} className="text-[#6C5CE7]" />
            </div>
            <h3 className="text-sm font-bold text-[#6C5CE7]">Quote Submitted</h3>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#2D3748]">
            <Banknote size={14} strokeWidth={1.5} className="text-[#6C5CE7]" />
            ฿{c.vet_quote!.quoted_amount.toLocaleString()} treatment cost
          </div>
          {c.vet_quote!.notes && (
            <p className="mt-2 text-xs text-[#2D3748]/55 leading-relaxed">{c.vet_quote!.notes}</p>
          )}
          {isQuotedOrFunding && (
            <p className="mt-3 text-[11px] font-semibold text-[#6C5CE7] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6C5CE7] animate-pulse inline-block" />
              Community funding is in progress
            </p>
          )}
        </div>
      )}

      {/* Start Treatment Form */}
      {hasQuote && !isInTreatment && !hasTreatment && (
        <StartTreatmentCard caseId={c.id} />
      )}

      {/* Treatment Record */}
      {hasTreatment && (
        <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100">
              <CircleCheck size={14} strokeWidth={1.5} className="text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-[#2D3748]">Treatment Record</h3>
          </div>
          <p className="text-sm text-[#2D3748]/80 leading-relaxed">{c.treatment!.treatment_summary}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#2D3748]/40 uppercase tracking-wider">Outcome</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              c.treatment!.outcome === "RECOVERED"
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200/50"
                : "bg-gray-100 text-gray-700 border border-gray-200/50"
            }`}>
              {c.treatment!.outcome}
            </span>
          </div>
        </div>
      )}

      {/* Completion Card — for cases in treatment (without confirmed completion) */}
      {isInTreatment && <CompletionCard caseId={c.id} />}

    </div>
  );
}
