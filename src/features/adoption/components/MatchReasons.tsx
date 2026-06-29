import { PawPrint, Check } from "lucide-react";

interface MatchReasonsProps {
  reasons: string[];
}

/**
 * MatchReasons — "Why this cat may be a good match" AI-inspired recommendation.
 */
export function MatchReasons({ reasons }: MatchReasonsProps) {
  return (
    <div className="rounded-[16px] border border-[#6C5CE7]/15 bg-gradient-to-br from-[#6C5CE7]/5 to-[#A788FA]/5 p-5">
      <div className="flex items-center gap-2 mb-3">
        <PawPrint size={16} strokeWidth={1.5} className="text-[#6C5CE7]" />
        <h4 className="text-sm font-semibold text-[#6C5CE7]">Why this cat may be a good match</h4>
      </div>
      <ul className="space-y-2">
        {reasons.map((reason) => (
          <li key={reason} className="flex items-center gap-2 text-sm text-[#2D3748]/80">
            <Check size={14} strokeWidth={2} className="text-[#6C5CE7] shrink-0" />
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
