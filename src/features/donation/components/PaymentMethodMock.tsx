import { QrCode, CreditCard } from "lucide-react";

/**
 * PaymentMethodMock — simulated payment step.
 * Shows a mock PromptPay QR placeholder for hackathon demo.
 */
export function PaymentMethodMock() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-[#2D3748]">Payment Method</p>

      {/* Mock QR */}
      <div className="flex flex-col items-center rounded-[14px] border border-[#A788FA]/15 bg-[#F7F7FB] p-6">
        <div className="flex h-32 w-32 items-center justify-center rounded-[12px] border-2 border-dashed border-[#A788FA]/30 bg-white">
          <QrCode size={48} strokeWidth={1} className="text-[#A788FA]/40" />
        </div>
        <p className="mt-3 text-xs font-medium text-[#2D3748]">PromptPay QR Code</p>
        <p className="mt-0.5 text-[10px] text-[#2D3748]/50">Scan to pay (simulated)</p>
      </div>

      {/* Alt method */}
      <div className="flex items-center gap-3 rounded-[10px] border border-[#A788FA]/15 bg-white p-3">
        <CreditCard size={18} strokeWidth={1.5} className="text-[#A788FA]" />
        <div>
          <p className="text-xs font-medium text-[#2D3748]">Card Payment</p>
          <p className="text-[10px] text-[#2D3748]/50">Coming soon</p>
        </div>
      </div>

      <p className="text-[10px] text-[#2D3748]/40 text-center">
        This is a simulated payment for hackathon demonstration purposes.
      </p>
    </div>
  );
}
