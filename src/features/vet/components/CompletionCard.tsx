"use client";

import { useState, useTransition } from "react";
import { CircleCheck, ShieldCheck, Heart, LoaderCircle } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { completeTreatment } from "../actions";

interface CompletionCardProps {
  caseId: string;
}

/**
 * CompletionCard — treatment completion + adoption readiness approval.
 * Vet confirms recovery outcome AND approves for adoption (medical clearance).
 */
export function CompletionCard({ caseId }: CompletionCardProps) {
  const [outcome, setOutcome] = useState<"RECOVERED" | "DECEASED" | "REFERRED">("RECOVERED");
  const [vaccination, setVaccination] = useState("complete");
  const [neutered, setNeutered] = useState(true);
  const [specialNeeds, setSpecialNeeds] = useState("");
  const [readyForAdoption, setReadyForAdoption] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await completeTreatment({
        caseId,
        outcome,
        vaccinationStatus: vaccination,
        isNeutered: neutered,
        specialNeeds,
        readyForAdoption,
      });

      if (result.success) {
        setConfirmed(true);
      } else {
        setError(result.error ?? "Failed to complete treatment.");
      }
    });
  }

  if (confirmed) {
    return (
      <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 p-6 text-center space-y-4">
        <TabbyMascot variant="celebrate" size="lg" className="mx-auto" />
        <h3 className="font-heading text-base font-bold text-emerald-700">Treatment Complete!</h3>
        <p className="text-xs text-emerald-600">
          Escrow funds will be released to your account.
        </p>
        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600">
          <ShieldCheck size={14} strokeWidth={1.5} /> Treatment confirmed
        </div>
        {readyForAdoption && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#6C5CE7]">
            <Heart size={14} strokeWidth={1.5} /> Approved for adoption — awaiting foster profile
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748] mb-4">
        <CircleCheck size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Complete Treatment
      </h3>

      <div className="space-y-4">
        {/* Outcome */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#2D3748]">Treatment Outcome</label>
          <select value={outcome} onChange={(e) => setOutcome(e.target.value as typeof outcome)} className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 text-sm text-[#2D3748] focus:border-[#6C5CE7] focus:outline-none">
            <option value="RECOVERED">Recovered</option>
            <option value="REFERRED">Referred to Specialist</option>
            <option value="DECEASED">Deceased</option>
          </select>
        </div>

        {/* Medical readiness fields */}
        {outcome === "RECOVERED" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#2D3748]">Vaccination</label>
                <select value={vaccination} onChange={(e) => setVaccination(e.target.value)} className="h-9 w-full rounded-[10px] border border-[#A788FA]/20 bg-white px-3 text-xs text-[#2D3748] focus:border-[#6C5CE7] focus:outline-none">
                  <option value="complete">Complete</option>
                  <option value="partial">Partial</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 h-9 cursor-pointer">
                  <input type="checkbox" checked={neutered} onChange={(e) => setNeutered(e.target.checked)} className="h-4 w-4 rounded border-[#A788FA]/30 text-[#6C5CE7] focus:ring-[#6C5CE7]" />
                  <span className="text-xs font-medium text-[#2D3748]">Neutered / Spayed</span>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#2D3748]">Special Needs (if any)</label>
              <input type="text" value={specialNeeds} onChange={(e) => setSpecialNeeds(e.target.value)} placeholder="e.g. requires daily medication" className="h-9 w-full rounded-[10px] border border-[#A788FA]/20 bg-white px-3 text-xs text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none" />
            </div>

            {/* Adoption approval */}
            <div className="rounded-[12px] border border-[#6C5CE7]/15 bg-[#6C5CE7]/[0.03] p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={readyForAdoption} onChange={(e) => setReadyForAdoption(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-[#A788FA]/30 text-[#6C5CE7] focus:ring-[#6C5CE7]" />
                <div>
                  <p className="text-sm font-semibold text-[#6C5CE7]">Approve for Adoption</p>
                  <p className="text-[11px] text-[#2D3748]/60 mt-0.5">
                    I confirm this cat is medically recovered, vaccinated, and ready for a permanent home. This is medical clearance only — the foster will complete the behavioural profile.
                  </p>
                </div>
              </label>
            </div>
          </>
        )}

        {/* Escrow notice */}
        <div className="rounded-[10px] bg-[#6C5CE7]/5 p-3">
          <p className="flex items-start gap-1.5 text-[11px] text-[#6C5CE7]">
            <ShieldCheck size={12} strokeWidth={1.5} className="mt-0.5 shrink-0" />
            Confirming completion will release escrow funds to your account.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-[10px] bg-red-50 border border-red-200 p-3">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={isPending}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <><LoaderCircle size={16} strokeWidth={2} className="animate-spin" /> Completing...</>
          ) : (
            <><CircleCheck size={16} strokeWidth={1.5} /> Confirm Completion</>
          )}
        </button>
      </div>
    </div>
  );
}
