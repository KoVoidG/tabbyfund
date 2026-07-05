"use client";

import { useTransition } from "react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { LoaderCircle, LogOut, UserCheck } from "lucide-react";
import { convertRejectedVetToCommunity } from "../actions";

export function RejectedVetScreen() {
  const [isPending, startTransition] = useTransition();

  function handleConvert() {
    startTransition(async () => {
      try {
        await convertRejectedVetToCommunity();
        window.location.href = "/dashboard";
      } catch (err) {
        alert("Failed to update profile. Please try again.");
      }
    });
  }

  async function handleGoBack() {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (err) {
      window.location.href = "/";
    }
  }

  return (
    <div className="mx-auto max-w-md py-12 px-4 text-center flex flex-col items-center justify-center min-h-[70vh] space-y-6">
      <TabbyMascot variant="sad" size="xl" className="mx-auto animate-bounce-slow" />
      
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-[#2D3748] tracking-tight">
          Sorry, your vet registration was not approved
        </h1>
        <p className="text-sm text-[#2D3748]/60">
          Your account cannot continue as a verified vet at this time.
        </p>
      </div>

      <div className="rounded-[16px] border border-[#6C5CE7]/15 bg-[#6C5CE7]/[0.02] p-5 space-y-4 max-w-sm">
        <p className="text-xs font-semibold text-[#6C5CE7] leading-relaxed">
          Would you like to register as a community member instead?
        </p>
        <p className="text-[11px] text-[#2D3748]/50 leading-normal">
          This lets you report strays, request transport support, and sponsor rescue cases on TabbyFund.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs pt-2">
        <button
          onClick={handleConvert}
          disabled={isPending}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#6C5CE7] to-[#A788FA] text-sm font-bold text-white transition hover:opacity-95 active:scale-[0.98] disabled:opacity-60 shadow-[0_4px_12px_rgba(108,92,231,0.2)]"
        >
          {isPending ? (
            <><LoaderCircle size={16} strokeWidth={2.5} className="animate-spin" /> Updating Profile...</>
          ) : (
            <><UserCheck size={16} strokeWidth={1.5} /> Yes, register as community</>
          )}
        </button>

        <button
          onClick={handleGoBack}
          disabled={isPending}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-[#A788FA]/20 bg-white text-sm font-bold text-[#2D3748]/75 transition hover:bg-[#6C5CE7]/5 active:scale-[0.98] disabled:opacity-60"
        >
          <LogOut size={16} strokeWidth={1.5} /> No, go back
        </button>
      </div>
    </div>
  );
}
