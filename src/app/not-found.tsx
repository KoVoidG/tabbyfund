"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PawPrint } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { PawBackground } from "@/components/ui/PawBackground";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    document.title = "404 Not Found — TabbyFund";
  }, []);

  return (
    <section className="relative h-dvh overflow-hidden bg-[#F7F7FB] text-[#25324B] flex flex-col items-center justify-center">
      <PawBackground density="low" />

      {/* Subtle radial glow centering on the content */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(108,92,231,0.06),transparent_50%)]" />

      <div className="relative z-10 flex h-full items-center justify-center px-6 py-6 w-full">
        <div className="w-full max-w-xl text-center flex flex-col items-center justify-center">
          {/* Mascot */}
          <TabbyMascot
            variant="404"
            size="xl"
            className="drop-shadow-[0_8px_20px_rgba(108,92,231,0.08)] mb-2"
          />

          {/* Rescue trail badge */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#EEE9FF] px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-[#6C5CE7] select-none">
            <PawPrint size={10} strokeWidth={2.5} className="fill-[#6C5CE7]" />
            Rescue trail not found
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl font-heading leading-tight max-w-md">
            Tabby lost the
            <span className="block text-[#6C5CE7] mt-0.5">rescue trail.</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-3 max-w-md text-xs font-medium leading-relaxed text-[#6F7895] md:text-sm">
            This page doesn’t exist, but every rescue still has a way home.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row w-full max-w-sm sm:max-w-none px-4 sm:px-0">
            <button
              onClick={() => router.back()}
              className="flex h-12 sm:w-48 items-center justify-center gap-2 rounded-full bg-[#6C5CE7] px-6 text-sm font-bold text-white shadow-[0_12px_24px_rgba(108,92,231,0.16)] hover:bg-[#5B4BE2] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Take Tabby Home
            </button>

            <Link
              href="/cases"
              className="flex h-12 sm:w-48 items-center justify-center gap-2 rounded-full border border-[#6C5CE7]/20 bg-white/80 backdrop-blur-xs px-6 text-sm font-bold text-[#6C5CE7] hover:bg-[#EEE9FF] hover:border-[#6C5CE7]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Browse Rescue Cases
            </Link>
          </div>

          {/* Trust Note Card */}
          <div className="mx-auto mt-8 w-full max-w-md rounded-3xl border border-[#ECE9F6] bg-white/85 p-4 text-left shadow-sm backdrop-blur-sm select-none">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#6C5CE7]">
              Community powered
            </p>
            <p className="mt-1 text-[11px] sm:text-xs font-semibold text-[#6F7895] leading-normal">
              Every rescue on TabbyFund is tracked from report to treatment to
              adoption.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
