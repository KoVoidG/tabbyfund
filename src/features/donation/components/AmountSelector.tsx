"use client";

const presetAmounts = [100, 200, 500, 1000, 2000, 5000];

interface AmountSelectorProps {
  selected: number | null;
  customAmount: string;
  onSelect: (amount: number | null) => void;
  onCustomChange: (value: string) => void;
}

/**
 * AmountSelector — preset + custom amount grid for donations.
 */
export function AmountSelector({ selected, customAmount, onSelect, onCustomChange }: AmountSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-[#2D3748]">Select amount</p>
      <div className="grid grid-cols-3 gap-2">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => {
              onSelect(amount);
              onCustomChange("");
            }}
            className={`h-11 rounded-[10px] text-sm font-semibold transition-all ${
              selected === amount && !customAmount
                ? "bg-[#6C5CE7] text-white shadow-[0_2px_8px_rgba(108,92,231,0.25)]"
                : "border border-[#A788FA]/20 text-[#2D3748] hover:border-[#6C5CE7]/40 hover:bg-[#6C5CE7]/5"
            }`}
          >
            ฿{amount.toLocaleString()}
          </button>
        ))}
      </div>
      {/* Custom */}
      <div>
        <label className="mb-1 block text-xs text-[#2D3748]/60">Or enter custom amount</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-[#A788FA]">฿</span>
          <input
            type="number"
            min={1}
            placeholder="0"
            value={customAmount}
            onChange={(e) => {
              onCustomChange(e.target.value);
              onSelect(null);
            }}
            className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white pl-8 pr-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/30 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15"
          />
        </div>
      </div>
    </div>
  );
}
