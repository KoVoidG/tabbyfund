"use client";

import { Clock, HeartPulse, CircleCheck, FileText } from "lucide-react";

interface VetKpiCardsProps {
  waiting: number;
  inTreatment: number;
  completed: number;
  releasedEarnings: number;
}

const cards = [
  {
    key: "waiting",
    icon: Clock,
    label: "Patients Waiting",
    colorIcon: "text-orange-600 bg-orange-50 border border-orange-200/60",
    colorValue: "text-orange-700",
    colorBadge: "bg-orange-50 border-orange-200/60",
    scrollTarget: "patients-waiting",
    desc: "Waiting for examination",
    urgent: true,
  },
  {
    key: "inTreatment",
    icon: HeartPulse,
    label: "In Treatment",
    colorIcon: "text-blue-600 bg-blue-50 border border-blue-200/60",
    colorValue: "text-blue-700",
    colorBadge: "bg-blue-50 border-blue-200/60",
    scrollTarget: "in-treatment",
    desc: "Active treatment courses",
    urgent: false,
  },
  {
    key: "completed",
    icon: CircleCheck,
    label: "Completed",
    colorIcon: "text-emerald-600 bg-emerald-50 border border-emerald-200/60",
    colorValue: "text-emerald-700",
    colorBadge: "bg-emerald-50 border-emerald-200/60",
    scrollTarget: "completed-treatments",
    desc: "Recovered & confirmed",
    urgent: false,
  },
  {
    key: "releasedEarnings",
    icon: FileText,
    label: "Released Earnings",
    colorIcon: "text-[#6C5CE7] bg-[#6C5CE7]/10 border border-[#A788FA]/20",
    colorValue: "text-[#6C5CE7]",
    colorBadge: "bg-[#6C5CE7]/5 border-[#A788FA]/20",
    scrollTarget: null, // no scroll for financial
    desc: "Total from escrow",
    urgent: false,
  },
];

/**
 * VetKpiCards — clickable KPI cards that smoothly scroll to the matching
 * patient section on the dashboard. Uses scrollIntoView with scroll-margin-top.
 */
export function VetKpiCards({ waiting, inTreatment, completed, releasedEarnings }: VetKpiCardsProps) {
  const values: Record<string, number | string> = {
    waiting,
    inTreatment,
    completed,
    releasedEarnings: `฿${releasedEarnings.toLocaleString()}`,
  };

  function handleScroll(targetId: string | null) {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = values[card.key];
        const isClickable = !!card.scrollTarget;

        const content = (
          <>
            <div className="flex items-start justify-between">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${card.colorIcon}`}>
                <Icon size={18} strokeWidth={1.5} />
              </div>
              {card.urgent && typeof value === "number" && value > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white animate-pulse">
                  {value}
                </span>
              )}
            </div>
            <div className="mt-3">
              <p className={`text-2xl font-bold tracking-tight ${card.colorValue}`}>{value}</p>
              <p className="text-[11px] font-bold text-[#2D3748]/65 uppercase tracking-wide mt-0.5">{card.label}</p>
              <p className="text-[10px] text-[#2D3748]/40 mt-1 leading-snug">{card.desc}</p>
            </div>
            {isClickable && (
              <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-[#6C5CE7]/60 group-hover:text-[#6C5CE7] transition-colors">
                <span>View section</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transition-transform group-hover:translate-y-0.5">
                  <path d="M5 2v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </>
        );

        if (isClickable) {
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => handleScroll(card.scrollTarget)}
              className="group flex flex-col rounded-[16px] border border-[#A788FA]/15 bg-white p-4 text-left shadow-[0_4px_20px_rgba(108,92,231,0.06)] transition-all hover:shadow-[0_8px_28px_rgba(108,92,231,0.12)] hover:border-[#6C5CE7]/20 active:scale-[0.98]"
            >
              {content}
            </button>
          );
        }

        return (
          <div
            key={card.key}
            className="flex flex-col rounded-[16px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_4px_20px_rgba(108,92,231,0.06)]"
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
