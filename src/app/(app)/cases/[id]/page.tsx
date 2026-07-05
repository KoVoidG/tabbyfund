import { notFound, redirect } from "next/navigation";
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
import { CaseDetailMap } from "@/features/cases/components/CaseDetailMap";
import { CompactRescueSummary } from "@/features/cases/components/CompactRescueSummary";
import { getCaseDetail, parseAIReasoning } from "@/lib/cases";
import { getUser, getProfile } from "@/lib/supabase/auth-helpers";
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
  const profile = user ? await getProfile() : null;

  // Only redirect to /vet/cases/[id] if the user is a verified vet and assigned to this case
  if (
    profile?.role === "vet" &&
    profile?.is_verified === true &&
    c.assigned_vet_id === profile.id
  ) {
    redirect(`/vet/cases/${id}`);
  }

  const currentUserId = user?.id ?? null;

  const reportedAgo = formatDistanceToNow(new Date(c.created_at), { addSuffix: true });
  const reporterName = c.reporter?.display_name ?? "Anonymous";
  const location = formatLocation(c.fuzzed_lat, c.fuzzed_lng);
  const severity = (c.ai_severity ?? "MEDIUM") as Severity;
  const status = c.status as CaseStatus;

  // Derive CompactRescueSummary props
  let currentFoster: string | null = null;
  if (status === "ADOPTED") {
    currentFoster = "Adopted";
  } else if (c.foster && c.foster.status === "ACTIVE") {
    currentFoster = c.foster.caretaker_profile?.display_name ?? "Caretaker";
  } else if (status === "FUNDS_RELEASED") {
    currentFoster = "Waiting for volunteer";
  } else {
    currentFoster = "Not ready";
  }

  let fundingStatus = "Pending Quote";
  if (c.funding) {
    const pct = c.funding.goal > 0 ? Math.min(Math.round((c.funding.total_raised / c.funding.goal) * 100), 100) : 0;
    fundingStatus = `฿${c.funding.total_raised.toLocaleString()} / ฿${c.funding.goal.toLocaleString()} (${pct}%)`;
  }

  let treatmentStatus = "Pending Examination";
  if (c.treatment) {
    if (c.treatment.outcome === "RECOVERED" && status !== "DECEASED") {
      treatmentStatus = "Completed";
    } else if (c.treatment.outcome === "DECEASED") {
      treatmentStatus = "Deceased";
    } else {
      treatmentStatus = "In Progress";
    }
  } else if (["REPORTED", "TRIAGED", "AWAITING_TRANSPORT", "IN_TRANSIT"].includes(status)) {
    treatmentStatus = "Pending Examination";
  } else {
    treatmentStatus = "Awaiting Exam";
  }

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

        {/* Compact Rescue Summary */}
        <FadeIn delay={20}>
          <CompactRescueSummary
            reporter={reporterName}
            transporter={c.transport?.claimed_by_profile?.display_name ?? null}
            assignedVet={c.assigned_vet?.display_name ?? null}
            currentFoster={currentFoster}
            status={status}
            fundingStatus={fundingStatus}
            treatmentStatus={treatmentStatus}
          />
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

        {/* Map Section */}
        <FadeIn delay={75}>
          <div id="section-map" className="scroll-mt-32 sm:scroll-mt-20">
            <CaseDetailMap
              fuzzedLat={c.fuzzed_lat}
              fuzzedLng={c.fuzzed_lng}
              preciseLat={c.precise_lat}
              preciseLng={c.precise_lng}
            />
          </div>
        </FadeIn>

        {/* AI Analysis + Recommendation */}
        {c.ai_condition && (() => {
          const parsedAI = parseAIReasoning(c.ai_reasoning);
          return (
            <FadeIn delay={100}>
              <div id="section-ai" className="scroll-mt-32 sm:scroll-mt-20 space-y-4">
                <AIAnalysisCard
                  condition={c.ai_condition}
                  confidence={c.ai_confidence ?? 0}
                  reasoning={parsedAI.reasoning}
                  firstAid={c.ai_first_aid ?? []}
                  severity={severity}
                />
                <AIRecommendationCard
                  severity={severity}
                  condition={c.ai_condition}
                  recommendedAction={parsedAI.recommendedAction}
                  estimatedRecovery={parsedAI.estimatedRecovery}
                  urgency={parsedAI.urgency}
                  recoveryConfidence={parsedAI.recoveryConfidence}
                />
              </div>
            </FadeIn>
          );
        })()}

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
                preciseLat={c.precise_lat}
                preciseLng={c.precise_lng}
                assignedVetName={c.assigned_vet?.display_name}
                assignedVetClinic={c.assigned_vet?.clinic_name}
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
                beforePhoto={c.photo_url}
                afterPhoto={c.treatment.photo_urls?.[0] || null}
              />
            </div>
          </FadeIn>
        )}

        {/* Foster */}
        {c.foster && c.foster.status === "ACTIVE" && (
          <FadeIn delay={350}>
            <div id="section-foster" className="scroll-mt-32 sm:scroll-mt-20">
              <FosterCard
                caretaker={c.foster.caretaker_profile?.display_name ?? "Caretaker"}
                days={differenceInDays(new Date(), new Date(c.foster.started_at))}
              />
            </div>
          </FadeIn>
        )}

        {/* Caretaker volunteer or Transporter CTA — shown when case is TREATED/FUNDS_RELEASED but has no ACTIVE foster record */}
        {["TREATED", "FUNDS_RELEASED"].includes(status) && !(c.foster && c.foster.status === "ACTIVE") && (() => {
          const isTransporter = c.transport != null && c.transport.claimed_by === currentUserId;
          const transporterId = c.transport?.claimed_by;
          const transporterHasDeclined = c.foster != null && c.foster.caretaker_id === transporterId && c.foster.status === "REASSIGNED";

          if (isTransporter && !transporterHasDeclined) {
            return (
              <FadeIn delay={350}>
                <div id="section-foster" className="scroll-mt-32 sm:scroll-mt-20">
                  <CaretakerVolunteerCard caseId={c.id} isTransporter={true} />
                </div>
              </FadeIn>
            );
          }

          if (transporterHasDeclined || !transporterId) {
            return (
              <FadeIn delay={350}>
                <div id="section-foster" className="scroll-mt-32 sm:scroll-mt-20">
                  <CaretakerVolunteerCard caseId={c.id} isTransporter={false} />
                </div>
              </FadeIn>
            );
          }

          // If there is an assigned transporter who hasn't declined yet (and current user is not transporter):
          if (transporterId && !transporterHasDeclined) {
            return (
              <FadeIn delay={350}>
                <div id="section-foster" className="scroll-mt-32 sm:scroll-mt-20">
                  <CaretakerVolunteerCard caseId={c.id} transporterPending={true} />
                </div>
              </FadeIn>
            );
          }

          return null;
        })()}

        {/* Adoption */}
        {c.adoption && (c.foster?.behaviour_profile_complete || status === "ADOPTED" || status === "REUNITED") && (
          <FadeIn delay={400}>
            <div id="section-forever-home" className="scroll-mt-32 sm:scroll-mt-20">
              <AdoptionStatusCard
                caseId={c.id}
                status={c.adoption.status}
                personality={c.adoption.personality ?? undefined}
                medicalNotes={c.adoption.medical_notes ?? undefined}
              />
            </div>
          </FadeIn>
        )}

        {/* Rescue Timeline */}
        <FadeIn delay={450}>
          <RescueTimeline
            status={status}
            reporterName={reporterName}
            transporterName={c.transport?.claimed_by_profile?.display_name ?? null}
            assignedVetName={c.assigned_vet?.display_name ?? null}
            assignedClinicName={c.assigned_vet?.clinic_name ?? null}
            hasQuote={c.vet_quote != null}
            caretakerName={c.foster?.caretaker_profile?.display_name ?? null}
            isBehaviourComplete={c.foster?.behaviour_profile_complete ?? false}
            hasAdoptionListing={c.adoption != null}
            isEscrowReleased={
              status === "FUNDS_RELEASED" ||
              status === "ADOPTED" ||
              status === "SHELTERED" ||
              status === "DECEASED" ||
              (!!c.funding?.is_fully_funded &&
                (c.treatment?.outcome === "RECOVERED" ||
                  c.treatment?.outcome === "DECEASED"))
            }
          />
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
  preciseLat?: number | null;
  preciseLng?: number | null;
  assignedVetName?: string | null;
  assignedVetClinic?: string | null;
}) {
  const originLat = props.preciseLat ?? props.fuzzedLat;
  const originLng = props.preciseLng ?? props.fuzzedLng;

  const clinics = await getVerifiedVetClinics(originLat, originLng);
  const nearestClinics = clinics.map((c) => ({
    vetId: c.vetId,
    vetName: c.vetName,
    clinicName: c.clinicName,
    clinicAddress: c.clinicAddress,
    distance: c.distance,
    clinicLat: c.clinicLat,
    clinicLng: c.clinicLng,
  }));

  return (
    <TransportCard
      caseId={props.caseId}
      status={props.status}
      transporter={props.transporter}
      isAssignedTransporter={props.isAssignedTransporter}
      nearestClinics={nearestClinics}
      lat={originLat}
      lng={originLng}
      isPrecise={!!props.preciseLat}
      assignedVetName={props.assignedVetName}
      assignedVetClinic={props.assignedVetClinic}
    />
  );
}
