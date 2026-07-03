import { notFound } from "next/navigation";
import { CatGallery } from "@/features/adoption/components/CatGallery";
import { MedicalSummaryCard } from "@/features/adoption/components/MedicalSummaryCard";
import { BehaviouralSummaryCard } from "@/features/adoption/components/BehaviouralSummaryCard";
import { ApplicationCTA } from "@/features/adoption/components/ApplicationCTA";
import { HealthTags } from "@/features/adoption/components/HealthTags";
import { getAdoptableCatByCaseId } from "@/lib/adoption";

interface AdoptDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdoptDetailPageProps) {
  const { id } = await params;
  const cat = await getAdoptableCatByCaseId(id);
  return { title: cat ? `Adopt — TabbyFund` : "Cat Not Found" };
}

/**
 * /adopt/[id] — detailed adoption profile with real Supabase data.
 */
export default async function AdoptDetailPage({ params }: AdoptDetailPageProps) {
  const { id } = await params;
  const cat = await getAdoptableCatByCaseId(id);

  if (!cat) notFound();

  // Build health tags
  const healthTags: string[] = [];
  if (cat.vaccinationStatus === "complete") healthTags.push("Vaccinated");
  else if (cat.vaccinationStatus === "partial") healthTags.push("Partially Vaccinated");
  if (cat.isNeutered) healthTags.push("Neutered");
  if (cat.specialNeeds) healthTags.push("Special Needs");
  if (!cat.specialNeeds) healthTags.push("Recovered");

  // Build photo gallery
  const photos: string[] = [cat.photoUrl];
  if (cat.fosterPhotos && cat.fosterPhotos.length > 0) {
    photos.push(...cat.fosterPhotos);
  }

  const catName = cat.listingPersonality ?? "This Cat";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Gallery */}
      <CatGallery photos={photos} name={catName} />

      {/* Name + meta */}
      <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <h1 className="font-heading text-2xl font-bold text-[#2D3748]">{catName}</h1>
        <p className="mt-1 text-sm text-[#2D3748]/60">
          {cat.energyLevel ?? "Medium"} energy · {cat.indoorOnly ? "Indoor only" : "Indoor/Outdoor"}
        </p>
        <div className="mt-3">
          <HealthTags tags={healthTags} />
        </div>
        {cat.description && (
          <p className="mt-3 text-sm text-[#2D3748]/80 leading-relaxed">{cat.description}</p>
        )}
      </div>

      {/* Medical Summary — Vet owned */}
      <MedicalSummaryCard
        vaccination={cat.vaccinationStatus ?? "unknown"}
        neutered={cat.isNeutered ?? false}
        specialNeeds={cat.specialNeeds ?? undefined}
        treatmentSummary={cat.treatmentSummary ?? "Treatment completed successfully."}
        vet="Verified Vet"
      />

      {/* Behavioural Profile — Foster owned */}
      <BehaviouralSummaryCard
        personality={cat.personality ?? []}
        energyLevel={cat.energyLevel ?? "medium"}
        goodWithChildren={cat.goodWithChildren ?? undefined}
        goodWithCats={cat.goodWithCats ?? undefined}
        goodWithDogs={cat.goodWithDogs ?? undefined}
        litterTrained={cat.litterTrained ?? undefined}
        indoorOnly={cat.indoorOnly ?? true}
        foster="Foster Caretaker"
      />

      {/* Observations */}
      {cat.observations && (
        <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
          <h3 className="text-sm font-semibold text-[#2D3748] mb-2">Foster Observations</h3>
          <p className="text-sm text-[#2D3748]/80 leading-relaxed">{cat.observations}</p>
        </div>
      )}

      {/* Application CTA */}
      <ApplicationCTA caseId={cat.caseId} catName={catName} />
    </div>
  );
}
