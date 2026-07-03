import { Stethoscope, ShieldCheck } from "lucide-react";

interface VetQuoteCardProps {
  vet: string;
  amount: number;
  notes: string;
}

/**
 * VetQuoteCard — shows the veterinary treatment quote.
 */
export function VetQuoteCard({ vet, amount, notes }: VetQuoteCardProps) {
  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)] transition-shadow hover:shadow-[0_8px_28px_rgba(108,92,231,0.12)]">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748] mb-3">
        <Stethoscope size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Vet Quote
      </h3>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6C5CE7]/8">
          <Stethoscope size={16} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#2D3748]">{vet}</p>
          <p className="flex items-center gap-1 text-[11px] text-[#6C5CE7]">
            <ShieldCheck size={10} strokeWidth={1.5} /> Verified
          </p>
        </div>
      </div>
      <div className="rounded-[10px] bg-[#F7F7FB] p-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-xs text-[#2D3748]/60">Treatment Cost</span>
          <span className="text-sm font-bold text-[#6C5CE7]">฿{amount.toLocaleString()}</span>
        </div>
        <p className="text-xs text-[#2D3748]/70 leading-relaxed">{notes}</p>
      </div>
    </div>
  );
}
