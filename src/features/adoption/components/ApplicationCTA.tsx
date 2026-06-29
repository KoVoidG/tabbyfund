import { Heart } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

interface ApplicationCTAProps {
  catName: string;
}

/**
 * ApplicationCTA — adoption application call-to-action.
 */
export function ApplicationCTA({ catName }: ApplicationCTAProps) {
  return (
    <div className="rounded-[16px] border border-[#6C5CE7]/20 bg-gradient-to-br from-[#6C5CE7]/5 to-[#A788FA]/5 p-6 text-center space-y-4">
      <TabbyMascot variant="love" size="md" className="mx-auto" />
      <div>
        <h3 className="font-heading text-base font-bold text-[#2D3748]">
          Ready to adopt {catName}?
        </h3>
        <p className="mt-1 text-xs text-[#2D3748]/60">
          Fill out a short application and our team will get back to you within 24 hours.
        </p>
      </div>
      <button className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#6C5CE7] to-[#A788FA] text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] shadow-[0_4px_12px_rgba(108,92,231,0.3)]">
        <Heart size={18} strokeWidth={1.5} /> Apply to Adopt
      </button>
    </div>
  );
}
