"use client";

import Link from "next/link";
import Image from "next/image";
import { PawPrint, ArrowRight, ShieldCheck, Heart, Stethoscope, Compass, Truck, Sparkles, HandCoins, Home, Check } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { PawBackground } from "@/components/ui/PawBackground";

export default function LandingPage() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-dvh bg-[#F7F7FB] relative overflow-hidden flex flex-col justify-between text-[#25324B] selection:bg-[#EEE9FF] selection:text-[#6C5CE7]">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#6C5CE7]/3 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FF8B7B]/3 rounded-full blur-3xl pointer-events-none -z-10" />

      <PawBackground density="medium" />

      <main className="relative z-10 flex flex-col justify-between flex-1">

      {/* Navigation Header */}
      <header className="max-w-6xl w-full mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C5CE7]/8 text-[#6C5CE7]">
            <PawPrint size={20} strokeWidth={2.5} />
          </div>
          <span className="font-heading text-lg font-black tracking-tight text-[#25324B]">TabbyFund</span>
        </div>
        
        {/* Navigation links with smooth scrolling */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-[#6F7895]">
          <a href="#how-it-works" onClick={(e) => handleScroll(e, "how-it-works")} className="hover:text-[#6C5CE7] transition-colors">How it works</a>
          <a href="#impact" onClick={(e) => handleScroll(e, "impact")} className="hover:text-[#6C5CE7] transition-colors">Impact</a>
          <a href="#for-vets" onClick={(e) => handleScroll(e, "for-vets")} className="hover:text-[#6C5CE7] transition-colors">For Vets</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-bold text-[#6F7895] hover:text-[#6C5CE7] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#6C5CE7] px-5 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(108,92,231,0.15)] hover:bg-[#5B4BE2] hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            Join Us
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl w-full mx-auto px-6 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-12 z-10">
        {/* Left Hero: Text and features */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#6C5CE7]/6 px-3.5 py-1 text-xs font-bold text-[#6C5CE7]">
            <Heart size={12} className="fill-[#6C5CE7] text-[#6C5CE7]" /> Together, we save lives
          </div>
          
          <h1 className="font-heading text-4xl sm:text-5xl md:text-[52px] font-black text-[#25324B] leading-[1.08] tracking-tight">
            Every stray <br />
            deserves <br />
            <span className="text-[#6C5CE7]">a second chance.</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#6F7895] leading-relaxed max-w-sm mx-auto md:mx-0 font-semibold">
            TabbyFund connects cat lovers, rescuers and verified veterinarians to report, treat, foster and rehome stray cats in need.
          </p>

          {/* Checklist */}
          <div className="space-y-2.5 max-w-xs mx-auto md:mx-0 text-left pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#6F7895]">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7]">
                <Check size={12} strokeWidth={3} />
              </div>
              <span>Report emergencies in seconds</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#6F7895]">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7]">
                <Check size={12} strokeWidth={3} />
              </div>
              <span>Fund verified treatments transparently</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#6F7895]">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7]">
                <Check size={12} strokeWidth={3} />
              </div>
              <span>Find loving fosters and forever homes</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#6F7895]">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7]">
                <Check size={12} strokeWidth={3} />
              </div>
              <span>Community-powered, vet-verified</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
            <Link
              href="/register"
              className="flex h-12 w-full sm:w-auto px-7 items-center justify-center gap-2 rounded-full bg-[#6C5CE7] text-xs font-bold text-white shadow-[0_12px_24px_rgba(108,92,231,0.15)] hover:bg-[#5B4BE2] hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Start Rescuing Now <ArrowRight size={14} />
            </Link>
            <a
              href="#how-it-works"
              onClick={(e) => handleScroll(e, "how-it-works")}
              className="flex h-12 w-full sm:w-auto px-7 items-center justify-center rounded-full border border-[rgba(108,92,231,.15)] bg-white text-xs font-bold text-[#6F7895] hover:bg-[#6C5CE7]/5 transition"
            >
              Learn How It Works
            </a>
          </div>
        </div>

        {/* Right Hero: Large mascot illustration */}
        <div className="flex-1 flex justify-center items-center relative">
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-white/40 rounded-full blur-3xl -z-10" />
          <div className="relative group">
            <Image
              src="/mascot/welcome2.png"
              alt="TabbyFund Mascot Rescue Scene"
              width={540}
              height={460}
              className="relative z-10 drop-shadow-[0_12px_36px_rgba(108,92,231,0.08)] group-hover:scale-[1.02] transition-transform duration-500"
              priority
            />
          </div>
        </div>
      </section>

      {/* Stats Cards Row */}
      <section id="impact" className="max-w-6xl w-full mx-auto px-6 py-6 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[rgba(108,92,231,.08)] shadow-[0_10px_35px_rgba(108,92,231,0.03)] hover:scale-102 transition-transform">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6C5CE7]/6 text-[#6C5CE7]">
                <PawPrint size={18} />
              </div>
              <div>
                <p className="text-lg font-black text-[#25324B]">1,248+</p>
                <p className="text-[10px] text-[#6F7895] font-semibold mt-0.5">Injured Cats Rescued</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[rgba(108,92,231,.08)] shadow-[0_10px_35px_rgba(108,92,231,0.03)] hover:scale-102 transition-transform">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#35C79A]/8 text-[#35C79A]">
                <Stethoscope size={18} />
              </div>
              <div>
                <p className="text-lg font-black text-[#25324B]">312+</p>
                <p className="text-[10px] text-[#6F7895] font-semibold mt-0.5">Verified Vets</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[rgba(108,92,231,.08)] shadow-[0_10px_35px_rgba(108,92,231,0.03)] hover:scale-102 transition-transform">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFD8A8]/15 text-[#FF8B7B]">
                <Home size={18} />
              </div>
              <div>
                <p className="text-lg font-black text-[#25324B]">856+</p>
                <p className="text-[10px] text-[#6F7895] font-semibold mt-0.5">Fosters & Volunteers</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[rgba(108,92,231,.08)] shadow-[0_10px_35px_rgba(108,92,231,0.03)] hover:scale-102 transition-transform">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF8B7B]/8 text-[#FF8B7B]">
                <Heart size={18} className="fill-[#FF8B7B]" />
              </div>
              <div>
                <p className="text-lg font-black text-[#25324B]">642+</p>
                <p className="text-[10px] text-[#6F7895] font-semibold mt-0.5">Cats Adopted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works journey timeline */}
      <section id="how-it-works" className="bg-white border-y border-[rgba(108,92,231,.10)] py-16 z-10 relative">
        {/* Running mascot decor at the bottom left with a dashed route */}
        <div className="absolute bottom-4 left-6 hidden lg:flex items-center gap-3 opacity-90">
          <div className="relative">
            <TabbyMascot variant="wave" size="sm" className="-rotate-12" />
            <div className="w-8 h-1 bg-slate-950/5 rounded-full blur-[1px] absolute -bottom-0.5 left-1.5" />
          </div>
          <span className="text-[9px] text-[#6F7895] font-bold border border-dashed border-[#6C5CE7]/30 rounded-full px-3 py-1">
            Let&apos;s go! 🐾
          </span>
        </div>

        <div className="max-w-6xl w-full mx-auto px-6 space-y-12">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h2 className="font-heading text-2xl font-black text-[#25324B]">How TabbyFund works</h2>
            <p className="text-xs text-[#6F7895] font-semibold">
              Our community collaboration model helps stray cats recover and find safety.
            </p>
          </div>

          {/* Dash-connected step circles timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 relative max-w-5xl mx-auto">
            {/* Dashed connector line */}
            <div className="hidden sm:block absolute top-[28px] left-10 right-10 h-0.5 border-t-2 border-dashed border-[#6C5CE7]/25 z-0" />
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative z-10 space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6C5CE7]/8 text-[#6C5CE7] border border-[#6C5CE7]/15 shadow-sm">
                <PawPrint size={22} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#25324B]">1. Report</h4>
                <p className="text-[10px] text-[#6F7895] font-semibold leading-relaxed">
                  See a cat in need? Report it in seconds.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative z-10 space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#35C79A]/8 text-[#35C79A] border border-[#35C79A]/15 shadow-sm">
                <Stethoscope size={22} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#25324B]">2. Treat</h4>
                <p className="text-[10px] text-[#6F7895] font-semibold leading-relaxed">
                  Verified vets provide quotes and treatment.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative z-10 space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6C5CE7]/8 text-[#6C5CE7] border border-[#6C5CE7]/15 shadow-sm">
                <HandCoins size={22} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#25324B]">3. Fund</h4>
                <p className="text-[10px] text-[#6F7895] font-semibold leading-relaxed">
                  Community funds the exact treatment.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center relative z-10 space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD8A8]/20 text-[#FF8B7B] border border-[#FFD8A8]/30 shadow-sm">
                <Home size={22} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#25324B]">4. Foster</h4>
                <p className="text-[10px] text-[#6F7895] font-semibold leading-relaxed">
                  Cats recover in safe, loving foster homes.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center relative z-10 space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF8B7B]/8 text-[#FF8B7B] border border-[#FF8B7B]/15 shadow-sm">
                <Heart size={22} className="fill-[#FF8B7B]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#25324B]">5. Adopt</h4>
                <p className="text-[10px] text-[#6F7895] font-semibold leading-relaxed">
                  Cats rehome with their forever family.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Vets marketing link */}
      <section id="for-vets" className="py-12 text-center max-w-md mx-auto px-6 z-10">
        <h3 className="text-sm font-bold text-[#25324B]">Are you a licensed Veterinary Clinic?</h3>
        <p className="text-xs text-[#6F7895] mt-1.5 font-semibold leading-normal">
          Join our veterinary network to accept case dispatches and administer treatments sponsored by rescuers.
        </p>
        <Link
          href="/register?role=vet"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#6C5CE7] hover:text-[#5B4BE2] mt-2.5 transition-colors"
        >
          Register your clinic <ArrowRight size={12} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(37,50,75,.06)] bg-[#F7F7FB] py-8 z-10">
        <div className="max-w-6xl w-full mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
              <TabbyMascot variant="wave" size="sm" />
            <div>
              <span className="font-heading text-xs font-black text-[#25324B]">TabbyFund</span>
              <p className="text-[10px] text-[#6F7895] mt-0.5 font-semibold leading-normal">
                Every injured stray deserves a second chance. Partner with us today.
              </p>
            </div>
          </div>
          <p className="text-[10px] text-[#6F7895]/50 font-bold">
            © {new Date().getFullYear()} TabbyFund Rescue Community. Waving goodbye! 🐾
          </p>
        </div>
      </footer>
    </main>
  </div>
  );
}
