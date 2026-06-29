import { ShieldCheck, Lock, Stethoscope, CircleCheck } from "lucide-react";

/**
 * EscrowExplainer — simple visual explanation of TabbyFund's escrow model.
 * Judge-friendly: clearly shows money → escrow → vet confirmation → release.
 */
export function EscrowExplainer() {
  return (
    <div className="rounded-[12px] bg-[#6C5CE7]/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} strokeWidth={1.5} className="text-[#6C5CE7]" />
        <p className="text-xs font-semibold text-[#6C5CE7]">How your donation is protected</p>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-[#2D3748]/70">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6C5CE7]/10">
            <Lock size={12} strokeWidth={1.5} className="text-[#6C5CE7]" />
          </div>
          <span>Escrow</span>
        </div>
        <div className="h-0.5 flex-1 bg-[#A788FA]/20 rounded-full" />
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6C5CE7]/10">
            <Stethoscope size={12} strokeWidth={1.5} className="text-[#6C5CE7]" />
          </div>
          <span>Treatment</span>
        </div>
        <div className="h-0.5 flex-1 bg-[#A788FA]/20 rounded-full" />
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6C5CE7]/10">
            <CircleCheck size={12} strokeWidth={1.5} className="text-[#6C5CE7]" />
          </div>
          <span>Released</span>
        </div>
      </div>
      <p className="text-[10px] text-[#2D3748]/50 leading-relaxed">
        Funds are held in escrow until a verified vet confirms treatment completion. Money goes directly to the vet — never the reporter or volunteer.
      </p>
    </div>
  );
}
