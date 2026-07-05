"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-[12px] bg-[#A788FA]/5 flex items-center justify-center border border-[#A788FA]/10">
      <span className="text-xs text-[#2D3748]/45">Loading map...</span>
    </div>
  ),
});

interface CaseDetailMapProps {
  fuzzedLat: number;
  fuzzedLng: number;
  preciseLat?: number | null;
  preciseLng?: number | null;
}

export function CaseDetailMap({ fuzzedLat, fuzzedLng, preciseLat, preciseLng }: CaseDetailMapProps) {
  const isPrecise = preciseLat != null && preciseLng != null;
  const displayLat = preciseLat ?? fuzzedLat;
  const displayLng = preciseLng ?? fuzzedLng;

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748] mb-3">
        <MapPin size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Rescue Location
      </h3>
      <div className="relative h-64 w-full overflow-hidden rounded-[12px] border border-[#A788FA]/10">
        <LeafletMap
          mode="display"
          center={[fuzzedLat, fuzzedLng]}
          zoom={14}
          markers={[
            {
              lat: displayLat,
              lng: displayLng,
              title: isPrecise ? "Precise Rescue Location" : "Approximate Rescue Location (Privacy Protected)",
              iconType: isPrecise ? "rescue" : "fuzzed",
            },
          ]}
        />
      </div>
      {isPrecise ? (
        <p className="mt-2 text-[10px] text-emerald-600 font-medium">
          ✓ Showing precise rescue coordinates (Transporter/Vet/Admin view).
        </p>
      ) : (
        <p className="mt-2 text-[10px] text-[#2D3748]/55 italic">
          Showing approximate location to protect the cat&apos;s privacy.
        </p>
      )}
    </div>
  );
}
