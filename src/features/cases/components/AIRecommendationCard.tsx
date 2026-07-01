import { Zap, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import type { Severity } from "../types";

interface AIRecommendationCardProps {
  severity: Severity;
  condition: string;
}

function getRecommendation(severity: Severity, condition: string) {
  switch (severity) {
    case "CRITICAL":
      return {
        action: "Immediate veterinary attention required",
        recovery: "2–4 weeks with surgery",
        confidence: "High urgency",
        urgency: "EMERGENCY",
        urgencyColor: "bg-red-100 text-red-700",
      };
    case "HIGH":
      return {
        action: "Transport to vet within 2 hours",
        recovery: "1–3 weeks",
        confidence: "Moderate-high recovery chance",
        urgency: "URGENT",
        urgencyColor: "bg-orange-100 text-orange-700",
      };
    case "MEDIUM":
      return {
        action: "Schedule vet visit within 24 hours",
        recovery: "1–2 weeks",
        confidence: "Good recovery expected",
        urgency: "MODERATE",
        urgencyColor: "bg-amber-100 text-amber-700",
      };
    case "LOW":
    default:
      return {
        action: "Monitor and provide basic care",
        recovery: "3–7 days",
        confidence: "Excellent prognosis",
        urgency: "LOW",
        urgencyColor: "bg-emerald-100 text-emerald-700",
      };
  }
}

/**
 * AIRecommendationCard — shows AI-derived recommendations.
 * Displays recommended action, estimated recovery, confidence, urgency.
 */
export function AIRecommendationCard({ severity, condition }: AIRecommendationCardProps) {
  const rec = getRecommendation(severity, condition);

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-gradient-to-br from-white to-[#F7F7FB] p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748] mb-4">
        <Zap size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> AI Recommendation
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[10px] bg-white p-3 border border-[#A788FA]/10">
          <p className="flex items-center gap-1 text-[10px] text-[#2D3748]/50 mb-1">
            <AlertTriangle size={10} strokeWidth={1.5} /> Urgency
          </p>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${rec.urgencyColor}`}>
            {rec.urgency}
          </span>
        </div>
        <div className="rounded-[10px] bg-white p-3 border border-[#A788FA]/10">
          <p className="flex items-center gap-1 text-[10px] text-[#2D3748]/50 mb-1">
            <Clock size={10} strokeWidth={1.5} /> Est. Recovery
          </p>
          <p className="text-xs font-semibold text-[#2D3748]">{rec.recovery}</p>
        </div>
        <div className="col-span-2 rounded-[10px] bg-white p-3 border border-[#A788FA]/10">
          <p className="flex items-center gap-1 text-[10px] text-[#2D3748]/50 mb-1">
            <Zap size={10} strokeWidth={1.5} /> Recommended Action
          </p>
          <p className="text-sm font-medium text-[#2D3748]">{rec.action}</p>
        </div>
        <div className="col-span-2 rounded-[10px] bg-white p-3 border border-[#A788FA]/10">
          <p className="flex items-center gap-1 text-[10px] text-[#2D3748]/50 mb-1">
            <TrendingUp size={10} strokeWidth={1.5} /> Recovery Confidence
          </p>
          <p className="text-xs text-[#2D3748]/70">{rec.confidence}</p>
        </div>
      </div>
    </div>
  );
}
