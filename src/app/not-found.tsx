import Link from "next/link";
import { PawPrint, ArrowLeft } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

/**
 * Global 404 page — shown when a route doesn't exist.
 * Uses the confused mascot for a friendly, on-brand experience.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F7F7FB] px-4 py-12">
      <div className="w-full max-w-md space-y-6 text-center">
        <TabbyMascot variant="confused" size="xl" className="mx-auto" />

        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3748]">
            Page Not Found
          </h1>
          <p className="mt-2 text-sm text-[#2D3748]/60">
            Oops! This cat wandered somewhere we couldn&apos;t find.
          </p>
          <p className="mt-1 text-xs text-[#2D3748]/40">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/dashboard"
            className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition hover:bg-[#A788FA]"
          >
            <PawPrint size={16} strokeWidth={1.5} /> Go to Dashboard
          </Link>
          <Link
            href="/login"
            className="flex h-11 items-center justify-center gap-2 rounded-[12px] border border-[#A788FA]/30 text-sm font-medium text-[#6C5CE7] transition hover:bg-[#6C5CE7]/5"
          >
            <ArrowLeft size={16} strokeWidth={1.5} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
