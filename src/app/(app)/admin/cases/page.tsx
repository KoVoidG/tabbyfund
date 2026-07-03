import { ClipboardList } from "lucide-react";
import { getAdminCases } from "@/lib/admin";
import { CaseManagementClient } from "@/features/admin/components/CaseManagementClient";

export const metadata = {
  title: "Case Management — TabbyAdmin",
};

export default async function AdminCasesPage() {
  const cases = await getAdminCases();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <ClipboardList size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-[#2D3748]">Case Management</h1>
          <p className="text-xs text-[#2D3748]/60">View, search, and monitor all platform rescue cases</p>
        </div>
      </div>

      {/* Main filters and lists */}
      <CaseManagementClient initialCases={cases} />
    </div>
  );
}
