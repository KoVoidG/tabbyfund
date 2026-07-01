import { PawPrint } from "lucide-react";
import { CaseCard } from "@/features/cases/components/CaseCard";
import { CaseFilters } from "@/features/cases/components/CaseFilters";
import { getPublicCases } from "@/lib/cases";
import { formatDistanceToNow } from "date-fns";
import type { Enums } from "@/types/database";

export const metadata = {
  title: "Rescue Feed — TabbyFund",
};

/**
 * /cases — Rescue case feed with filters and grid.
 * Fetches real cases from Supabase public_cases view.
 */
export default async function CasesPage() {
  const cases = await getPublicCases();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <PawPrint size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold text-[#2D3748]">Rescue Feed</h1>
          <p className="text-xs text-[#2D3748]/60">
            {cases.length} active rescue case{cases.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filters */}
      <CaseFilters />

      {/* Empty state */}
      {cases.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-12 text-center">
          <PawPrint size={40} strokeWidth={1} className="text-[#A788FA]/30 mb-3" />
          <p className="text-sm font-medium text-[#2D3748]/60">No rescue cases yet</p>
          <p className="mt-1 text-xs text-[#2D3748]/40">
            Report an injured cat to get started
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <CaseCard
            key={c.id!}
            id={c.id!}
            photo={c.photo_url ?? "https://placehold.co/600x400/F7F7FB/A788FA?text=No+Photo"}
            description={c.description ?? ""}
            status={c.status as Enums<"case_status">}
            severity={c.ai_severity as Enums<"ai_severity"> ?? "MEDIUM"}
            condition={c.ai_condition ?? "Unknown"}
            location={formatLocation(c.fuzzed_lat, c.fuzzed_lng)}
            reportedAgo={c.created_at ? formatDistanceToNow(new Date(c.created_at), { addSuffix: true }) : "recently"}
          />
        ))}
      </div>
    </div>
  );
}

/** Format coordinates into a readable location string. */
function formatLocation(lat: number | null, lng: number | null): string {
  if (lat == null || lng == null) return "Unknown location";
  return `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;
}
