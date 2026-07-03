"use client";

import { useTransition } from "react";
import { Heart, LoaderCircle } from "lucide-react";
import { adoptCat } from "@/features/adoption/actions";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

interface ApplicationCTAProps {
  caseId: string;
  catName: string;
}

/**
 * ApplicationCTA — adoption interest prompt.
 * Enables the user to adopt the cat and matches it to their profile.
 */
export function ApplicationCTA({ caseId, catName }: ApplicationCTAProps) {
  const [isPending, startTransition] = useTransition();

  function handleAdopt() {
    startTransition(async () => {
      const result = await adoptCat(caseId);
      if (result.success) {
        window.location.href = `/cases/${caseId}`;
      } else {
        alert(result.error ?? "Failed to finalize adoption. Please try again.");
      }
    });
  }

  return (
    <div className="rounded-[16px] border border-[#6C5CE7]/20 bg-gradient-to-br from-[#6C5CE7]/5 to-[#A788FA]/5 p-6 text-center space-y-4">
      <TabbyMascot variant="love" size="md" className="mx-auto" />
      <div>
        <h3 className="font-heading text-base font-bold text-[#2D3748]">
          Interested in adopting {catName}?
        </h3>
        <p className="mt-1 text-xs text-[#2D3748]/60">
          Ready to give {catName} a loving forever home? Click below to finalize the adoption.
        </p>
      </div>
      <button
        onClick={handleAdopt}
        disabled={isPending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#6C5CE7] to-[#A788FA] text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60 shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
      >
        {isPending ? (
          <><LoaderCircle size={18} strokeWidth={2} className="animate-spin" /> Finalizing Adoption...</>
        ) : (
          <><Heart size={18} strokeWidth={1.5} /> Adopt {catName} Now</>
        )}
      </button>
      <p className="text-[10px] text-[#2D3748]/40">
        Completing this action will match this cat to you and close the active rescue timeline.
      </p>
    </div>
  );
}
