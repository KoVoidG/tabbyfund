import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { JourneyTracker } from "@/features/cases/components/JourneyTracker";
import { AIAnalysisCard } from "@/features/cases/components/AIAnalysisCard";
import { DiagnosisCard } from "@/features/vet/components/DiagnosisCard";
import { QuoteBuilder } from "@/features/vet/components/QuoteBuilder";
import { CompletionCard } from "@/features/vet/components/CompletionCard";
import { getCaseDetail } from "@/lib/cases";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { MapPin, Clock, User, CircleCheck } from "lucide-react";
import type { CaseStatus, Severity } from "@/features/cases/types";

interface VetCaseDetailPageProps {
  params: Promise<{ id: string }>;
}

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
  await requireRole("vet", { requireVerified: true });
  const { id } = await params;
  const c = await getCaseDetail(id);

  if (!c) notFound();

  const status = c.status as CaseStatus;
  const severity = (c.ai_severity ?? "MEDIUM") as Severity;
  const reportedAgo = formatDistanceToNow(new Date(c.created_at), { addSuffix: true });
  const location = `${c.fuzzed_lat.toFixed(3)}°N, ${c.fuzzed_lng.toFixed(3)}°E`;
  const reporterName = c.reporter?.display_name ?? "Anonymous";

  // Determine what vet actions to show
  const isWaiting = status === "AT_VET";
  const hasQuote = !!c.vet_quote;
  const isInTreatment = status === "IN_TREATMENT";
  const hasTreatment = !!c.treatment;
  const isQuotedOrFunding = ["QUOTED", "FUNDING_OPEN", "FUNDED"].includes(status);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Journey Tracker */}
      <JourneyTracker status={status} />

      {/* Hero — compact */}
      <div className="flex gap-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <div className="h-20 w-20 shrink-0 rounded-[12px] overflow-hidden bg-[#F7F7FB]">
          <img src={c.photo_url} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-base font-bold text-[#2D3748]">{c.ai_condition ?? "Unknown Condition"}</h1>
          <p className="mt-0.5 text-xs text-[#2D3748]/70 line-clamp-2">{c.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-[#2D3748]/50">
            <span className="flex items-center gap-0.5"><MapPin size={10} strokeWidth={1.5} />{location}</span>
            <span className="flex items-center gap-0.5"><Clock size={10} strokeWidth={1.5} />{reportedAgo}</span>
            <span className="flex items-center gap-0.5"><User size={10} strokeWidth={1.5} />{reporterName}</span>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      {c.ai_condition && (
        <AIAnalysisCard
          condition={c.ai_condition}
          confidence={c.ai_confidence ?? 0}
          reasoning={c.ai_reasoning ?? ""}
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
        <div className="rounded-[16px] border border-emerald-200 bg-emerald-50/50 p-5 shadow-[0_2px_12px_rgba(108,92,231,0.06)]">
          <div className="flex items-center gap-2 mb-2">
            <CircleCheck size={16} strokeWidth={1.5} className="text-emerald-600" />
            <h3 className="text-sm font-semibold text-emerald-700">Quote Submitted</h3>
          </div>
          <p className="text-xs text-[#2D3748]/60">
            Treatment quote: ฿{c.vet_quote!.quoted_amount.toLocaleString()}
          </p>
          {c.vet_quote!.notes && (
            <p className="mt-1 text-xs text-[#2D3748]/50">{c.vet_quote!.notes}</p>
          )}
          {isQuotedOrFunding && (
            <p className="mt-2 text-[11px] text-emerald-600">
              Community funding is in progress.
            </p>
          )}
        </div>
      )}

      {/* Treatment status — for cases in treatment */}
      {hasTreatment && (
        <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
          <h3 className="font-heading text-sm font-semibold text-[#2D3748] mb-2">Treatment Record</h3>
          <p className="text-sm text-[#2D3748]/80">{c.treatment!.treatment_summary}</p>
          <p className="mt-2 text-xs text-[#2D3748]/50">
            Outcome: <span className="font-medium">{c.treatment!.outcome}</span>
          </p>
        </div>
      )}

      {/* Completion — for cases in treatment (without confirmed completion) */}
      {isInTreatment && <CompletionCard caseId={c.id} />}
    </div>
  );
}
