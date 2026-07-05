import { TriangleAlert } from "lucide-react";
import { getAdminCases } from "@/lib/admin";
import { CaseModerationClient } from "@/features/admin/components/CaseModerationClient";

export const metadata = {
  title: "Case Moderation — TabbyAdmin",
};

export default async function AdminModerationPage() {
  const cases = await getAdminCases();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <TriangleAlert size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#2D3748]">Case Moderation Queue</h1>
          <p className="text-xs text-[#2D3748]/60">Review and triage incoming rescue reports and potential flags</p>
        </div>
      </div>

      {/* Triage filters and cards */}
      <CaseModerationClient initialCases={cases} />
    </div>
  );
}
