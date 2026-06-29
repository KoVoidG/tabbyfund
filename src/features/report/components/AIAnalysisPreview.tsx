"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, LoaderCircle } from "lucide-react";
import { TabbyMascot, type MascotVariant } from "@/components/branding/TabbyMascot";

interface AIResult {
  severity: string;
  confidence: number;
  condition: string;
  reasoning: string;
  firstAid: string[];
}

interface AIAnalysisPreviewProps {
  photoDataUrl?: string;
  aiResult?: AIResult;
  onAnalysisComplete: (result: AIResult) => void;
}

/** Mock AI response — simulates Gemini analysis */
const mockResult: AIResult = {
  severity: "HIGH",
  confidence: 85,
  condition: "Open Wound",
  reasoning: "Visible wound with moderate bleeding. The cat appears alert but in discomfort. Immediate veterinary attention recommended.",
  firstAid: [
    "Do not touch the wound directly",
    "Keep the cat calm and warm",
    "Avoid chasing if the cat tries to flee",
    "Contact a volunteer transporter",
  ],
};

function getMascotVariant(severity: string): MascotVariant {
  switch (severity) {
    case "CRITICAL":
    case "HIGH":
      return "warning";
    case "MEDIUM":
      return "think";
    default:
      return "happy";
  }
}

/**
 * AIAnalysisPreview — Step 2 of the rescue wizard.
 * Simulates AI analysis with a loading state, then shows results.
 */
export function AIAnalysisPreview({ photoDataUrl, aiResult, onAnalysisComplete }: AIAnalysisPreviewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(!aiResult);

  // Simulate AI analysis (2.5s delay)
  useEffect(() => {
    if (aiResult) {
      setIsAnalyzing(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      onAnalysisComplete(mockResult);
    }, 2500);
    return () => clearTimeout(timer);
  }, [aiResult, onAnalysisComplete]);

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="relative">
          <TabbyMascot variant="think" size="xl" />
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
            <LoaderCircle size={16} strokeWidth={2} className="animate-spin text-[#6C5CE7]" />
          </div>
        </div>
        <h3 className="mt-4 font-heading text-base font-semibold text-[#2D3748]">
          Analyzing photo...
        </h3>
        <p className="mt-1 text-sm text-[#2D3748]/60">
          Our AI is assessing the cat&apos;s condition
        </p>
        <div className="mt-4 h-1.5 w-40 overflow-hidden rounded-full bg-[#A788FA]/15">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-[#6C5CE7]" />
        </div>
      </div>
    );
  }

  const result = aiResult ?? mockResult;
  const mascotVariant = getMascotVariant(result.severity);
  const confColor = result.confidence >= 85
    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
    : result.confidence >= 70
    ? "text-amber-600 bg-amber-50 border-amber-200"
    : "text-red-600 bg-red-50 border-red-200";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <TabbyMascot variant={mascotVariant} size="lg" />
        <h2 className="mt-3 font-heading text-base font-semibold text-[#2D3748]">AI Assessment</h2>
        <p className="mt-1 text-xl font-bold text-[#2D3748]">{result.condition}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${confColor}`}>
            {result.confidence}% confidence
          </span>
          <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${
            result.severity === "CRITICAL" ? "bg-red-600 text-white" :
            result.severity === "HIGH" ? "bg-orange-500 text-white" :
            result.severity === "MEDIUM" ? "bg-amber-400 text-[#2D3748]" :
            "bg-emerald-500 text-white"
          }`}>
            {result.severity}
          </span>
        </div>
      </div>

      {/* Reasoning */}
      <div>
        <p className="text-xs font-medium text-[#2D3748]/60 mb-1">Reasoning</p>
        <p className="text-sm text-[#2D3748]/80 leading-relaxed">{result.reasoning}</p>
      </div>

      {/* First Aid */}
      <div>
        <p className="text-xs font-medium text-[#2D3748]/60 mb-2">First Aid Guidance</p>
        <ul className="space-y-2">
          {result.firstAid.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#2D3748]/80">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6C5CE7]" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="rounded-[10px] bg-[#A788FA]/5 p-3">
        <p className="flex items-start gap-1.5 text-[11px] text-[#6C5CE7]">
          <ShieldCheck size={12} strokeWidth={1.5} className="mt-0.5 shrink-0" />
          This is AI guidance only. Final diagnosis must be made by a verified veterinarian.
        </p>
      </div>
    </div>
  );
}
