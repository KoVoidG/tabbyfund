import { Camera, Brain, MapPin, FileText } from "lucide-react";
import type { RescueDraft } from "../hooks/useRescueDraft";

interface ReviewCardProps {
  draft: RescueDraft;
}

/**
 * ReviewCard — Step 5 of the rescue wizard.
 * Summarizes all collected information before submission.
 */
export function ReviewCard({ draft }: ReviewCardProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-base font-semibold text-[#2D3748]">
        Review Your Report
      </h2>
      <p className="text-sm text-[#2D3748]/60">
        Please review all details before submitting.
      </p>

      {/* Photo */}
      <div className="rounded-[12px] border border-[#A788FA]/10 overflow-hidden">
        <div className="flex items-center gap-2 bg-[#F7F7FB] px-4 py-2 border-b border-[#A788FA]/10">
          <Camera size={14} strokeWidth={1.5} className="text-[#6C5CE7]" />
          <span className="text-xs font-medium text-[#2D3748]">Photo</span>
        </div>
        {(draft.previewUrl || draft.photoUrl) && (
          <img src={draft.previewUrl ?? draft.photoUrl} alt="Rescue" className="w-full h-40 object-cover" />
        )}
      </div>

      {/* AI */}
      {draft.aiResult && (
        <div className="rounded-[12px] border border-[#A788FA]/10 overflow-hidden">
          <div className="flex items-center gap-2 bg-[#F7F7FB] px-4 py-2 border-b border-[#A788FA]/10">
            <Brain size={14} strokeWidth={1.5} className="text-[#6C5CE7]" />
            <span className="text-xs font-medium text-[#2D3748]">AI Assessment</span>
          </div>
          <div className="p-4 space-y-1.5">
            <p className="text-sm font-semibold text-[#2D3748]">{draft.aiResult.condition}</p>
            <p className="text-xs text-[#2D3748]/60">
              Severity: {draft.aiResult.severity} · Confidence: {draft.aiResult.confidence}%
            </p>
          </div>
        </div>
      )}

      {/* Location */}
      {draft.location && (
        <div className="rounded-[12px] border border-[#A788FA]/10 overflow-hidden">
          <div className="flex items-center gap-2 bg-[#F7F7FB] px-4 py-2 border-b border-[#A788FA]/10">
            <MapPin size={14} strokeWidth={1.5} className="text-[#6C5CE7]" />
            <span className="text-xs font-medium text-[#2D3748]">Location</span>
          </div>
          <div className="p-4">
            <p className="text-sm text-[#2D3748]">{draft.location.address}</p>
          </div>
        </div>
      )}

      {/* Details */}
      {draft.details && (
        <div className="rounded-[12px] border border-[#A788FA]/10 overflow-hidden">
          <div className="flex items-center gap-2 bg-[#F7F7FB] px-4 py-2 border-b border-[#A788FA]/10">
            <FileText size={14} strokeWidth={1.5} className="text-[#6C5CE7]" />
            <span className="text-xs font-medium text-[#2D3748]">Details</span>
          </div>
          <div className="p-4 space-y-2 text-sm text-[#2D3748]/80">
            {draft.details.notes && <p>{draft.details.notes}</p>}
            {draft.details.approximateAge && <p className="text-xs text-[#2D3748]/50">Age: {draft.details.approximateAge}</p>}
            {draft.details.visibleInjuries && <p className="text-xs text-[#2D3748]/50">Injuries: {draft.details.visibleInjuries}</p>}
            {draft.details.behaviour && <p className="text-xs text-[#2D3748]/50">Behaviour: {draft.details.behaviour}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
