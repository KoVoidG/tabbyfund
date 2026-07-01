import { PawPrint, Truck, Stethoscope, DollarSign, HeartPulse, Home, Heart, CircleCheck } from "lucide-react";
import type { CaseStatus } from "../types";

interface TimelineEvent {
  icon: React.ElementType;
  label: string;
  detail: string;
  matchStatuses: CaseStatus[];
}

const events: TimelineEvent[] = [
  { icon: PawPrint, label: "Reported", detail: "Community member reported an injured cat", matchStatuses: ["REPORTED", "TRIAGED", "AWAITING_TRANSPORT", "IN_TRANSIT", "AT_VET", "QUOTED", "FUNDING_OPEN", "FUNDED", "IN_TREATMENT", "TREATED", "FUNDS_RELEASED", "IN_FOSTER", "ADOPTED"] },
  { icon: Truck, label: "Transported", detail: "Volunteer transported the cat to a vet clinic", matchStatuses: ["IN_TRANSIT", "AT_VET", "QUOTED", "FUNDING_OPEN", "FUNDED", "IN_TREATMENT", "TREATED", "FUNDS_RELEASED", "IN_FOSTER", "ADOPTED"] },
  { icon: Stethoscope, label: "Vet Exam", detail: "Veterinarian examined and quoted treatment", matchStatuses: ["AT_VET", "QUOTED", "FUNDING_OPEN", "FUNDED", "IN_TREATMENT", "TREATED", "FUNDS_RELEASED", "IN_FOSTER", "ADOPTED"] },
  { icon: DollarSign, label: "Funding Complete", detail: "Community funded the treatment", matchStatuses: ["FUNDED", "IN_TREATMENT", "TREATED", "FUNDS_RELEASED", "IN_FOSTER", "ADOPTED"] },
  { icon: HeartPulse, label: "Treatment", detail: "Vet completed treatment successfully", matchStatuses: ["TREATED", "FUNDS_RELEASED", "IN_FOSTER", "ADOPTED"] },
  { icon: Home, label: "Foster", detail: "Cat placed in temporary foster care", matchStatuses: ["IN_FOSTER", "ADOPTED"] },
  { icon: Heart, label: "Forever Home", detail: "Cat found a permanent loving home", matchStatuses: ["ADOPTED"] },
];

interface RescueTimelineProps {
  status: CaseStatus;
}

/**
 * RescueTimeline — chronological event log showing what has happened so far.
 * Completed events are highlighted, future events are muted.
 */
export function RescueTimeline({ status }: RescueTimelineProps) {
  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="font-heading text-sm font-semibold text-[#2D3748] mb-4">Rescue Timeline</h3>

      <div className="space-y-0">
        {events.map((event, i) => {
          const completed = event.matchStatuses.includes(status);
          const Icon = event.icon;
          return (
            <div key={event.label} className="flex gap-3">
              {/* Line + dot */}
              <div className="flex flex-col items-center">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  completed ? "bg-[#6C5CE7] text-white" : "bg-[#F7F7FB] text-[#2D3748]/20"
                }`}>
                  {completed ? <CircleCheck size={12} strokeWidth={2} /> : <Icon size={12} strokeWidth={1.5} />}
                </div>
                {i < events.length - 1 && (
                  <div className={`w-0.5 h-8 ${completed ? "bg-[#6C5CE7]" : "bg-[#A788FA]/12"}`} />
                )}
              </div>
              {/* Content */}
              <div className="pt-0.5 pb-4">
                <p className={`text-xs font-semibold ${completed ? "text-[#2D3748]" : "text-[#2D3748]/30"}`}>
                  {event.label}
                </p>
                <p className={`text-[11px] mt-0.5 ${completed ? "text-[#2D3748]/60" : "text-[#2D3748]/20"}`}>
                  {event.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
