"use client";

import { useState, useTransition } from "react";
import { Heart, LoaderCircle } from "lucide-react";
import { adoptCat } from "@/features/adoption/actions";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import Link from "next/link";

interface ApplicationCTAProps {
  caseId: string;
  catName: string;
  initiallyAdopted?: boolean;
}

/**
 * ApplicationCTA — adoption interest prompt.
 * Enables the user to adopt the cat and matches it to their profile.
 */
export function ApplicationCTA({ caseId, catName, initiallyAdopted = false }: ApplicationCTAProps) {
  const [isPending, startTransition] = useTransition();
  const [adopted, setAdopted] = useState(false);

  const showSuccess = adopted || initiallyAdopted;

  function handleAdopt() {
    startTransition(async () => {
      const result = await adoptCat(caseId);
      if (result.success) {
        setAdopted(true);
      } else {
        alert(result.error ?? "Failed to finalize adoption. Please try again.");
      }
    });
  }

  return (
    <>
      {!showSuccess && (
        <div className="rounded-[16px] border border-[#6C5CE7]/20 bg-gradient-to-br from-[#6C5CE7]/5 to-[#A788FA]/5 p-6 text-center space-y-4">
          <TabbyMascot variant="love" size="md" className="mx-auto" />
          <div>
            <h3 className="text-base font-bold text-[#2D3748]">
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
      )}

      {/* Post-Adoption Success Celebration Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2940]/60 backdrop-blur-xs p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 max-w-sm w-full text-center space-y-6 shadow-[0_20px_50px_rgba(108,92,231,0.15)] animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <TabbyMascot variant="celebrate" size="lg" className="mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#2D3748] tracking-tight">
                Yay! You adopted {catName}! 🐾
              </h3>
              <p className="text-xs font-semibold text-[#6C5CE7]">
                A tiny heart just found a forever home.
              </p>
              <p className="text-xs text-[#2D3748]/60 leading-relaxed max-w-[280px] mx-auto">
                Thank you for giving this cat a safe and loving home.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/cases"
                className="flex h-12 w-full items-center justify-center rounded-[14px] bg-gradient-to-r from-[#6C5CE7] to-[#A788FA] text-sm font-bold text-white transition hover:opacity-90 active:scale-[0.98] shadow-[0_4px_12px_rgba(108,92,231,0.25)]"
              >
                Rescue More Cats
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
