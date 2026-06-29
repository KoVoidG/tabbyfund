import Link from "next/link";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { Heart, ArrowRight } from "lucide-react";

/**
 * SubmitSuccess — shown after successful rescue report submission.
 */
export function SubmitSuccess() {
  return (
    <div className="mx-auto max-w-md space-y-6 text-center py-8">
      <TabbyMascot variant="celebrate" size="xl" className="mx-auto" />

      <div>
        <h2 className="font-heading text-xl font-bold text-[#2D3748]">
          Rescue Reported Successfully!
        </h2>
        <p className="mt-2 text-sm text-[#2D3748]/60 flex items-center justify-center gap-1">
          Thank you for helping this cat <Heart size={14} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </p>
      </div>

      <div className="rounded-[12px] bg-[#6C5CE7]/5 p-4">
        <p className="text-xs text-[#6C5CE7] leading-relaxed">
          Your report has been submitted. Our AI will assess the situation and volunteers will be notified. You&apos;ll receive updates on this rescue.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <Link
          href="/cases"
          className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition hover:bg-[#A788FA]"
        >
          View Rescue Feed <ArrowRight size={16} strokeWidth={1.5} />
        </Link>
        <Link
          href="/dashboard"
          className="flex h-11 items-center justify-center rounded-[12px] border border-[#A788FA]/20 text-sm font-medium text-[#6C5CE7] transition hover:bg-[#6C5CE7]/5"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
