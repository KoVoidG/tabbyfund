"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { WizardProgress } from "./WizardProgress";
import { PhotoUploader } from "./PhotoUploader";
import { AIAnalysisPreview } from "./AIAnalysisPreview";
import { LocationPicker } from "./LocationPicker";
import { RescueDetailsForm } from "./RescueDetailsForm";
import { ReviewCard } from "./ReviewCard";
import { SubmitSuccess } from "./SubmitSuccess";
import { useRescueDraft } from "../hooks/useRescueDraft";
import { submitRescueReport } from "../actions";
import { deleteUploadedPhoto } from "../lib/upload-photo";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

const TOTAL_STEPS = 5;

/**
 * RescueWizard — multi-step guided rescue reporting flow.
 * Manages step navigation, validation, and draft persistence.
 */
export function RescueWizard() {
  const router = useRouter();
  const { draft, saveDraft, clearDraft, hasSavedDraft, isLoaded, discardDraft } = useRescueDraft();
  const [step, setStep] = useState(draft.currentStep);
  const [submitted, setSubmitted] = useState(false);

  async function handleCancel() {
    if (draft.storagePath) {
      try {
        await deleteUploadedPhoto(draft.storagePath);
      } catch (err) {
        console.error("Failed to delete draft photo during cancellation:", err);
      }
    }
    discardDraft();
    router.push("/dashboard");
  }
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
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
          <h2 className="text-lg font-semibold text-[#2D3748]">
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
    return <SubmitSuccess caseId={createdCaseId} />;
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
    setSubmitError(null);
    startTransition(async () => {
      if (!draft.photoUrl || !draft.aiResult || !draft.location || !draft.details) {
        setSubmitError("Missing required information. Please go back and complete all steps.");
        return;
      }

      const result = await submitRescueReport({
        photoUrl: draft.photoUrl,
        storagePath: draft.storagePath ?? "",
        aiResult: draft.aiResult,
        location: draft.location,
        details: draft.details,
        canTransport: draft.canTransport ?? false,
      });

      if (result.success && result.caseId) {
        clearDraft();
        setCreatedCaseId(result.caseId);
        setSubmitted(true);
      } else {
        setSubmitError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  // Validation per step
  function canProceed(): boolean {
    switch (step) {
      case 0: return !!draft.photoUrl;
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
            photoUrl={draft.photoUrl}
            storagePath={draft.storagePath}
            previewUrl={draft.previewUrl}
            onPhotoUploaded={(data) => {
              if (data) {
                saveDraft({ photoUrl: data.photoUrl, storagePath: data.storagePath, previewUrl: data.previewUrl });
              } else {
                saveDraft({ photoUrl: undefined, storagePath: undefined, previewUrl: undefined });
              }
            }}
          />
        )}
        {step === 1 && (
          <AIAnalysisPreview
            photoDataUrl={draft.previewUrl ?? draft.photoUrl}
            storagePath={draft.storagePath}
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
            canTransport={draft.canTransport}
            onCanTransportChange={(v) => saveDraft({ canTransport: v })}
          />
        )}
        {step === 4 && (
          <ReviewCard draft={draft} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {step < TOTAL_STEPS - 1 ? (
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-1.5 rounded-[10px] px-4 py-2.5 text-sm font-medium text-[#2D3748]/60 transition hover:bg-[#F7F7FB] disabled:opacity-0"
          >
            <ArrowLeft size={16} strokeWidth={1.5} /> Back
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1.5 rounded-[10px] bg-red-50 text-red-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-red-100"
          >
            Cancel
          </button>
        )}

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
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-[12px] bg-[#6C5CE7] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A788FA] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <LoaderCircle size={16} strokeWidth={2} className="animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </button>
        )}
      </div>

      {/* Error message */}
      {submitError && (
        <div className="rounded-[10px] bg-red-50 border border-red-200 p-3">
          <p className="text-xs text-red-700">{submitError}</p>
        </div>
      )}
    </div>
  );
}
