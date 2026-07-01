import { notFound } from "next/navigation";
import { formatDistanceToNow, differenceInDays } from "date-fns";
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
import { CaretakerVolunteerCard } from "@/features/cases/components/CaretakerVolunteerCard";
import { RescueTimeline } from "@/features/cases/components/RescueTimeline";
import { CaseStickyNav } from "@/features/cases/components/CaseStickyNav";
import { FadeIn } from "@/features/cases/components/FadeIn";
import { getCaseDetail } from "@/lib/cases";
import { getUser } from "@/lib/supabase/auth-helpers";
import { getVerifiedVetClinics } from "@/lib/vet-clinics";
import type { CaseStatus, Severity } from "@/features/cases/types";

interface CaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CaseDetailPageProps) {
  const { id } = await params;
  const c = await getCaseDetail(id);
  return {
    title: c ? `Case — ${c.ai_condition ?? "Rescue"} | TabbyFund` : "Case Not Found",
  };
}

/**
 * /cases/[id] — Case detail page with real Supabase data.
 */
export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = await params;
  const c = await getCaseDetail(id);

  if (!c) notFound();

  const user = await getUser();
  const currentUserId = user?.id ?? null;

  const reportedAgo = formatDistanceToNow(new Date(c.created_at), { addSuffix: true });
  const reporterName = c.reporter?.display_name ?? "Anonymous";
  const location = formatLocation(c.fuzzed_lat, c.fuzzed_lng);
  const severity = (c.ai_severity ?? "MEDIUM") as Severity;
  const status = c.status as CaseStatus;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Desktop floating aside */}
      <CaseStickyNav />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* MOBILE: Hero first */}
        <div className="sm:hidden">
          <FadeIn>
            <div id="section-rescue" className="scroll-mt-32">
              <CaseHero
                photo={c.photo_url}
                description={c.description}
                status={status}
                severity={severity}
                condition={c.ai_condition ?? "Unknown Condition"}
                location={location}
                reporter={reporterName}
                reportedAgo={reportedAgo}
                isFundable={c.funding != null && !c.funding.is_fully_funded}
              />
            </div>
          </FadeIn>
        </div>

        {/* Journey Tracker */}
        <FadeIn>
          <JourneyTracker status={status} sticky />
        </FadeIn>

        {/* DESKTOP: Hero after tracker */}
        <div className="hidden sm:block">
          <FadeIn delay={50}>
            <div id="section-rescue" className="scroll-mt-20">
              <CaseHero
                photo={c.photo_url}
                description={c.description}
                status={status}
                severity={severity}
                condition={c.ai_condition ?? "Unknown Condition"}
                location={location}
                reporter={reporterName}
                reportedAgo={reportedAgo}
                isFundable={c.funding != null && !c.funding.is_fully_funded}
              />
            </div>
          </FadeIn>
        </div>

        {/* AI Analysis + Recommendation */}
        {c.ai_condition && (
          <FadeIn delay={100}>
            <div id="section-ai" className="scroll-mt-32 sm:scroll-mt-20 space-y-4">
              <AIAnalysisCard
                condition={c.ai_condition}
                confidence={c.ai_confidence ?? 0}
                reasoning={c.ai_reasoning ?? ""}
                firstAid={c.ai_first_aid ?? []}
                severity={severity}
              />
              <AIRecommendationCard severity={severity} condition={c.ai_condition} />
            </div>
          </FadeIn>
        )}

        {/* Transport */}
        {c.transport && (
          <FadeIn delay={150}>
            <div id="section-transport" className="scroll-mt-32 sm:scroll-mt-20">
              <TransportCardWithClinics
                caseId={c.id}
                status={c.transport.status}
                transporter={c.transport.claimed_by_profile?.display_name}
                isAssignedTransporter={currentUserId != null && c.transport.claimed_by === currentUserId}
                fuzzedLat={c.fuzzed_lat}
                fuzzedLng={c.fuzzed_lng}
              />
            </div>
          </FadeIn>
        )}

        {/* Vet Quote */}
        {c.vet_quote && (
          <FadeIn delay={200}>
            <div id="section-vet" className="scroll-mt-32 sm:scroll-mt-20">
              <VetQuoteCard
                vet={c.vet_quote.vet_profile?.display_name ?? "Vet"}
                amount={c.vet_quote.quoted_amount}
                notes={c.vet_quote.notes ?? ""}
              />
            </div>
          </FadeIn>
        )}

        {/* Funding */}
        {c.funding && (
          <FadeIn delay={250}>
            <div id="section-funding" className="scroll-mt-32 sm:scroll-mt-20">
              <FundingCard
                goal={c.funding.goal}
                raised={c.funding.total_raised}
                donors={c.funding.donor_count}
                caseData={{
                  id: c.id,
                  title: c.ai_condition ?? "Rescue Case",
                  goal: c.funding.goal,
                  raised: c.funding.total_raised,
                  donors: c.funding.donor_count,
                }}
              />
            </div>
          </FadeIn>
        )}

        {/* Treatment */}
        {c.treatment && (
          <FadeIn delay={300}>
            <div id="section-recovery" className="scroll-mt-32 sm:scroll-mt-20">
              <TreatmentCard
                vet={c.treatment.vet_profile?.display_name ?? "Vet"}
                summary={c.treatment.treatment_summary}
                outcome={c.treatment.outcome}
              />
            </div>
          </FadeIn>
        )}

        {/* Foster */}
        {c.foster && (
          <FadeIn delay={350}>
            <div id="section-foster" className="scroll-mt-32 sm:scroll-mt-20">
              <FosterCard
                caretaker={c.foster.caretaker_profile?.display_name ?? "Caretaker"}
                days={differenceInDays(new Date(), new Date(c.foster.started_at))}
              />
            </div>
          </FadeIn>
        )}

        {/* Caretaker volunteer — shown when case is TREATED/FUNDS_RELEASED but has no foster record */}
        {!c.foster && ["TREATED", "FUNDS_RELEASED"].includes(c.status) && (
          <FadeIn delay={350}>
            <div id="section-foster" className="scroll-mt-32 sm:scroll-mt-20">
              <CaretakerVolunteerCard caseId={c.id} />
            </div>
          </FadeIn>
        )}

        {/* Adoption */}
        {c.adoption && (
          <FadeIn delay={400}>
            <div id="section-forever-home" className="scroll-mt-32 sm:scroll-mt-20">
              <AdoptionStatusCard
                status={c.adoption.status}
                personality={c.adoption.personality ?? undefined}
                medicalNotes={c.adoption.medical_notes ?? undefined}
              />
            </div>
          </FadeIn>
        )}

        {/* Rescue Timeline */}
        <FadeIn delay={450}>
          <RescueTimeline status={status} />
        </FadeIn>
      </div>
    </div>
  );
}

/** Format coordinates into a readable location string. */
function formatLocation(lat: number, lng: number): string {
  return `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;
}

/** Server component wrapper that fetches clinic data for TransportCard */
async function TransportCardWithClinics(props: {
  caseId: string;
  status: "OPEN" | "CLAIMED" | "DELIVERED";
  transporter?: string;
  isAssignedTransporter: boolean;
  fuzzedLat: number;
  fuzzedLng: number;
}) {
  const clinics = await getVerifiedVetClinics(props.fuzzedLat, props.fuzzedLng);
  const nearestClinics = clinics.slice(0, 3).map((c) => ({
    vetName: c.vetName,
    clinicName: c.clinicName,
    clinicAddress: c.clinicAddress,
    distance: c.distance,
  }));

  return (
    <TransportCard
      caseId={props.caseId}
      status={props.status}
      transporter={props.transporter}
      isAssignedTransporter={props.isAssignedTransporter}
      nearestClinics={nearestClinics}
    />
  );
}
