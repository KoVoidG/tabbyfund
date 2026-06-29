import { PawPrint } from "lucide-react";
import { CaseCard } from "@/features/cases/components/CaseCard";
import { CaseFilters } from "@/features/cases/components/CaseFilters";
import { mockCases } from "@/features/cases/mock-data";

export const metadata = {
  title: "Rescue Feed — TabbyFund",
};

/**
 * /cases — Rescue case feed with filters and grid.
 * Uses mock data. Will be replaced with real Supabase queries.
 */
export default function CasesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <PawPrint size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold text-[#2D3748]">Rescue Feed</h1>
          <p className="text-xs text-[#2D3748]/60">{mockCases.length} active rescue cases</p>
        </div>
      </div>

      {/* Filters */}
      <CaseFilters />

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockCases.map((c) => (
          <CaseCard
            key={c.id}
            id={c.id}
            photo={c.photo}
            description={c.description}
            status={c.status}
            severity={c.severity}
            condition={c.condition}
            location={c.location}
            reportedAgo={c.reportedAgo}
            goal={c.goal}
            raised={c.raised}
          />
        ))}
      </div>
    </div>
  );
}
