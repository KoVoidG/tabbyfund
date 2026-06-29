import Link from "next/link";
import { PawPrint, ArrowRight } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

/**
 * Landing page — simple TabbyFund intro with Login/Register CTAs.
 */
export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F7F7FB] px-4 py-12">
      <div className="w-full max-w-md space-y-8 text-center">
        <TabbyMascot variant="wave" size="xl" className="mx-auto" />

        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <PawPrint size={24} strokeWidth={1.5} className="text-[#6C5CE7]" />
            <h1 className="font-heading text-3xl font-bold text-[#6C5CE7]">TabbyFund</h1>
          </div>
          <p className="text-sm text-[#2D3748]/60 max-w-xs mx-auto">
            Community-powered rescue for stray cats. Report, fund, treat, foster, adopt — one platform.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#6C5CE7] text-sm font-semibold text-white transition hover:bg-[#A788FA] active:scale-[0.98]"
          >
            Sign In <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
          <Link
            href="/register"
            className="flex h-12 w-full items-center justify-center rounded-[14px] border border-[#A788FA]/30 text-sm font-medium text-[#6C5CE7] transition hover:bg-[#6C5CE7]/5"
          >
            Create Account
          </Link>
        </div>

        <p className="text-[10px] text-[#2D3748]/40">
          Every injured stray cat deserves a chance.
        </p>
      </div>
    </div>
  );
}
