import { Stethoscope, X } from "lucide-react";
import Link from "next/link";
import { VetCaseCard } from "@/features/vet/components/VetCaseCard";
import { getVetCases } from "@/lib/vet-cases";
import { requireRole } from "@/lib/supabase/auth-helpers";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

export const metadata = {
  title: "My Cases — TabbyFund Vet",
};

interface VetCasesPageProps {
  searchParams: Promise<{ status?: string }>;
}

const STATUS_FILTERS = [
  { value: "waiting", label: "Needs Review", vetStatus: "waiting" as const },
  { value: "quote-needed", label: "Quote Needed", vetStatus: "waiting" as const },
  { value: "in-treatment", label: "In Treatment", vetStatus: "in_treatment" as const },
];

/**
 * /vet/cases — all cases relevant to this vet, with optional status filter.
 * Supports ?status=waiting|quote-needed|in-treatment from quick actions.
 */
export default async function VetCasesPage({ searchParams }: VetCasesPageProps) {
  const profile = await requireRole("vet", { requireVerified: true });
  const params = await searchParams;
  const statusParam = params.status ?? "";

  const allCases = await getVetCases(profile.id);

  // Apply status filter
  let filteredCases = allCases;
  const activeFilter = STATUS_FILTERS.find((f) => f.value === statusParam);

  if (statusParam === "waiting") {
    filteredCases = allCases.filter((c) => c.vetStatus === "waiting");
  } else if (statusParam === "quote-needed") {
    filteredCases = allCases.filter((c) => c.vetStatus === "waiting");
  } else if (statusParam === "in-treatment") {
    filteredCases = allCases.filter((c) => c.vetStatus === "in_treatment");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <Stethoscope size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-[#2D3748]">My Cases</h1>
          <p className="text-xs text-[#2D3748]/60">
            {filteredCases.length} of {allCases.length} case{allCases.length !== 1 ? "s" : ""}
            {activeFilter ? ` · filtered by ${activeFilter.label}` : ""}
          </p>
        </div>
      </div>

      {/* Active filter pill + clear */}
      {activeFilter && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6C5CE7]/10 border border-[#A788FA]/20 px-3 py-1 text-xs font-semibold text-[#6C5CE7]">
            {activeFilter.label}
          </span>
          <Link
            href="/vet/cases"
            className="inline-flex items-center gap-1 rounded-full bg-[#2D3748]/5 hover:bg-[#2D3748]/10 border border-[#2D3748]/10 px-2.5 py-1 text-[10px] font-semibold text-[#2D3748]/60 transition"
          >
            <X size={10} strokeWidth={2} /> Clear filter
          </Link>
        </div>
      )}

      {/* Cases */}
      {filteredCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-12 text-center space-y-3">
          <TabbyMascot variant="sleep" size="lg" />
          <div>
            <p className="text-sm font-bold text-[#6C5CE7]">
              {allCases.length === 0 ? "No cases assigned yet." : "No cases match this filter."}
            </p>
            <p className="text-xs font-medium text-[#2D3748]/70 mt-0.5">
              {allCases.length === 0
                ? "Cases will appear here once assigned to you."
                : "Try clearing the filter to see all cases."}
            </p>
          </div>
          {activeFilter && (
            <Link href="/vet/cases" className="text-xs text-[#6C5CE7] font-semibold underline underline-offset-2">
              Clear filter
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredCases.map((c) => (
            <VetCaseCard key={c.id} vetCase={c} />
          ))}
        </div>
      )}
    </div>
  );
}
