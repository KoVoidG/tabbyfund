import { PawPrint, Truck, Stethoscope, DollarSign, HeartPulse, Home, Heart, CircleCheck, Hospital, FileText, CheckCircle2 } from "lucide-react";
import type { CaseStatus } from "../types";

interface RescueTimelineProps {
  status: CaseStatus;
  reporterName: string;
  transporterName?: string | null;
  assignedVetName?: string | null;
  assignedClinicName?: string | null;
  hasQuote?: boolean;
  caretakerName?: string | null;
  isBehaviourComplete?: boolean;
  hasAdoptionListing?: boolean;
  isEscrowReleased?: boolean;
}

export function RescueTimeline({
  status,
  reporterName,
  transporterName,
  assignedVetName,
  assignedClinicName,
  hasQuote,
  caretakerName,
  isBehaviourComplete,
  hasAdoptionListing,
  isEscrowReleased,
}: RescueTimelineProps) {
  const STATUS_ORDER: Record<CaseStatus, number> = {
    REPORTED: 0,
    TRIAGED: 1,
    AWAITING_TRANSPORT: 2,
    IN_TRANSIT: 3,
    AT_VET: 4,
    QUOTED: 5,
    FUNDING_OPEN: 6,
    FUNDED: 7,
    IN_TREATMENT: 8,
    TREATED: 9,
    FUNDS_RELEASED: 10,
    IN_FOSTER: 11,
    ADOPTED: 12,
    SHELTERED: 11,
    REUNITED: 12,
    DECEASED: 12,
    CANCELLED: 0,
    LOST_CONTACT: 0,
  };

  const currentIndex = STATUS_ORDER[status] ?? 0;

  const isTransitAccepted = currentIndex >= 3;
  const isDelivered = currentIndex >= 4;
  const isVetAssigned = currentIndex >= 5 || (isDelivered && !!assignedVetName);
  const isQuoteCreated = currentIndex >= 6 || !!hasQuote;
  const isFundingStarted = currentIndex >= 6;
  const isTreatmentStarted = currentIndex >= 8;
  const isTreatmentCompleted = currentIndex >= 9;
  const isFundsReleased = !!isEscrowReleased;
  const isTemporaryCaretaker = ["IN_FOSTER", "ADOPTED", "SHELTERED"].includes(status) || !!caretakerName;
  const isBehaviourCompleteDone = status === "ADOPTED" || !!isBehaviourComplete;
  const isAdoptionListingActive = status === "ADOPTED" || (!!hasAdoptionListing && !!isBehaviourCompleteDone);
  const isAdopted = status === "ADOPTED" || status === "REUNITED";

  // Clean names to avoid prepending duplicate titles (Dr. Dr.)
  const formattedVet = assignedVetName
    ? (assignedVetName.toLowerCase().startsWith("dr.") ? assignedVetName : `Dr. ${assignedVetName}`)
    : null;

  const timelineSteps = [
    {
      completed: true,
      icon: PawPrint,
      label: "Reported",
      detail: `by ${reporterName}`,
    },
    {
      completed: isTransitAccepted,
      icon: Truck,
      label: "Transport Accepted",
      detail: transporterName ? `by ${transporterName}` : "Awaiting volunteer",
    },
    {
      completed: isDelivered,
      icon: Hospital,
      label: "Delivered",
      detail: assignedClinicName ? `to ${assignedClinicName}` : "In transit to clinic",
    },
    {
      completed: isVetAssigned,
      icon: Stethoscope,
      label: "Vet Assigned",
      detail: formattedVet ? `${formattedVet}` : "Pending assignment",
    },
    {
      completed: isQuoteCreated,
      icon: FileText,
      label: "Quote Created",
      detail: hasQuote ? "Vet submitted quote" : "Pending vet quote",
    },
    {
      completed: isFundingStarted,
      icon: Heart,
      label: "Funding Started",
      detail: isFundingStarted ? "Donation channel active" : "Pending quote",
    },
    {
      completed: isTreatmentStarted,
      icon: HeartPulse,
      label: "Treatment Started",
      detail: isTreatmentStarted ? "Medical care initiated" : "Pending checkup",
    },
    {
      completed: isTreatmentCompleted,
      icon: CheckCircle2,
      label: "Treatment Completed",
      detail: isTreatmentCompleted ? "Medical recovery complete" : "Under treatment",
    },
    {
      completed: isFundsReleased,
      icon: DollarSign,
      label: "Funds Released",
      detail: isFundsReleased ? "Escrow payout complete" : "Held in escrow",
    },
    {
      completed: isTemporaryCaretaker,
      icon: Home,
      label: "Temporary Caretaker",
      detail: caretakerName ? `with ${caretakerName}` : "Pending foster placement",
    },
    {
      completed: isBehaviourCompleteDone,
      icon: PawPrint,
      label: "Behaviour Profile Complete",
      detail: isBehaviourCompleteDone ? "Caretaker submitted profile" : "Awaiting foster observations",
    },
    {
      completed: isAdoptionListingActive,
      icon: Heart,
      label: "Adoption Listing",
      detail: isAdoptionListingActive ? "Listing is open to public" : "Pending foster review",
    },
    {
      completed: isAdopted,
      icon: Heart,
      label: "Adopted",
      detail: isAdopted ? "Found forever home!" : "Awaiting adoption matches",
    },
  ];

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="text-sm font-semibold text-[#2D3748] mb-4">Rescue Timeline</h3>

      <div className="space-y-0">
        {timelineSteps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="flex gap-3">
              {/* Line + dot */}
              <div className="flex flex-col items-center">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  step.completed ? "bg-[#6C5CE7] text-white" : "bg-[#F7F7FB] text-[#2D3748]/20"
                }`}>
                  {step.completed ? <CircleCheck size={12} strokeWidth={2} /> : <Icon size={12} strokeWidth={1.5} />}
                </div>
                {i < timelineSteps.length - 1 && (
                  <div className={`w-0.5 h-8 ${step.completed ? "bg-[#6C5CE7]" : "bg-[#A788FA]/12"}`} />
                )}
              </div>
              {/* Content */}
              <div className="pt-0.5 pb-4">
                <p className={`text-xs font-semibold ${step.completed ? "text-[#2D3748]" : "text-[#2D3748]/30"}`}>
                  {step.label}
                </p>
                <p className={`text-[11px] mt-0.5 ${step.completed ? "text-[#2D3748]/60" : "text-[#2D3748]/25"}`}>
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
