import { Heart } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { AdoptionCard } from "@/features/adoption/components/AdoptionCard";
import { adoptableCats } from "@/features/adoption/mock-data";

export const metadata = {
  title: "Adopt — TabbyFund",
};

/**
 * /adopt — Adoption discovery page.
 * Stack of discoverable cat cards with personality/health info.
 */
export default function AdoptPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="flex items-center gap-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <TabbyMascot variant="love" size="lg" />
        <div>
          <h1 className="font-heading text-xl font-bold text-[#2D3748]">
            Find Your Forever Friend
          </h1>
          <p className="mt-1 text-sm text-[#2D3748]/60">
            Every cat here has been rescued, treated, and is now ready for a loving home.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 text-center">
        <div>
          <p className="text-2xl font-bold text-[#6C5CE7]">{adoptableCats.length}</p>
          <p className="text-[10px] text-[#2D3748]/50">Available Now</p>
        </div>
        <div className="h-8 w-px bg-[#A788FA]/15" />
        <div>
          <p className="text-2xl font-bold text-emerald-600">100%</p>
          <p className="text-[10px] text-[#2D3748]/50">Treated & Healthy</p>
        </div>
        <div className="h-8 w-px bg-[#A788FA]/15" />
        <div>
          <p className="text-2xl font-bold text-[#F3C9A6]">♥</p>
          <p className="text-[10px] text-[#2D3748]/50">Ready for Love</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adoptableCats.map((cat) => (
          <AdoptionCard key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
}
