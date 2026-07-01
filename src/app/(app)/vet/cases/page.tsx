import { Stethoscope } from "lucide-react";
import { VetCaseCard } from "@/features/vet/components/VetCaseCard";
import { getVetCases } from "@/lib/vet-cases";
import { requireRole } from "@/lib/supabase/auth-helpers";

export const metadata = {
  title: "My Cases — TabbyFund Vet",
};

/**
 * /vet/cases — all cases relevant to this vet.
 */
export default async function VetCasesPage() {
  const profile = await requireRole("vet", { requireVerified: true });
  const cases = await getVetCases(profile.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <Stethoscope size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-[#2D3748]">My Cases</h1>
          <p className="text-xs text-[#2D3748]/60">{cases.length} total case{cases.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-12 text-center">
          <Stethoscope size={40} strokeWidth={1} className="text-[#A788FA]/30 mb-3" />
          <p className="text-sm font-medium text-[#2D3748]/60">No cases yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {cases.map((c) => (
            <VetCaseCard key={c.id} vetCase={c} />
          ))}
        </div>
      )}
    </div>
  );
}
