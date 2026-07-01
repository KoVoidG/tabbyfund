"use client";

import { useEffect, useRef } from "react";
import { PawPrint, Truck, Stethoscope, Heart, HeartPulse, Home, Check } from "lucide-react";
import type { CaseStatus } from "../types";

interface JourneyStep {
  key: string;
  icon: React.ElementType;
  label: string;
  statuses: CaseStatus[];
}

const steps: JourneyStep[] = [
  { key: "rescue", icon: PawPrint, label: "Rescue", statuses: ["REPORTED", "TRIAGED", "AWAITING_TRANSPORT"] },
  { key: "transport", icon: Truck, label: "Transport", statuses: ["IN_TRANSIT"] },
  { key: "vet", icon: Stethoscope, label: "Vet", statuses: ["AT_VET", "QUOTED"] },
  { key: "funding", icon: Heart, label: "Funding", statuses: ["FUNDING_OPEN", "FUNDED"] },
  { key: "recovery", icon: HeartPulse, label: "Recovery", statuses: ["IN_TREATMENT", "TREATED", "FUNDS_RELEASED"] },
  { key: "foster", icon: Home, label: "Foster", statuses: ["IN_FOSTER"] },
  { key: "forever-home", icon: Heart, label: "Forever Home", statuses: ["ADOPTED"] },
];

function getStepState(stepIndex: number, currentStepIndex: number) {
  if (stepIndex < currentStepIndex) return "completed";
  if (stepIndex === currentStepIndex) return "current";
  return "upcoming";
}

function getCurrentStepIndex(status: CaseStatus): number {
  const idx = steps.findIndex((s) => s.statuses.includes(status));
  return idx >= 0 ? idx : 0;
}

interface JourneyTrackerProps {
  status: CaseStatus;
  sticky?: boolean;
}

/**
 * JourneyTracker — visual lifecycle tracker.
 * Always horizontal (desktop & mobile).
 * Mobile: horizontally scrollable, auto-scrolls to current step.
 * Desktop: centered, full-width.
 * When sticky=true, sticks to top on scroll (mobile navigation mode).
 */
export function JourneyTracker({ status, sticky = false }: JourneyTrackerProps) {
  const currentIdx = getCurrentStepIndex(status);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to current step on mobile
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const active = activeRef.current;
      const offset = active.offsetLeft - container.clientWidth / 2 + active.clientWidth / 2;
      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, [currentIdx]);

  function scrollToSection(key: string) {
    const el = document.getElementById(`section-${key}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className={`rounded-[16px] border border-[#A788FA]/15 bg-white/95 backdrop-blur-sm shadow-[0_4px_20px_rgba(108,92,231,0.08)] ${
      sticky ? "sticky top-14 z-20" : ""
    }`}>
      <div
        ref={scrollRef}
        className="flex items-center gap-1 overflow-x-auto px-4 py-3 sm:px-6 sm:py-4 scrollbar-hide sm:justify-between sm:overflow-visible"
      >
        {steps.map((step, i) => {
          const state = getStepState(i, currentIdx);
          const Icon = step.icon;
          const isCurrent = state === "current";
          return (
            <div key={step.key} className="flex items-center shrink-0 sm:flex-1 sm:last:flex-none">
              <button
                ref={isCurrent ? activeRef : undefined}
                onClick={() => scrollToSection(step.key)}
                className="flex flex-col items-center gap-1 group cursor-pointer px-2 sm:px-0"
                title={`Scroll to ${step.label}`}
              >
                <div className={`relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all ${
                  state === "completed"
                    ? "bg-[#6C5CE7] text-white"
                    : state === "current"
                    ? "bg-[#6C5CE7] text-white ring-4 ring-[#6C5CE7]/20 animate-pulse"
                    : "bg-[#F7F7FB] text-[#2D3748]/25 group-hover:bg-[#A788FA]/10 group-hover:text-[#A788FA]"
                }`}>
                  {state === "completed" ? (
                    <Check size={14} strokeWidth={2.5} className="sm:w-[18px] sm:h-[18px]" />
                  ) : (
                    <Icon size={14} strokeWidth={1.5} className="sm:w-[18px] sm:h-[18px]" />
                  )}
                </div>
                <span className={`text-[9px] sm:text-[10px] font-medium whitespace-nowrap transition-colors ${
                  state === "completed"
                    ? "text-[#6C5CE7]"
                    : state === "current"
                    ? "text-[#6C5CE7] font-semibold"
                    : "text-[#2D3748]/35 group-hover:text-[#A788FA]"
                }`}>
                  {step.label}
                </span>
              </button>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className={`w-4 sm:flex-1 h-0.5 mx-0.5 sm:mx-2 shrink-0 rounded-full transition-colors ${
                  i < currentIdx ? "bg-[#6C5CE7]" : "bg-[#A788FA]/12"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
