import { Heart, PawPrint, Sparkles } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { AdoptionCard } from "@/features/adoption/components/AdoptionCard";
import { getAdoptableCats } from "@/lib/adoption";

export const metadata = {
  title: "Adopt — TabbyFund",
};

/**
 * /adopt — Adoption discovery page with real Supabase data.
 * Only shows cats that meet all adoption criteria (vet approved + foster profile complete).
 */
export default async function AdoptPage() {
  const cats = await getAdoptableCats();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden flex items-center gap-5 rounded-[20px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_24px_rgba(108,92,231,0.08)]">
        {/* Subtle background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/[0.03] via-transparent to-[#FFF3E0]/20 pointer-events-none" />
        <TabbyMascot variant="love" size="lg" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} strokeWidth={1.5} className="text-[#F3C9A6]" />
            <span className="text-[11px] font-bold text-[#6C5CE7]/70 uppercase tracking-widest">TabbyFund Adoption</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3748] leading-tight">
            Find Your Forever Friend
          </h1>
          <p className="mt-1.5 text-sm text-[#2D3748]/60 leading-relaxed">
            Every cat here has been rescued, treated, and is ready for a loving home.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-8 rounded-[16px] border border-[#A788FA]/10 bg-white/60 py-4 px-6 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#6C5CE7]">{cats.length}</p>
          <p className="text-[10px] text-[#2D3748]/50 font-medium uppercase tracking-wide mt-0.5">Available Now</p>
        </div>
        <div className="h-8 w-px bg-[#A788FA]/15" />
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-600">100%</p>
          <p className="text-[10px] text-[#2D3748]/50 font-medium uppercase tracking-wide mt-0.5">Treated &amp; Healthy</p>
        </div>
        <div className="h-8 w-px bg-[#A788FA]/15" />
        <div className="text-center">
          <Heart size={22} strokeWidth={1.5} className="text-[#F3C9A6] mx-auto" />
          <p className="text-[10px] text-[#2D3748]/50 font-medium uppercase tracking-wide mt-0.5">Ready for Love</p>
        </div>
      </div>

      {/* Empty state */}
      {cats.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#A788FA]/20 bg-white p-16 text-center space-y-4">
          <TabbyMascot variant="think" size="lg" className="opacity-75" />
          <div>
            <p className="text-base font-bold text-[#2D3748]">No cats are ready for adoption yet.</p>
            <p className="mt-1.5 text-sm text-[#2D3748]/45 max-w-sm mx-auto leading-relaxed">
              Cats appear here once they finish medical treatment and complete their foster profile.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#6C5CE7] font-semibold">
            <PawPrint size={13} strokeWidth={2} />
            Check back soon!
          </div>
        </div>
      )}

      {/* Cards grid — 2 col on tablet, 3 col on desktop */}
      {cats.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat) => (
            <AdoptionCard key={cat.id} cat={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
