import { notFound } from "next/navigation";
import { MapPin, Calendar, User, Sparkles } from "lucide-react";
import { CatGallery } from "@/features/adoption/components/CatGallery";
import { MedicalSummaryCard } from "@/features/adoption/components/MedicalSummaryCard";
import { BehaviouralSummaryCard } from "@/features/adoption/components/BehaviouralSummaryCard";
import { MatchReasons } from "@/features/adoption/components/MatchReasons";
import { IdealHomeCard } from "@/features/adoption/components/IdealHomeCard";
import { ApplicationCTA } from "@/features/adoption/components/ApplicationCTA";
import { HealthTags } from "@/features/adoption/components/HealthTags";
import { adoptableCats } from "@/features/adoption/mock-data";

interface AdoptDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdoptDetailPageProps) {
  const { id } = await params;
  const cat = adoptableCats.find((c) => c.id === id);
  return { title: cat ? `Adopt ${cat.name} — TabbyFund` : "Cat Not Found" };
}

/**
 * /adopt/[id] — detailed adoption profile.
 * Split into Medical Summary (vet-owned) and Behavioural Profile (foster-owned).
 */
export default async function AdoptDetailPage({ params }: AdoptDetailPageProps) {
  const { id } = await params;
  const cat = adoptableCats.find((c) => c.id === id);

  if (!cat) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Gallery */}
      <CatGallery photos={cat.photos} name={cat.name} />

      {/* Name + meta */}
      <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <h1 className="font-heading text-2xl font-bold text-[#2D3748]">{cat.name}</h1>
        <p className="mt-1 text-sm text-[#2D3748]/60">{cat.age} · {cat.gender} · {cat.breed}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#2D3748]/50">
          <span className="flex items-center gap-1"><MapPin size={12} strokeWidth={1.5} />{cat.location}</span>
          <span className="flex items-center gap-1"><Calendar size={12} strokeWidth={1.5} />{cat.fosterDays} days in foster</span>
          <span className="flex items-center gap-1"><User size={12} strokeWidth={1.5} />Foster: {cat.fosterCaretaker}</span>
        </div>
        <div className="mt-3">
          <HealthTags tags={cat.health} />
        </div>
      </div>

      {/* Medical Summary — Vet owned */}
      <MedicalSummaryCard
        vaccination={cat.vaccination}
        neutered={cat.neutered}
        specialNeeds={cat.specialNeeds}
        treatmentSummary={cat.treatmentSummary}
        vet={cat.vet}
      />

      {/* Behavioural Profile — Foster owned */}
      <BehaviouralSummaryCard
        personality={cat.personality}
        energyLevel={cat.energyLevel}
        goodWithChildren={cat.goodWithChildren}
        goodWithCats={cat.goodWithCats}
        indoorOnly={cat.indoorOnly}
        idealHome={cat.idealHome}
        favouriteActivities={cat.favouriteActivities}
        foster={cat.fosterCaretaker}
      />

      {/* Story */}
      <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <h3 className="text-sm font-semibold text-[#2D3748] mb-2">Rescue Story</h3>
        <p className="text-sm text-[#2D3748]/80 leading-relaxed">{cat.story}</p>
      </div>

      {/* Match Reasons */}
      <MatchReasons reasons={cat.matchReasons} />

      {/* Ideal Home */}
      <IdealHomeCard criteria={cat.idealHome} />

      {/* Application CTA */}
      <ApplicationCTA catName={cat.name} />
    </div>
  );
}
