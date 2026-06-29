import { notFound } from "next/navigation";
import { JourneyTracker } from "@/features/cases/components/JourneyTracker";
import { CaseHero } from "@/features/cases/components/CaseHero";
import { AIAnalysisCard } from "@/features/cases/components/AIAnalysisCard";
import { AIRecommendationCard } from "@/features/cases/components/AIRecommendationCard";
import { TransportCard } from "@/features/cases/components/TransportCard";
import { VetQuoteCard } from "@/features/cases/components/VetQuoteCard";
import { FundingCard } from "@/features/cases/components/FundingCard";
import { TreatmentCard } from "@/features/cases/components/TreatmentCard";
import { FosterCard } from "@/features/cases/components/FosterCard";
import { AdoptionStatusCard } from "@/features/cases/components/AdoptionStatusCard";
import { RescueTimeline } from "@/features/cases/components/RescueTimeline";
import { CaseStickyNav } from "@/features/cases/components/CaseStickyNav";
import { FadeIn } from "@/features/cases/components/FadeIn";
import { mockCases } from "@/features/cases/mock-data";

interface CaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CaseDetailPageProps) {
  const { id } = await params;
  const c = mockCases.find((mc) => mc.id === id);
  return { title: c ? `Case — ${c.condition} | TabbyFund` : "Case Not Found" };
}

/**
 * /cases/[id] — Premium case detail page.
 *
 * Layout:
 * - Desktop: centered content (max-w-3xl within max-w-5xl shell) + floating sticky aside
 * - Mobile: hero first → sticky journey tracker → sections
 */
export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = await params;
  const c = mockCases.find((mc) => mc.id === id);

  if (!c) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      {/* Desktop floating aside (hidden on mobile, Journey Tracker handles nav) */}
      <CaseStickyNav />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* MOBILE: Hero first for emotional entry */}
        <div className="sm:hidden">
          <FadeIn>
            <div id="section-rescue" className="scroll-mt-32">
              <CaseHero
                photo={c.photo}
                description={c.description}
                status={c.status}
                severity={c.severity}
                condition={c.condition}
                location={c.location}
                reporter={c.reporter}
                reportedAgo={c.reportedAgo}
              />
            </div>
          </FadeIn>
        </div>

        {/* Journey Tracker — sticky on mobile, static on desktop */}
        <FadeIn>
          <JourneyTracker status={c.status} sticky />
        </FadeIn>

        {/* DESKTOP: Hero after tracker */}
        <div className="hidden sm:block">
          <FadeIn delay={50}>
            <div id="section-rescue" className="scroll-mt-20">
              <CaseHero
                photo={c.photo}
                description={c.description}
                status={c.status}
                severity={c.severity}
                condition={c.condition}
                location={c.location}
                reporter={c.reporter}
                reportedAgo={c.reportedAgo}
              />
            </div>
          </FadeIn>
        </div>

        {/* AI Analysis + Recommendation */}
        <FadeIn delay={100}>
          <div id="section-ai" className="scroll-mt-32 sm:scroll-mt-20 space-y-4">
            <AIAnalysisCard
              condition={c.condition}
              confidence={c.confidence}
              reasoning={c.reasoning}
              firstAid={c.firstAid}
              severity={c.severity}
            />
            <AIRecommendationCard severity={c.severity} condition={c.condition} />
          </div>
        </FadeIn>

        {/* Transport */}
        {c.transportStatus && (
          <FadeIn delay={150}>
            <div id="section-transport" className="scroll-mt-32 sm:scroll-mt-20">
              <TransportCard status={c.transportStatus} transporter={c.transporter} />
            </div>
          </FadeIn>
        )}

        {/* Vet Quote */}
        {c.vet && c.quotedAmount && c.quoteNotes && (
          <FadeIn delay={200}>
            <div id="section-vet" className="scroll-mt-32 sm:scroll-mt-20">
              <VetQuoteCard vet={c.vet} amount={c.quotedAmount} notes={c.quoteNotes} />
            </div>
          </FadeIn>
        )}

        {/* Funding */}
        {c.goal && c.raised !== undefined && c.donors !== undefined && (
          <FadeIn delay={250}>
            <div id="section-funding" className="scroll-mt-32 sm:scroll-mt-20">
              <FundingCard goal={c.goal} raised={c.raised} donors={c.donors} />
            </div>
          </FadeIn>
        )}

        {/* Treatment */}
        {c.treatmentSummary && c.outcome && c.vet && (
          <FadeIn delay={300}>
            <div id="section-recovery" className="scroll-mt-32 sm:scroll-mt-20">
              <TreatmentCard vet={c.vet} summary={c.treatmentSummary} outcome={c.outcome} />
            </div>
          </FadeIn>
        )}

        {/* Foster */}
        {c.fosterCaretaker && c.fosterDays && (
          <FadeIn delay={350}>
            <div id="section-foster" className="scroll-mt-32 sm:scroll-mt-20">
              <FosterCard caretaker={c.fosterCaretaker} days={c.fosterDays} />
            </div>
          </FadeIn>
        )}

        {/* Adoption */}
        {c.adoptionStatus && (
          <FadeIn delay={400}>
            <div id="section-forever-home" className="scroll-mt-32 sm:scroll-mt-20">
              <AdoptionStatusCard
                status={c.adoptionStatus}
                personality={c.personality}
                medicalNotes={c.medicalNotes}
              />
            </div>
          </FadeIn>
        )}

        {/* Rescue Timeline */}
        <FadeIn delay={450}>
          <RescueTimeline status={c.status} />
        </FadeIn>
      </div>
    </div>
  );
}
