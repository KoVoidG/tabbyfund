"use client";

import { useTransition } from "react";
import { CircleCheck, X, LoaderCircle } from "lucide-react";
import { verifyVet, rejectVet } from "../actions";
import type { VetProfile } from "@/lib/admin";

interface VetVerificationListProps {
  pendingVets: VetProfile[];
}

/**
 * VetVerificationList — admin component for approving/rejecting vets.
 */
export function VetVerificationList({ pendingVets }: VetVerificationListProps) {
  const [isPending, startTransition] = useTransition();

  function handleVerify(vetId: string) {
    startTransition(async () => {
      const result = await verifyVet(vetId);
      if (!result.success) alert(result.error);
    });
  }

  function handleReject(vetId: string) {
    startTransition(async () => {
      const result = await rejectVet(vetId);
      if (!result.success) alert(result.error);
    });
  }

  return (
    <section>
      <h2 className="text-sm font-semibold text-[#2D3748] mb-3">Pending Verification</h2>
      {pendingVets.length === 0 ? (
        <p className="text-xs text-[#2D3748]/50">No pending vet verifications.</p>
      ) : (
        <div className="space-y-2">
          {pendingVets.map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-[14px] border border-amber-200 bg-amber-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">{v.display_name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium text-[#2D3748]">{v.display_name}</p>
                  {v.clinic_name && <p className="text-[10px] text-[#2D3748]/60">{v.clinic_name}</p>}
                  {v.clinic_address && <p className="text-[9px] text-[#2D3748]/40">{v.clinic_address}</p>}
                  {v.clinic_name && (
                    <span className={`mt-0.5 inline-flex items-center gap-1 text-[9px] font-medium ${
                      v.clinic_lat != null ? "text-emerald-600" : "text-amber-600"
                    }`}>
                      {v.clinic_lat != null ? "✓ Location Verified" : "⚠ Location Not Geocoded"}
                    </span>
                  )}
                  {!v.clinic_name && <p className="text-[10px] text-[#2D3748]/50">vet · pending verification</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleVerify(v.id)}
                  disabled={isPending}
                  className="flex h-8 items-center gap-1 rounded-[8px] bg-emerald-500 px-3 text-xs font-semibold text-white hover:bg-emerald-600 transition disabled:opacity-50"
                >
                  {isPending ? <LoaderCircle size={12} className="animate-spin" /> : <CircleCheck size={12} strokeWidth={2} />} Approve
                </button>
                <button
                  onClick={() => handleReject(v.id)}
                  disabled={isPending}
                  className="flex h-8 items-center gap-1 rounded-[8px] border border-red-200 px-3 text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                >
                  <X size={12} strokeWidth={2} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
