"use client";

import { ReactNode } from "react";
import { PawPrint, Heart } from "lucide-react";
import { TabbyMascot, MascotVariant } from "@/components/branding/TabbyMascot";

interface AuthSplitLayoutProps {
  children: ReactNode;
  mascotVariant?: MascotVariant;
  headline?: ReactNode;
  subtitle?: string;
  factText?: string;
}

export function AuthSplitLayout({
  children,
  mascotVariant = "love",
  headline,
  subtitle,
  factText,
}: AuthSplitLayoutProps) {
  // Resolve defaults based on mascotVariant or explicit props
  const resolvedHeadline = headline || "Welcome back, hero.";
  
  const resolvedSubtitle = subtitle || (
    mascotVariant === "think" 
      ? "We'll help you get back to rescuing cats." 
      : mascotVariant === "celebrate"
      ? "Regain access to your rescuer account."
      : "The next rescue is waiting for you."
  );

  const resolvedFactText = factText || (
    mascotVariant === "think"
      ? "Security Notice: Security recovery links expire after exactly 1 hour to protect stray animal histories and fundraiser records."
      : mascotVariant === "celebrate"
      ? "Tip: Choose a strong, unique password to ensure your rescuer account and case reports remain secure."
      : "Rescue Fact: Stray cat populations can be managed humanely through Trap-Neuter-Return (TNR). Every report you file maps critical distress hot spots!"
  );

  return (
    <div className="flex min-h-dvh items-stretch bg-[#FCFBFE] relative overflow-hidden w-full text-[#25324B]">
      {/* Background Illustrated Blobs (Low Opacity) */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-[#FFD8A8]/10 rounded-full blur-xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#6C5CE7]/3 rounded-full blur-2xl pointer-events-none -z-10" />
      
      {/* Subtle paw print vectors floating */}
      <div className="absolute top-1/4 right-[42%] opacity-[0.3] text-[#6C5CE7] pointer-events-none rotate-12 hidden md:block -z-0">
        <PawPrintsIcon size={120} />
      </div>
      <div className="absolute bottom-12 right-[1%] opacity-[0.3] text-[#6C5CE7] pointer-events-none -rotate-12 hidden md:block -z-0">
        <PawPrintsIcon size={160} />
      </div>

      {/* Left panel: Desktop Handcrafted Storytelling Panel */}
      <div className="hidden md:flex md:w-[45%] lg:w-[50%] flex-col justify-between bg-[#F7F7FB] p-10 relative overflow-hidden border-r border-[rgba(108,92,231,.10)] shrink-0">
        {/* Background decorations for left panel */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#FFD8A8]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#6C5CE7]/3 rounded-full blur-3xl pointer-events-none" />
        
        {/* Logo header */}
        <div className="flex items-center gap-2 z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C5CE7]/8 text-[#6C5CE7]">
            <PawPrint size={18} strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight text-[#25324B]">TabbyFund</span>
        </div>

        {/* Mascot Spotlight Scene */}
        <div className="flex flex-col items-center justify-center flex-1 text-center space-y-6 z-10 max-w-sm mx-auto my-8">
          <div className="relative">
            {/* Spotlight backdrop */}
            <div className="absolute inset-0 bg-linear-to-br from-[#FFD8A8]/20 to-[#6C5CE7]/6 rounded-full scale-125 blur-2xl pointer-events-none" />
            
            {/* Mascot Character */}
            <TabbyMascot variant={mascotVariant} size="xl" className="relative z-10 drop-shadow-[0_12px_24px_rgba(108,92,231,0.08)] hover:scale-103 transition-transform duration-500" />
            
            {/* Organic Ground Shadow */}
            <div className="w-28 h-2 bg-[#25324B]/5 rounded-full blur-[2px] mt-2.5 mx-auto animate-pulse" />
            
            {/* Handcrafted floating details */}
            <span className="absolute top-2 left-2 text-[#FF8B7B] opacity-80 text-xs animate-bounce" style={{ animationDuration: "3s" }}>❤️</span>
            <span className="absolute top-1/2 -right-4 text-[#FFD8A8] opacity-90 text-sm">✨</span>
            <span className="absolute bottom-4 left-6 text-[#6C5CE7]/30 text-xs">🐾</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold leading-tight text-[#25324B]">{resolvedHeadline}</h2>
            <p className="text-xs sm:text-sm text-[#6F7895] leading-relaxed font-medium">
              {resolvedSubtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Fact Banner Card */}
        <div className="flex flex-col gap-3 z-10">
          <div className="bg-white/80 border border-[rgba(108,92,231,.08)] rounded-2xl p-4 shadow-[0_8px_20px_rgba(108,92,231,0.02)]">
            <p className="text-[11px] font-medium leading-relaxed text-[#6F7895]">
              {resolvedFactText}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#6F7895]/60 font-semibold">
            <Heart size={10} className="text-[#FF8B7B] fill-[#FF8B7B]" />
            <span>Crafted with love by cat rescue advocates</span>
          </div>
        </div>
      </div>

      {/* Right panel: Form Card Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 relative">
        <div className="w-full max-w-[440px] space-y-6">
          {/* Mobile Logo Branding */}
          <div className="flex flex-col items-center text-center md:hidden mb-4">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C5CE7]/6 text-[#6C5CE7]">
              <PawPrint size={24} strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-[#25324B] tracking-tight">TabbyFund</h1>
            <p className="text-xs text-[#6F7895] font-semibold mt-0.5">Community-powered cat rescue</p>
          </div>

          {/* Form surface container */}
          <div className="rounded-[24px] bg-white border border-[rgba(108,92,231,.10)] p-6 sm:p-8 shadow-[0_20px_60px_rgba(108,92,231,0.06)] relative overflow-hidden">
            {/* Barely visible decorative heart background */}
            <div className="absolute -bottom-4 -right-4 text-[#FF8B7B]/5 text-6xl pointer-events-none select-none">❤️</div>
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PawPrintsIcon({ size = 24, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 4.5 1-1 3-2.5 3-4.5 0-1.66-1.34-3-3-3zm-4.5-3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm9 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-6.5-4c-.83 0-1.5.67-1.5 1.5S9.17 10 10 10s1.5-.67 1.5-1.5S10.83 7 10 7zm4 0c-.83 0-1.5.67-1.5 1.5S13.17 10 14 10s1.5-.67 1.5-1.5S14.83 7 14 7z"/>
    </svg>
  );
}
