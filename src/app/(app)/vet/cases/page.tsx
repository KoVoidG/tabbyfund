import { Stethoscope } from "lucide-react";
import { VetCaseCard } from "@/features/vet/components/VetCaseCard";
import { vetCases } from "@/features/vet/mock-data";

export const metadata = {
  title: "My Cases — TabbyFund Vet",
};

/**
 * /vet/cases — all cases assigned to this vet.
 */
export default function VetCasesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <Stethoscope size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-[#2D3748]">My Cases</h1>
          <p className="text-xs text-[#2D3748]/60">{vetCases.length} total cases</p>
        </div>
      </div>

      <div className="space-y-2">
        {vetCases.map((c) => (
          <VetCaseCard key={c.id} vetCase={c} />
        ))}
      </div>
    </div>
  );
}
