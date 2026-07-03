"use client";

import React from "react";
import { PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PawBackgroundProps {
  className?: string;
  density?: "low" | "medium" | "high";
}

interface PawConfig {
  top: string;
  left: string;
  size: number;
  color: string;
  opacity: number;
  rotate: number;
  isEmoji?: boolean;
  duration: string;
  delay: string;
  driftX: string;
  driftY: string;
  driftRotate: string;
}

const CURATED_PAWS: PawConfig[] = [
  // Low density (8 paws)
  { top: "8%", left: "6%", size: 40, color: "#6C5CE7", opacity: 0.25, rotate: 15, duration: "14s", delay: "-2s", driftX: "-8px", driftY: "-14px", driftRotate: "6deg" },
  { top: "22%", left: "85%", size: 56, color: "#FF8B7B", opacity: 0.22, rotate: -25, duration: "18s", delay: "-5s", driftX: "12px", driftY: "10px", driftRotate: "-8deg" },
  { top: "35%", left: "75%", size: 48, color: "#FFD8A8", opacity: 0.28, rotate: 40, duration: "16s", delay: "-8s", driftX: "-10px", driftY: "-8px", driftRotate: "4deg" },
  { top: "48%", left: "12%", size: 30, color: "#6C5CE7", opacity: 0.20, rotate: -10, isEmoji: true, duration: "12s", delay: "-1s", driftX: "6px", driftY: "12px", driftRotate: "-5deg" },
  { top: "62%", left: "78%", size: 44, color: "#6C5CE7", opacity: 0.30, rotate: 60, duration: "20s", delay: "-12s", driftX: "-15px", driftY: "15px", driftRotate: "8deg" },
  { top: "75%", left: "5%", size: 36, color: "#FF8B7B", opacity: 0.24, rotate: 35, isEmoji: true, duration: "15s", delay: "-3s", driftX: "10px", driftY: "-10px", driftRotate: "-4deg" },
  { top: "88%", left: "88%", size: 52, color: "#6C5CE7", opacity: 0.26, rotate: 15, duration: "22s", delay: "-6s", driftX: "-12px", driftY: "-18px", driftRotate: "5deg" },
  { top: "92%", left: "25%", size: 24, color: "#FFD8A8", opacity: 0.21, rotate: -45, isEmoji: true, duration: "13s", delay: "-9s", driftX: "8px", driftY: "8px", driftRotate: "-7deg" },
  
  // Medium density addition (7 more paws, total 15)
  { top: "15%", left: "45%", size: 32, color: "#FFD8A8", opacity: 0.23, rotate: -12, duration: "17s", delay: "-4s", driftX: "12px", driftY: "-12px", driftRotate: "-6deg" },
  { top: "53%", left: "45%", size: 60, color: "#6C5CE7", opacity: 0.29, rotate: 80, duration: "24s", delay: "-10s", driftX: "-20px", driftY: "20px", driftRotate: "10deg" },
  { top: "66%", left: "28%", size: 38, color: "#FF8B7B", opacity: 0.27, rotate: -35, duration: "19s", delay: "-7s", driftX: "10px", driftY: "-8px", driftRotate: "-5deg" },
  { top: "30%", left: "20%", size: 30, color: "#6C5CE7", opacity: 0.22, rotate: 22, duration: "15s", delay: "-11s", driftX: "-6px", driftY: "12px", driftRotate: "6deg" },
  { top: "42%", left: "92%", size: 42, color: "#FF8B7B", opacity: 0.25, rotate: 18, duration: "21s", delay: "-2s", driftX: "14px", driftY: "-10px", driftRotate: "-8deg" },
  { top: "70%", left: "60%", size: 48, color: "#FFD8A8", opacity: 0.28, rotate: -15, duration: "16s", delay: "-13s", driftX: "-8px", driftY: "14px", driftRotate: "5deg" },
  { top: "82%", left: "48%", size: 34, color: "#6C5CE7", opacity: 0.24, rotate: 50, duration: "18s", delay: "-1s", driftX: "8px", driftY: "-12px", driftRotate: "-4deg" },

  // High density addition (10 more paws, total 25)
  { top: "4%", left: "70%", size: 36, color: "#FF8B7B", opacity: 0.21, rotate: -8, duration: "14s", delay: "-3s", driftX: "-10px", driftY: "10px", driftRotate: "7deg" },
  { top: "12%", left: "25%", size: 40, color: "#6C5CE7", opacity: 0.23, rotate: 28, duration: "19s", delay: "-15s", driftX: "12px", driftY: "-15px", driftRotate: "-6deg" },
  { top: "27%", left: "50%", size: 28, color: "#FFD8A8", opacity: 0.26, rotate: -40, duration: "22s", delay: "-8s", driftX: "-14px", driftY: "8px", driftRotate: "5deg" },
  { top: "38%", left: "38%", size: 46, color: "#FF8B7B", opacity: 0.28, rotate: 55, duration: "17s", delay: "-5s", driftX: "8px", driftY: "12px", driftRotate: "-8deg" },
  { top: "58%", left: "15%", size: 32, color: "#FFD8A8", opacity: 0.22, rotate: -20, duration: "15s", delay: "-12s", driftX: "-12px", driftY: "-10px", driftRotate: "4deg" },
  { top: "65%", left: "90%", size: 50, color: "#6C5CE7", opacity: 0.29, rotate: 72, duration: "20s", delay: "-2s", driftX: "15px", driftY: "18px", driftRotate: "-5deg" },
  { top: "78%", left: "30%", size: 44, color: "#FF8B7B", opacity: 0.25, rotate: -5, duration: "18s", delay: "-14s", driftX: "-8px", driftY: "-12px", driftRotate: "6deg" },
  { top: "80%", left: "72%", size: 36, color: "#FFD8A8", opacity: 0.27, rotate: 30, duration: "16s", delay: "-6s", driftX: "10px", driftY: "8px", driftRotate: "-7deg" },
  { top: "95%", left: "65%", size: 42, color: "#6C5CE7", opacity: 0.24, rotate: -18, duration: "23s", delay: "-10s", driftX: "-15px", driftY: "-15px", driftRotate: "8deg" },
  { top: "97%", left: "10%", size: 48, color: "#FF8B7B", opacity: 0.26, rotate: 45, duration: "21s", delay: "-4s", driftX: "12px", driftY: "12px", driftRotate: "-6deg" },
];

export function PawBackground({ className, density = "medium" }: PawBackgroundProps) {
  const getPawsCount = () => {
    switch (density) {
      case "low":
        return 8;
      case "high":
        return 25;
      case "medium":
      default:
        return 15;
    }
  };

  const visiblePaws = CURATED_PAWS.slice(0, getPawsCount());

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none select-none overflow-hidden z-0",
        className
      )}
      aria-hidden="true"
    >
      <style>{`
        @keyframes paw-float {
          0% {
            transform: translate3d(0, 0, 0) rotate(var(--base-rotate));
          }
          50% {
            transform: translate3d(var(--drift-x), var(--drift-y), 0) rotate(calc(var(--base-rotate) + var(--drift-rotate)));
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(var(--base-rotate));
          }
        }
        .animated-paw {
          animation: paw-float var(--float-duration) ease-in-out var(--float-delay) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animated-paw {
            animation: none !important;
            transform: rotate(var(--base-rotate)) !important;
          }
        }
      `}</style>

      {visiblePaws.map((paw, index) => {
        // Build style map incorporating base CSS properties and custom properties
        const style = {
          position: "absolute",
          top: paw.top,
          left: paw.left,
          opacity: paw.opacity,
          color: paw.color,
          fontSize: paw.isEmoji ? `${paw.size}px` : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "--base-rotate": `${paw.rotate}deg`,
          "--float-duration": paw.duration,
          "--float-delay": paw.delay,
          "--drift-x": paw.driftX,
          "--drift-y": paw.driftY,
          "--drift-rotate": paw.driftRotate,
        } as React.CSSProperties;

        if (paw.isEmoji) {
          return (
            <div key={index} className="animated-paw" style={style}>
              🐾
            </div>
          );
        }

        return (
          <div key={index} className="animated-paw" style={style}>
            <PawPrint size={paw.size} strokeWidth={1.5} />
          </div>
        );
      })}
    </div>
  );
}
