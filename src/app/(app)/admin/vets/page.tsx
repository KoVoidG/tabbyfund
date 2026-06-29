import { Stethoscope, ShieldCheck, Search, CircleCheck, X } from "lucide-react";

export const metadata = { title: "Vet Management — TabbyFund Admin" };

const pendingVets = [
  { id: "v1", name: "Dr. New Vet", email: "newvet@example.com", appliedAgo: "1 day ago", clinic: "Bangkok Pet Clinic" },
  { id: "v2", name: "Dr. Somjai", email: "somjai@example.com", appliedAgo: "3 days ago", clinic: "Ari Animal Hospital" },
];

const verifiedVets = [
  { id: "v3", name: "Dr. Siriporn", email: "dr.siriporn@example.com", verifiedAgo: "30 days ago" },
  { id: "v4", name: "Dr. Anuwat", email: "dr.anuwat@example.com", verifiedAgo: "30 days ago" },
];

export default function AdminVetsPage() {
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

      {/* Search */}
      <div className="relative">
        <Search size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A788FA]" />
        <input type="search" placeholder="Search vets..." className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white pl-10 pr-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15" />
      </div>

      {/* Pending */}
      <section>
        <h2 className="text-sm font-semibold text-[#2D3748] mb-3">Pending Verification</h2>
        <div className="space-y-2">
          {pendingVets.map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-[14px] border border-amber-200 bg-amber-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">{v.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium text-[#2D3748]">{v.name}</p>
                  <p className="text-[10px] text-[#2D3748]/50">{v.clinic} · Applied {v.appliedAgo}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex h-8 items-center gap-1 rounded-[8px] bg-emerald-500 px-3 text-xs font-semibold text-white hover:bg-emerald-600 transition">
                  <CircleCheck size={12} strokeWidth={2} /> Approve
                </button>
                <button className="flex h-8 items-center gap-1 rounded-[8px] border border-red-200 px-3 text-xs font-medium text-red-600 hover:bg-red-50 transition">
                  <X size={12} strokeWidth={2} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verified */}
      <section>
        <h2 className="text-sm font-semibold text-[#2D3748] mb-3">Verified Veterinarians</h2>
        <div className="space-y-2">
          {verifiedVets.map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-[14px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.06)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6C5CE7]/10 text-sm font-semibold text-[#6C5CE7]">{v.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium text-[#2D3748]">{v.name}</p>
                  <p className="text-[10px] text-[#2D3748]/50">{v.email}</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                <ShieldCheck size={12} strokeWidth={1.5} /> Verified
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
