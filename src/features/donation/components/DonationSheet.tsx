"use client";

import { useState } from "react";
import { X, HandCoins } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AmountSelector } from "./AmountSelector";
import { EscrowExplainer } from "./EscrowExplainer";
import { PaymentMethodMock } from "./PaymentMethodMock";
import { DonationReceipt } from "./DonationReceipt";
import type { DonationCase } from "../mock-data";

interface DonationSheetProps {
  caseData: DonationCase;
  open: boolean;
  onClose: () => void;
}

type Step = "amount" | "payment" | "receipt";

/**
 * DonationSheet — modal donation flow.
 * Steps: amount selection → payment mock → receipt.
 */
export function DonationSheet({ caseData, open, onClose }: DonationSheetProps) {
  const [step, setStep] = useState<Step>("amount");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(200);
  const [customAmount, setCustomAmount] = useState("");

  if (!open) return null;

  const finalAmount = customAmount ? parseInt(customAmount, 10) : selectedAmount ?? 0;
  const percent = Math.round((caseData.raised / caseData.goal) * 100);

  function handleConfirmPayment() {
    setStep("receipt");
  }

  function handleClose() {
    setStep("amount");
    setSelectedAmount(200);
    setCustomAmount("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-md max-h-[85vh] overflow-y-auto rounded-[20px] bg-white p-5 sm:p-6 shadow-xl">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F7F7FB] text-[#2D3748]/40"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        {step === "receipt" ? (
          <DonationReceipt
            amount={finalAmount}
            caseTitle={caseData.title}
            onClose={handleClose}
          />
        ) : (
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HandCoins size={18} strokeWidth={1.5} className="text-[#6C5CE7]" />
                <h3 className="font-heading text-base font-semibold text-[#2D3748]">
                  Donate to Rescue
                </h3>
              </div>
              <p className="text-xs text-[#2D3748]/60 line-clamp-1">{caseData.title}</p>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-[#6C5CE7]">฿{caseData.raised.toLocaleString()} raised</span>
                <span className="text-[#2D3748]/50">of ฿{caseData.goal.toLocaleString()}</span>
              </div>
              <Progress value={percent} className="h-2 bg-[#A788FA]/15 [&>div]:bg-[#6C5CE7] [&>div]:rounded-full rounded-full" />
              <p className="mt-1 text-[10px] text-[#2D3748]/40">{caseData.donors} donors · {percent}% funded</p>
            </div>

            {step === "amount" && (
              <>
                <AmountSelector
                  selected={selectedAmount}
                  customAmount={customAmount}
                  onSelect={setSelectedAmount}
                  onCustomChange={setCustomAmount}
                />
                <EscrowExplainer />
                <button
                  disabled={!finalAmount || finalAmount <= 0}
                  onClick={() => setStep("payment")}
                  className="w-full h-11 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition hover:bg-[#A788FA] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue — ฿{(finalAmount || 0).toLocaleString()}
                </button>
              </>
            )}

            {step === "payment" && (
              <>
                <PaymentMethodMock />
                <button
                  onClick={handleConfirmPayment}
                  className="w-full h-11 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition hover:bg-[#A788FA]"
                >
                  Confirm Payment — ฿{finalAmount.toLocaleString()}
                </button>
                <button
                  onClick={() => setStep("amount")}
                  className="w-full text-xs text-[#6C5CE7] font-medium hover:text-[#A788FA]"
                >
                  ← Change amount
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
