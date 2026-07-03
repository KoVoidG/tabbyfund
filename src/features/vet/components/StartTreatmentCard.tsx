"use client";

import { useState, useTransition } from "react";
import { Stethoscope, LoaderCircle, HeartPulse } from "lucide-react";
import { createTreatmentRecord } from "../actions";

interface StartTreatmentCardProps {
  caseId: string;
}

export function StartTreatmentCard({ caseId }: StartTreatmentCardProps) {
  const [treatmentSummary, setTreatmentSummary] = useState("Starting treatment as quoted.");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleStart() {
    if (!treatmentSummary.trim()) {
      setError("Please describe the initial treatment action/plan.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createTreatmentRecord({
        caseId,
        treatmentSummary: treatmentSummary.trim(),
        outcome: "ONGOING",
      });

      if (!result.success) {
        setError(result.error ?? "Failed to start treatment.");
      }
    });
  }

  return (
    <div className="rounded-[16px] border border-[#6C5CE7]/15 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)] space-y-4">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748]">
        <HeartPulse size={16} className="text-[#6C5CE7]" /> Initiate Treatment
      </h3>
      <p className="text-xs text-[#2D3748]/60 leading-relaxed">
        The clinic is assigned to this rescue case. You can start treatment immediately.
        Community funding will continue in parallel.
      </p>

      {error && (
        <div className="rounded-[8px] bg-red-50 p-3 text-xs font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#2D3748]/70">Initial Treatment Summary</label>
          <textarea
            rows={3}
            value={treatmentSummary}
            onChange={(e) => setTreatmentSummary(e.target.value)}
            placeholder="Describe treatment actions (e.g. Wound cleaned, antibiotics administered, leg splinted)..."
            className="w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 py-3 text-xs text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15 resize-none leading-relaxed"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={isPending}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] px-5 text-xs font-bold text-white transition hover:bg-[#A788FA] disabled:opacity-60 cursor-pointer shadow-md"
        >
          {isPending ? (
            <>
              <LoaderCircle size={14} className="animate-spin" /> Starting Treatment...
            </>
          ) : (
            <>
              <Stethoscope size={14} /> Start Treatment Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}