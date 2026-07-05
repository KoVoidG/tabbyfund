import { Home, PawPrint, Heart, CircleCheck, Calendar, ChevronRight, ClipboardList } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { BehaviouralProfileForm } from "@/features/adoption/components/BehaviouralProfileForm";
import { getMyFosterCases } from "@/lib/foster";
import { requireAuth } from "@/lib/supabase/auth-helpers";
import Link from "next/link";

export const metadata = {
  title: "Foster Dashboard — TabbyFund",
};

/**
 * /foster — Foster dashboard showing real foster assignments from Supabase.
 */
export default async function FosterPage() {
  const user = await requireAuth();
  const fosterCases = await getMyFosterCases(user.id);

  const assigned = fosterCases.filter((c) => c.status === "ACTIVE");
  const needsProfile = assigned.filter((c) => !c.profileComplete);
  const readyForAdoption = assigned.filter((c) => c.profileComplete);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Hero */}
      <div className="flex items-center gap-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <TabbyMascot variant="love" size="lg" />
        <div>
          <h1 className="text-xl font-bold text-[#2D3748]">Foster Dashboard</h1>
          <p className="mt-1 text-sm text-[#2D3748]/60">Care for rescued cats until they find their forever home.</p>
        </div>
      </div>

      {/* Empty state */}
      {fosterCases.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-12 text-center">
          <Home size={40} strokeWidth={1} className="text-[#A788FA]/30 mb-3" />
          <p className="text-sm font-medium text-[#2D3748]/60">No foster assignments yet</p>
          <p className="mt-1 text-xs text-[#2D3748]/40">
            You&apos;ll see cats here when you are assigned as a foster caretaker
          </p>
        </div>
      )}

      {/* Assigned Cats */}
      {assigned.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748]">
            <PawPrint size={16} strokeWidth={1.5} className="text-[#6C5CE7]" />
            Assigned to Me ({assigned.length})
          </h2>
          {assigned.map((cat) => (
            <Link
              key={cat.id}
              href={`/cases/${cat.caseId}`}
              className="flex items-center gap-4 rounded-[14px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.06)] transition-shadow hover:shadow-[0_6px_20px_rgba(108,92,231,0.12)]"
            >
              <div className="h-14 w-14 shrink-0 rounded-[10px] overflow-hidden bg-[#F7F7FB]">
                <img src={cat.photoUrl} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2D3748]">{cat.condition ?? "Rescue Cat"}</p>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-[#2D3748]/50">
                  <span className="flex items-center gap-0.5"><Calendar size={10} strokeWidth={1.5} />{cat.days} days</span>
                  <span className="flex items-center gap-0.5"><Home size={10} strokeWidth={1.5} />In foster</span>
                </div>
                {cat.profileComplete && (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                    <CircleCheck size={9} strokeWidth={2} /> Profile Complete
                  </span>
                )}
              </div>
              <ChevronRight size={16} strokeWidth={1.5} className="shrink-0 text-[#2D3748]/20" />
            </Link>
          ))}
        </div>
      )}

      {/* Behaviour Profiles Needed */}
      {needsProfile.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748]">
            <ClipboardList size={16} strokeWidth={1.5} className="text-[#6C5CE7]" />
            Profiles Needed ({needsProfile.length})
          </h2>
          <p className="text-xs text-[#2D3748]/60">Complete the behavioural profile so these cats can appear on the public adoption page.</p>
          {needsProfile.map((cat) => (
            <div key={cat.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[8px] overflow-hidden bg-[#F7F7FB]">
                  <img src={cat.photoUrl} alt="" className="h-full w-full object-cover" />
                </div>
                <p className="text-sm font-semibold text-[#2D3748]">{cat.condition ?? "Rescue Cat"}</p>
              </div>
              <BehaviouralProfileForm caseId={cat.caseId} />
            </div>
          ))}
        </div>
      )}

      {/* Ready for Adoption */}
      {readyForAdoption.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748]">
            <Heart size={16} strokeWidth={1.5} className="text-[#6C5CE7]" />
            Ready for Adoption ({readyForAdoption.length})
          </h2>
          {readyForAdoption.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between rounded-[14px] border border-emerald-200/50 bg-emerald-50/30 p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-[10px] overflow-hidden bg-[#F7F7FB]">
                  <img src={cat.photoUrl} alt="" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2D3748]">{cat.condition ?? "Rescue Cat"}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                    <CircleCheck size={10} strokeWidth={1.5} /> Adoption-ready
                  </span>
                </div>
              </div>
              <Link href={`/cases/${cat.caseId}`} className="rounded-[8px] bg-[#6C5CE7] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#A788FA] transition">
                View Case
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
