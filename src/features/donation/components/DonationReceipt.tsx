import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { Heart, ShieldCheck } from "lucide-react";

interface DonationReceiptProps {
  amount: number;
  caseTitle: string;
  onClose: () => void;
}

/**
 * DonationReceipt — success screen after donation is confirmed.
 */
export function DonationReceipt({ amount, caseTitle, onClose }: DonationReceiptProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-5 py-4">
      <TabbyMascot variant="donate" size="lg" />

      <div>
        <h3 className="font-heading text-lg font-bold text-[#2D3748]">
          Thank you for donating!
        </h3>
        <p className="mt-1 text-sm text-[#2D3748]/60 flex items-center justify-center gap-1">
          You&apos;re helping save a life <Heart size={14} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </p>
      </div>

      <div className="w-full rounded-[12px] bg-[#F7F7FB] p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#2D3748]/60">Amount</span>
          <span className="font-bold text-[#6C5CE7]">฿{amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#2D3748]/60">Case</span>
          <span className="text-[#2D3748] font-medium text-right max-w-[180px] truncate">{caseTitle}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#2D3748]/60">Status</span>
          <span className="flex items-center gap-1 text-[#6C5CE7] font-medium">
            <ShieldCheck size={12} strokeWidth={1.5} /> Held in Escrow
          </span>
        </div>
      </div>

      <p className="text-[11px] text-[#2D3748]/50 leading-relaxed max-w-xs">
        Your donation is safely held in escrow until a verified veterinarian confirms treatment completion.
      </p>

      <button
        onClick={onClose}
        className="w-full rounded-[12px] bg-[#6C5CE7] py-3 text-sm font-semibold text-white transition hover:bg-[#A788FA]"
      >
        Done
      </button>
    </div>
  );
}
