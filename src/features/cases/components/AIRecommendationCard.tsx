import { Zap, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import type { Severity } from "../types";

interface AIRecommendationCardProps {
  severity: Severity;
  condition: string;
  recommendedAction?: string;
  estimatedRecovery?: string;
  urgency?: string;
  recoveryConfidence?: number;
}

function getRecommendationFallback(severity: Severity) {
  switch (severity) {
    case "CRITICAL":
      return {
        action: "Immediate veterinary attention required",
        recovery: "2–4 weeks with surgery",
        confidence: "High urgency",
        urgency: "EMERGENCY",
        urgencyColor: "bg-red-100 text-red-700 border border-red-200",
      };
    case "HIGH":
      return {
        action: "Transport to vet within 2 hours",
        recovery: "1–3 weeks",
        confidence: "Moderate-high recovery chance",
        urgency: "URGENT",
        urgencyColor: "bg-orange-100 text-orange-700 border border-orange-200",
      };
    case "MEDIUM":
      return {
        action: "Schedule vet visit within 24 hours",
        recovery: "1–2 weeks",
        confidence: "Good recovery expected",
        urgency: "MODERATE",
        urgencyColor: "bg-amber-100 text-amber-700 border border-amber-200",
      };
    case "LOW":
    default:
      return {
        action: "Monitor and provide basic care",
        recovery: "3–7 days",
        confidence: "Excellent prognosis",
        urgency: "LOW",
        urgencyColor: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      };
  }
}

function getUrgencyBadgeColor(urgencyStr: string, severity: Severity): string {
  const lower = urgencyStr.toLowerCase();
  if (lower.includes("emergency") || lower.includes("critical") || severity === "CRITICAL") {
    return "bg-red-100 text-red-700 border border-red-200";
  }
  if (lower.includes("2 hours") || lower.includes("immediate") || severity === "HIGH") {
    return "bg-orange-100 text-orange-700 border border-orange-200";
  }
  if (lower.includes("24h") || lower.includes("24 hours") || severity === "MEDIUM" || lower.includes("moderate")) {
    return "bg-amber-100 text-amber-700 border border-amber-200";
  }
  return "bg-emerald-100 text-emerald-700 border border-emerald-200";
}

/**
 * AIRecommendationCard — shows AI-derived recommendations.
 * Displays recommended action, estimated recovery, confidence, urgency.
 */
export function AIRecommendationCard({
  severity,
  condition,
  recommendedAction,
  estimatedRecovery,
  urgency,
  recoveryConfidence,
}: AIRecommendationCardProps) {
  const fallback = getRecommendationFallback(severity);

  const displayUrgency = urgency || fallback.urgency;
  const displayRecovery = estimatedRecovery || fallback.recovery;
  const displayAction = recommendedAction || fallback.action;
  const displayConfidence = typeof recoveryConfidence === "number"
    ? `${recoveryConfidence}% prognosis confidence`
    : fallback.confidence;

  const urgencyColorClass = urgency
    ? getUrgencyBadgeColor(urgency, severity)
    : fallback.urgencyColor;

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-linear-to-br from-white to-[#F7F7FB] p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748] mb-4">
        <Zap size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> AI Recommendation
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[10px] bg-white p-3 border border-[#A788FA]/10 flex flex-col justify-between">
          <p className="flex items-center gap-1 text-[10px] text-[#2D3748]/50 mb-1">
            <AlertTriangle size={10} strokeWidth={1.5} /> Urgency
          </p>
          <div>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${urgencyColorClass}`}>
              {displayUrgency}
            </span>
          </div>
        </div>
        <div className="rounded-[10px] bg-white p-3 border border-[#A788FA]/10">
          <p className="flex items-center gap-1 text-[10px] text-[#2D3748]/50 mb-1">
            <Clock size={10} strokeWidth={1.5} /> Est. Recovery
          </p>
          <p className="text-xs font-semibold text-[#2D3748]">{displayRecovery}</p>
        </div>
        <div className="col-span-2 rounded-[10px] bg-white p-3 border border-[#A788FA]/10">
          <p className="flex items-center gap-1 text-[10px] text-[#2D3748]/50 mb-1">
            <Zap size={10} strokeWidth={1.5} /> Recommended Action
          </p>
          <p className="text-sm font-medium text-[#2D3748]">{displayAction}</p>
        </div>
        <div className="col-span-2 rounded-[10px] bg-white p-3 border border-[#A788FA]/10">
          <p className="flex items-center gap-1 text-[10px] text-[#2D3748]/50 mb-1">
            <TrendingUp size={10} strokeWidth={1.5} /> Recovery Confidence
          </p>
          <p className="text-xs text-[#2D3748]/70">{displayConfidence}</p>
        </div>
      </div>
    </div>
  );
}

