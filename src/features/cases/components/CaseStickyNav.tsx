"use client";

import { PawPrint, Truck, Stethoscope, DollarSign, HeartPulse, Home, Heart, Brain } from "lucide-react";

const navItems = [
  { key: "rescue", icon: PawPrint, label: "Hero" },
  { key: "ai", icon: Brain, label: "AI" },
  { key: "transport", icon: Truck, label: "Transport" },
  { key: "vet", icon: Stethoscope, label: "Vet" },
  { key: "funding", icon: DollarSign, label: "Funding" },
  { key: "recovery", icon: HeartPulse, label: "Treatment" },
  { key: "foster", icon: Home, label: "Foster" },
  { key: "forever-home", icon: Heart, label: "Adoption" },
];

/**
 * CaseStickyNav — lightweight floating document outline (desktop only).
 * Hidden on mobile (Journey Tracker serves as mobile navigation).
 * Smaller icons, softer colors, positioned as a subtle floating aside.
 */
export function CaseStickyNav() {
  function scrollTo(key: string) {
    const el = document.getElementById(`section-${key}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="hidden xl:block fixed top-28 right-6 w-28 space-y-0.5">
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => scrollTo(item.key)}
          className="flex w-full items-center gap-1.5 rounded-[6px] px-2 py-1.5 text-[10px] text-[#2D3748]/40 transition-colors hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7]"
        >
          <item.icon size={11} strokeWidth={1.5} />
          {item.label}
        </button>
      ))}
    </nav>
  );
}
