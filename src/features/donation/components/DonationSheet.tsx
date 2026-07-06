"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { X, HandCoins, LoaderCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AmountSelector } from "./AmountSelector";
import { EscrowExplainer } from "./EscrowExplainer";
import { PaymentMethodMock } from "./PaymentMethodMock";
import { DonationReceipt } from "./DonationReceipt";
import { submitDonation } from "../actions";

export interface DonationSheetCaseData {
  id: string;
  title: string;
  goal: number;
  raised: number;
  donors: number;
}

interface DonationSheetProps {
  caseData: DonationSheetCaseData;
  open: boolean;
  onClose: () => void;
}

type Step = "amount" | "payment" | "receipt";

export function DonationSheet({ caseData, open, onClose }: DonationSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("amount");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(200);
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || !open) return null;

  const finalAmount = customAmount
    ? parseInt(customAmount, 10)
    : selectedAmount ?? 0;

  const percent =
    caseData.goal > 0
      ? Math.round((caseData.raised / caseData.goal) * 100)
      : 0;

  const remainingAmount = caseData.goal - caseData.raised;
  const isOverfunded = finalAmount > remainingAmount;
  const isFullyFunded = remainingAmount <= 0;

  function handleConfirmPayment() {
    setError(null);

    startTransition(async () => {
      const result = await submitDonation(caseData.id, finalAmount);

      if (result.success) {
        setStep("receipt");
      } else {
        setError(result.error ?? "Failed to process donation.");
      }
    });
  }

  function handleClose() {
    setStep("amount");
    setSelectedAmount(200);
    setCustomAmount("");
    setError(null);
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-[20px] bg-white p-5 sm:p-6 shadow-2xl">
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
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HandCoins
                  size={18}
                  strokeWidth={1.5}
                  className="text-[#6C5CE7]"
                />
                <h3 className="text-base font-semibold text-[#2D3748]">
                  Donate to Rescue
                </h3>
              </div>

              <p className="text-xs text-[#2D3748]/60 line-clamp-1">
                {caseData.title}
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-[#6C5CE7]">
                  ฿{caseData.raised.toLocaleString()} raised
                </span>
                <span className="text-[#2D3748]/50">
                  of ฿{caseData.goal.toLocaleString()}
                </span>
              </div>

              <Progress
                value={percent}
                className="h-2 bg-[#A788FA]/15 [&>div]:bg-[#6C5CE7] [&>div]:rounded-full rounded-full"
              />

              <p className="mt-1 text-[10px] text-[#2D3748]/40">
                {caseData.donors} donors · {percent}% funded
              </p>
            </div>

            {step === "amount" && (
              <>
                <AmountSelector
                  selected={selectedAmount}
                  customAmount={customAmount}
                  onSelect={setSelectedAmount}
                  onCustomChange={setCustomAmount}
                />

                {isFullyFunded && (
                  <div className="rounded-[10px] bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
                    This case has already reached its funding goal.
                  </div>
                )}

                {!isFullyFunded && isOverfunded && (
                  <div className="rounded-[10px] bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                    Only ฿{remainingAmount} is still needed for this case. Please enter an amount less than or equal to the remaining amount.
                  </div>
                )}

                <EscrowExplainer />

                <button
                  disabled={!finalAmount || finalAmount <= 0 || isOverfunded || isFullyFunded}
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

                {error && (
                  <div className="rounded-[10px] bg-red-50 border border-red-200 p-3">
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleConfirmPayment}
                  disabled={isPending}
                  className="w-full h-11 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition hover:bg-[#A788FA] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoaderCircle
                        size={14}
                        strokeWidth={2}
                        className="animate-spin"
                      />
                      Processing...
                    </span>
                  ) : (
                    `Confirm Payment — ฿${finalAmount.toLocaleString()}`
                  )}
                </button>

                <button
                  onClick={() => setStep("amount")}
                  disabled={isPending}
                  className="w-full text-xs text-[#6C5CE7] font-medium hover:text-[#A788FA] disabled:opacity-40"
                >
                  ← Change amount
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
