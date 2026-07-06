"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, LoaderCircle, AlertTriangle, HeartPulse, Clock, Sparkles } from "lucide-react";
import { TabbyMascot, type MascotVariant } from "@/components/branding/TabbyMascot";
import { analyzeRescuePhoto } from "../actions";

interface AIResult {
  severity: string;
  confidence: number;
  condition: string;
  reasoning: string;
  firstAid: string[];
  urgency?: string;
  estimatedRecovery?: string;
  recommendedAction?: string;
  recoveryConfidence?: number;
}

interface AIAnalysisPreviewProps {
  photoDataUrl?: string;
  storagePath?: string;
  aiResult?: AIResult;
  onAnalysisComplete: (result: AIResult) => void;
}

/** Fallback AI response when Gemini is unavailable */
const fallbackResult: AIResult = {
  condition: "Undetermined Condition",
  severity: "MEDIUM",
  confidence: 50,
  reasoning: "The server-side visual triage was unavailable or encountered an error. A verified veterinarian will perform the visual triage upon intake.",
  firstAid: [
    "Keep the cat in a warm, quiet, and safe place",
    "Do not touch any open wounds directly",
    "Avoid chasing if the cat tries to flee",
    "Contact a volunteer transporter to arrange vet transit",
  ],
  urgency: "Monitor",
  estimatedRecovery: "Determined by vet",
  recommendedAction: "Monitor the cat and submit the report to alert local volunteers.",
  recoveryConfidence: 50,
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

export function AIAnalysisPreview({ photoDataUrl, storagePath, aiResult, onAnalysisComplete }: AIAnalysisPreviewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(!aiResult);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (aiResult) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAnalyzing(false);
      return;
    }

    async function runAnalysis() {
      if (!storagePath) {
        setIsAnalyzing(false);
        onAnalysisComplete(fallbackResult);
        return;
      }

      try {
        const res = await analyzeRescuePhoto(storagePath);
        if (res.success && res.result) {
          onAnalysisComplete(res.result);
        } else {
          console.warn("[gemini] Analysis action failed, using fallback:", res.error);
          setError("AI analysis was unavailable. Using fallback assessment.");
          onAnalysisComplete(fallbackResult);
        }
      } catch (e) {
        console.error("[gemini] Error calling server action:", e);
        setError("Error calling AI analysis. Using fallback assessment.");
        onAnalysisComplete(fallbackResult);
      } finally {
        setIsAnalyzing(false);
      }
    }

    runAnalysis();
  }, [aiResult, storagePath, onAnalysisComplete]);

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
        <h3 className="mt-4 text-base font-semibold text-[#2D3748]">
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

  const result = {
    ...fallbackResult,
    ...(aiResult || {}),
  };
  const mascotVariant = getMascotVariant(result.severity);
  const confColor = result.confidence >= 85
    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
    : result.confidence >= 70
    ? "text-amber-600 bg-amber-50 border-amber-200"
    : "text-red-600 bg-red-50 border-red-200";

  const resultUrgency = result.urgency || "Monitor";
  const urgencyColor =
    resultUrgency.toLowerCase().includes("emergency") || result.severity === "CRITICAL"
      ? "bg-red-100 text-red-700 border-red-200"
      : resultUrgency.toLowerCase().includes("2 hours") || result.severity === "HIGH"
      ? "bg-orange-100 text-orange-700 border-orange-200"
      : resultUrgency.toLowerCase().includes("24h") || result.severity === "MEDIUM"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-emerald-100 text-emerald-700 border-emerald-200";

  return (
    <div className="space-y-5">
      {/* Fallback warning if error occurred */}
      {error && (
        <div className="flex items-center gap-2 rounded-[10px] bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
          <AlertTriangle size={14} className="shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <TabbyMascot variant={mascotVariant} size="lg" />
        <h2 className="mt-3 text-sm font-semibold text-[#2D3748]/60">AI Assessment</h2>
        <p className="mt-1 text-xl font-bold text-[#2D3748]">🐾 {result.condition}</p>
        
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${confColor}`}>
            📊 {result.confidence}% confidence
          </span>
          <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${
            result.severity === "CRITICAL" ? "bg-red-600 text-white" :
            result.severity === "HIGH" ? "bg-orange-500 text-white" :
            result.severity === "MEDIUM" ? "bg-amber-400 text-[#2D3748]" :
            "bg-emerald-500 text-white"
          }`}>
            ⚠ {result.severity}
          </span>
          <span className={`rounded-full border px-3 py-0.5 text-xs font-bold ${urgencyColor}`}>
            ⚡ {resultUrgency}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recommended Action */}
        <div className="rounded-[10px] border border-[#A788FA]/10 bg-[#F7F7FB] p-3">
          <p className="flex items-center gap-1 text-xs font-semibold text-[#2D3748]/60 mb-1">
            <HeartPulse size={12} className="text-[#6C5CE7]" /> 🚑 Recommended Action
          </p>
          <p className="text-sm font-medium text-[#2D3748]">{result.recommendedAction}</p>
        </div>

        {/* Est Recovery */}
        <div className="rounded-[10px] border border-[#A788FA]/10 bg-[#F7F7FB] p-3">
          <p className="flex items-center gap-1 text-xs font-semibold text-[#2D3748]/60 mb-1">
            <Clock size={12} className="text-[#6C5CE7]" /> ⏱ Estimated Recovery
          </p>
          <p className="text-sm font-medium text-[#2D3748]">{result.estimatedRecovery}</p>
          <p className="text-[10px] text-[#2D3748]/40 mt-0.5">Prognosis confidence: {result.recoveryConfidence}%</p>
        </div>
      </div>

      {/* Reasoning */}
      <div>
        <p className="text-xs font-medium text-[#2D3748]/60 mb-1">📝 Reasoning</p>
        <p className="text-sm text-[#2D3748]/80 leading-relaxed">{result.reasoning}</p>
      </div>

      {/* First Aid */}
      <div>
        <p className="text-xs font-medium text-[#2D3748]/60 mb-2">💡 First Aid Guidance</p>
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
        <p className="flex items-start gap-1.5 text-[11px] text-[#6C5CE7] leading-relaxed">
          <ShieldCheck size={14} strokeWidth={1.5} className="mt-0.5 shrink-0" />
          <span>AI assessment is preliminary and must be confirmed by a verified veterinarian. The AI must NEVER replace veterinary diagnosis.</span>
        </p>
      </div>
    </div>
  );
}

