import { Home, Check } from "lucide-react";

interface IdealHomeCardProps {
  criteria: string[];
}

/**
 * IdealHomeCard — shows what type of home is best for this cat.
 */
export function IdealHomeCard({ criteria }: IdealHomeCardProps) {
  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748] mb-3">
        <Home size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Ideal Home
      </h4>
      <ul className="space-y-2">
        {criteria.map((c) => (
          <li key={c} className="flex items-center gap-2 text-sm text-[#2D3748]/70">
            <Check size={13} strokeWidth={2} className="text-emerald-500 shrink-0" /> {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
