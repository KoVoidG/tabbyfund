import { Stethoscope, ShieldCheck } from "lucide-react";
import { getPendingVets, getVerifiedVets } from "@/lib/admin";
import { VetVerificationList } from "@/features/admin/components/VetVerificationList";

export const metadata = { title: "Vet Management — TabbyFund Admin" };

/**
 * /admin/vets — Vet verification management with real Supabase data.
 */
export default async function AdminVetsPage() {
  const pendingVets = await getPendingVets();
  const verifiedVets = await getVerifiedVets();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <Stethoscope size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-[#2D3748]">Vet Management</h1>
          <p className="text-xs text-[#2D3748]/60">{pendingVets.length} pending · {verifiedVets.length} verified</p>
        </div>
      </div>

      {/* Pending */}
      <VetVerificationList pendingVets={pendingVets} />

      {/* Verified */}
      <section>
        <h2 className="text-sm font-semibold text-[#2D3748] mb-3">Verified Veterinarians</h2>
        {verifiedVets.length === 0 ? (
          <p className="text-xs text-[#2D3748]/50">No verified vets yet.</p>
        ) : (
          <div className="space-y-2">
            {verifiedVets.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-[14px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.06)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6C5CE7]/10 text-sm font-semibold text-[#6C5CE7]">{v.display_name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium text-[#2D3748]">{v.display_name}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                  <ShieldCheck size={12} strokeWidth={1.5} /> Verified
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
