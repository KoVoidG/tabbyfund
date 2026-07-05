import { Stethoscope, ShieldCheck, MapPin, ClipboardList, HandCoins, Building2 } from "lucide-react";
import { getPendingVets, getVerifiedVetsWithStats } from "@/lib/admin";
import { VetVerificationList } from "@/features/admin/components/VetVerificationList";
import { format } from "date-fns";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

export const metadata = { title: "Vet Management — TabbyAdmin" };

export default async function AdminVetsPage() {
  const pendingVets = await getPendingVets();
  const verifiedVets = await getVerifiedVetsWithStats();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <Stethoscope size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#2D3748]">Vet Management</h1>
          <p className="text-xs text-[#2D3748]/60">
            {pendingVets.length} pending verification · {verifiedVets.length} verified clinicians
          </p>
        </div>
      </div>

      {/* Pending Vets Section */}
      <VetVerificationList pendingVets={pendingVets} />

      {/* Verified Vets Section */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[#2D3748] border-b border-[#A788FA]/10 pb-2">
          Verified Veterinarians
        </h2>
        {verifiedVets.length === 0 ? (
          <div className="rounded-[16px] border border-[#A788FA]/10 bg-white p-8 text-center flex flex-col items-center gap-2 text-xs text-[#2D3748]/45">
            <TabbyMascot variant="wave" size="sm" />
            <span>No verified veterinarian partner profiles found yet.</span>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {verifiedVets.map((v) => (
              <div
                key={v.id}
                className="flex flex-col justify-between rounded-[16px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.03)] hover:shadow-[0_4px_16px_rgba(108,92,231,0.06)] transition-all"
              >
                <div className="space-y-3">
                  {/* Header: Name + Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6C5CE7]/10 text-xs font-semibold text-[#6C5CE7]">
                        {v.display_name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#2D3748] truncate">{v.display_name}</p>
                        <div className="flex flex-col">
                          <p className="text-[10px] text-[#6C5CE7] font-medium flex items-center gap-0.5">
                            <ShieldCheck size={11} /> Verified Partner
                          </p>
                          <p className="text-[9px] text-[#2D3748]/45 mt-0.5">
                            Verified since {format(new Date(v.updated_at || v.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clinic Details */}
                  {(v.clinic_name || v.clinic_address) && (
                    <div className="rounded-[10px] bg-[#F7F7FB] p-2.5 space-y-1.5 text-[10px] text-[#2D3748]/70">
                      {v.clinic_name && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <Building2 size={12} className="text-[#A788FA]" />
                          <span className="truncate">{v.clinic_name}</span>
                        </div>
                      )}
                      {v.clinic_address && (
                        <div className="flex items-start gap-1.5 leading-normal">
                          <MapPin size={12} className="text-[#A788FA] shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{v.clinic_address}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#A788FA]/8 text-center text-[#2D3748]">
                  <div className="rounded-lg bg-[#6C5CE7]/5 p-2 flex flex-col justify-center">
                    <span className="text-[9px] font-bold text-[#2D3748]/40 uppercase tracking-wider flex items-center gap-0.5 justify-center">
                      <ClipboardList size={10} /> Cases Handled
                    </span>
                    <span className="text-sm font-bold mt-0.5">{v.casesHandled}</span>
                  </div>
                  <div className="rounded-lg bg-emerald-500/5 p-2 flex flex-col justify-center">
                    <span className="text-[9px] font-bold text-[#2D3748]/40 uppercase tracking-wider flex items-center gap-0.5 justify-center">
                      <HandCoins size={10} /> Funds Managed
                    </span>
                    <span className="text-sm font-bold text-emerald-600 mt-0.5">
                      ฿{v.fundsHandled}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
