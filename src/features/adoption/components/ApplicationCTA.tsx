import { Heart, MessageCircle } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

interface ApplicationCTAProps {
  caseId: string;
  catName: string;
}

/**
 * ApplicationCTA — adoption interest prompt.
 * Since the schema has no adoption_applications table,
 * this shows a "Contact Shelter" message rather than a fake application flow.
 */
export function ApplicationCTA({ caseId, catName }: ApplicationCTAProps) {
  return (
    <div className="rounded-[16px] border border-[#6C5CE7]/20 bg-gradient-to-br from-[#6C5CE7]/5 to-[#A788FA]/5 p-6 text-center space-y-4">
      <TabbyMascot variant="love" size="md" className="mx-auto" />
      <div>
        <h3 className="font-heading text-base font-bold text-[#2D3748]">
          Interested in adopting {catName}?
        </h3>
        <p className="mt-1 text-xs text-[#2D3748]/60">
          Contact our shelter team to start the adoption process. We&apos;ll help match you with this cat.
        </p>
      </div>
      <button
        disabled
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#6C5CE7] to-[#A788FA] text-sm font-semibold text-white opacity-80 cursor-not-allowed shadow-[0_4px_12px_rgba(108,92,231,0.3)]"
      >
        <MessageCircle size={18} strokeWidth={1.5} /> Contact Shelter (Coming Soon)
      </button>
      <p className="text-[10px] text-[#2D3748]/40">
        Adoption applications will be available in a future update.
      </p>
    </div>
  );
}
