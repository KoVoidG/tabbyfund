"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { WizardProgress } from "./WizardProgress";
import { PhotoUploader } from "./PhotoUploader";
import { AIAnalysisPreview } from "./AIAnalysisPreview";
import { LocationPicker } from "./LocationPicker";
import { RescueDetailsForm } from "./RescueDetailsForm";
import { ReviewCard } from "./ReviewCard";
import { SubmitSuccess } from "./SubmitSuccess";
import { useRescueDraft } from "../hooks/useRescueDraft";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

const TOTAL_STEPS = 5;

/**
 * RescueWizard — multi-step guided rescue reporting flow.
 * Manages step navigation, validation, and draft persistence.
 */
export function RescueWizard() {
  const { draft, saveDraft, clearDraft, hasSavedDraft, isLoaded, discardDraft } = useRescueDraft();
  const [step, setStep] = useState(draft.currentStep);
  const [submitted, setSubmitted] = useState(false);
  const [showDraftPrompt, setShowDraftPrompt] = useState(true);

  // Wait for localStorage to load
  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <TabbyMascot variant="sleep" size="md" />
        <p className="mt-3 text-sm text-[#2D3748]/60">Loading...</p>
      </div>
    );
  }

  // Draft restoration prompt
  if (hasSavedDraft && showDraftPrompt && step === 0 && !submitted) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center py-8">
        <TabbyMascot variant="think" size="lg" className="mx-auto" />
        <div>
          <h2 className="font-heading text-lg font-semibold text-[#2D3748]">
            Continue your rescue report?
          </h2>
          <p className="mt-1 text-sm text-[#2D3748]/60">
            You have an unfinished rescue report saved. Would you like to continue where you left off?
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setStep(draft.currentStep);
              setShowDraftPrompt(false);
            }}
            className="rounded-[12px] bg-[#6C5CE7] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A788FA]"
          >
            Continue Draft
          </button>
          <button
            onClick={() => {
              discardDraft();
              setShowDraftPrompt(false);
            }}
            className="rounded-[12px] border border-[#A788FA]/30 px-6 py-2.5 text-sm font-medium text-[#6C5CE7] transition hover:bg-[#6C5CE7]/5"
          >
            Start Fresh
          </button>
        </div>
      </div>
    );
  }

  // Submitted success
  if (submitted) {
    return <SubmitSuccess />;
  }

  function goNext() {
    const next = Math.min(step + 1, TOTAL_STEPS - 1);
    setStep(next);
    saveDraft({ currentStep: next });
  }

  function goBack() {
    const prev = Math.max(step - 1, 0);
    setStep(prev);
    saveDraft({ currentStep: prev });
  }

  function goToStep(s: number) {
    setStep(s);
    saveDraft({ currentStep: s });
  }

  function handleSubmit() {
    clearDraft();
    setSubmitted(true);
  }

  // Validation per step
  function canProceed(): boolean {
    switch (step) {
      case 0: return !!draft.photoDataUrl;
      case 1: return !!draft.aiResult;
      case 2: return !!draft.location;
      case 3: return !!draft.details?.notes;
      case 4: return true;
      default: return false;
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Progress */}
      <WizardProgress currentStep={step} onStepClick={goToStep} />

      {/* Step Content */}
      <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        {step === 0 && (
          <PhotoUploader
            photoDataUrl={draft.photoDataUrl}
            onPhotoChange={(url) => saveDraft({ photoDataUrl: url })}
          />
        )}
        {step === 1 && (
          <AIAnalysisPreview
            photoDataUrl={draft.photoDataUrl}
            aiResult={draft.aiResult}
            onAnalysisComplete={(result) => saveDraft({ aiResult: result })}
          />
        )}
        {step === 2 && (
          <LocationPicker
            location={draft.location}
            onLocationChange={(loc) => saveDraft({ location: loc })}
          />
        )}
        {step === 3 && (
          <RescueDetailsForm
            details={draft.details}
            onDetailsChange={(d) => saveDraft({ details: d })}
          />
        )}
        {step === 4 && (
          <ReviewCard draft={draft} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="flex items-center gap-1.5 rounded-[10px] px-4 py-2.5 text-sm font-medium text-[#2D3748]/60 transition hover:bg-[#F7F7FB] disabled:opacity-0"
        >
          <ArrowLeft size={16} strokeWidth={1.5} /> Back
        </button>

        {step < TOTAL_STEPS - 1 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed()}
            className="flex items-center gap-1.5 rounded-[12px] bg-[#6C5CE7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A788FA] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 rounded-[12px] bg-[#6C5CE7] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A788FA]"
          >
            Submit Rescue
          </button>
        )}
      </div>
    </div>
  );
}
