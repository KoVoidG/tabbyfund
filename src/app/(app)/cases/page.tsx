import { PawPrint } from "lucide-react";
import { CaseCard } from "@/features/cases/components/CaseCard";
import { CaseFilters } from "@/features/cases/components/CaseFilters";
import { getPublicCases } from "@/lib/cases";
import { formatDistanceToNow } from "date-fns";
import type { Enums } from "@/types/database";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

export const metadata = {
  title: "Rescue Feed — TabbyFund",
};

interface CasesPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    severity?: string;
    sort?: string;
  }>;
}

/**
 * /cases — Rescue case feed with filters and grid.
 * Fetches real cases from Supabase public_cases view.
 */
export default async function CasesPage({ searchParams }: CasesPageProps) {
  const params = await searchParams;
  const search = params.search?.toLowerCase() || "";
  const statusFilter = params.status || "";
  const severityFilter = params.severity || "";
  const sortBy = params.sort || "newest";

  const allCasesRaw = await getPublicCases();

  // 1. Filter
  const filteredCases = allCasesRaw.filter((c) => {
    if (search) {
      const desc = c.description?.toLowerCase() || "";
      const cond = c.ai_condition?.toLowerCase() || "";
      if (!desc.includes(search) && !cond.includes(search)) {
        return false;
      }
    }

    if (statusFilter && c.status !== statusFilter) {
      return false;
    }

    if (severityFilter && c.ai_severity !== severityFilter) {
      return false;
    }

    return true;
  });

  // 2. Sort
  const severityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  filteredCases.sort((a, b) => {
    if (sortBy === "severity") {
      const wA = severityWeight[a.ai_severity as keyof typeof severityWeight] ?? 0;
      const wB = severityWeight[b.ai_severity as keyof typeof severityWeight] ?? 0;
      if (wA !== wB) return wB - wA;
    }
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  const TERMINAL_STATUSES = ["ADOPTED", "SHELTERED", "REUNITED", "CANCELLED", "LOST_CONTACT", "DECEASED"];

  const activeCases = filteredCases.filter((c) => c.status && !TERMINAL_STATUSES.includes(c.status));
  const endedCases = filteredCases.filter((c) => c.status && TERMINAL_STATUSES.includes(c.status));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <PawPrint size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#2D3748]">Rescue Feed</h1>
          <p className="text-xs text-[#2D3748]/60">
            {activeCases.length} active rescue case{activeCases.length !== 1 ? "s" : ""} · {endedCases.length} closed
          </p>
        </div>
      </div>

      {/* Filters */}
      <CaseFilters />

      {/* Empty state (when total cases are 0) */}
      {allCasesRaw.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-12 text-center space-y-3">
          <TabbyMascot variant="sleep" size="lg" />
          <div>
            <p className="text-sm font-bold text-[#6C5CE7]">Great news!</p>
            <p className="text-xs font-medium text-[#2D3748]/70 mt-0.5">There are currently no rescue cases in the system.</p>
            <p className="mt-1 text-[10px] text-[#2D3748]/40">
              Report an injured cat to start a rescue mission!
            </p>
          </div>
        </div>
      )}

      {/* Empty state (when filters return nothing but system has cases) */}
      {filteredCases.length === 0 && allCasesRaw.length > 0 && (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-12 text-center space-y-3">
          <TabbyMascot variant="think" size="lg" />
          <div>
            <p className="text-sm font-bold text-[#6C5CE7]">No matching cases</p>
            <p className="text-xs font-medium text-[#2D3748]/70 mt-0.5">We couldn&apos;t find any rescues matching your filters.</p>
            <p className="mt-1 text-[10px] text-[#2D3748]/40">
              Try adjusting your search query or reset the filters.
            </p>
          </div>
        </div>
      )}

      {/* Active Rescues Section */}
      {allCasesRaw.length > 0 && filteredCases.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#2D3748] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#6C5CE7] animate-pulse" />
            Active Rescues ({activeCases.length})
          </h2>
          {activeCases.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-8 text-center space-y-3">
              <TabbyMascot variant="happy" size="lg" />
              <div>
                <p className="text-sm font-bold text-[#6C5CE7]">Great news!</p>
                <p className="text-xs font-medium text-[#2D3748]/70 mt-0.5">All rescue cases are completed and safe!</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeCases.map((c) => (
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
          )}
        </div>
      )}

      {/* Ended / Closed Section */}
      {endedCases.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#2D3748]/5">
          <h2 className="mt-5 text-sm font-bold text-[#2D3748]/40">
            Ended / Closed Cases ({endedCases.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {endedCases.map((c) => (
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
                isClosed={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Format coordinates into a readable location string. */
function formatLocation(lat: number | null, lng: number | null): string {
  if (lat == null || lng == null) return "Unknown location";
  return `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;
}
