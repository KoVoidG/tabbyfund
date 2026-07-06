"use client";

import { useTransition, useState, useEffect } from "react";
import { Truck, Clock, CircleCheck, User, LoaderCircle, MapPin, Navigation, Map, Hospital, Info } from "lucide-react";
import { claimTransport, deliverTransport } from "@/features/transport/actions";
import dynamic from "next/dynamic";

function formatVetName(name: string | null | undefined): string {
  if (!name) return "Verified Veterinarian";
  if (name.toLowerCase().startsWith("dr.")) return name;
  return `Dr. ${name}`;
}

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-40 w-full animate-pulse rounded-[10px] bg-[#A788FA]/5 flex items-center justify-center border border-[#A788FA]/10">
      <span className="text-xs text-[#2D3748]/45">Loading map...</span>
    </div>
  ),
});

export interface ClinicDestination {
  vetId: string;
  vetName: string;
  clinicName: string;
  clinicAddress: string | null;
  distance: number | null;
  clinicLat?: number | null;
  clinicLng?: number | null;
}

interface TransportCardProps {
  caseId: string;
  status: "OPEN" | "CLAIMED" | "DELIVERED";
  transporter?: string;
  isAssignedTransporter?: boolean;
  /** Nearest vet clinics for transport guidance */
  nearestClinics?: ClinicDestination[];
  lat?: number;
  lng?: number;
  isPrecise?: boolean;
  preciseAddress?: string | null;
  assignedVetName?: string | null;
  assignedVetClinic?: string | null;
}

const statusConfig = {
  OPEN: { color: "text-orange-600", bg: "bg-orange-100", label: "Awaiting Volunteer", icon: Clock },
  CLAIMED: { color: "text-blue-600", bg: "bg-blue-100", label: "In Transit", icon: Truck },
  DELIVERED: { color: "text-emerald-600", bg: "bg-emerald-100", label: "Delivered to Vet", icon: CircleCheck },
};

export function TransportCard({
  caseId,
  status,
  transporter,
  isAssignedTransporter,
  nearestClinics,
  lat,
  lng,
  isPrecise,
  preciseAddress,
  assignedVetName,
  assignedVetClinic,
}: TransportCardProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedClinicId, setSelectedClinicId] = useState<string>("");
  const [showAllClinics, setShowAllClinics] = useState(false);

  const config = statusConfig[status];
  const Icon = config.icon;

  useEffect(() => {
    if (nearestClinics && nearestClinics.length > 0 && !selectedClinicId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedClinicId(nearestClinics[0].vetId);
    }
  }, [nearestClinics, selectedClinicId]);

  function handleClaim() {
    startTransition(async () => {
      const result = await claimTransport(caseId);
      if (!result.success) alert(result.error ?? "Failed to claim transport.");
    });
  }

  function handleDeliver() {
    if (!selectedClinicId) {
      alert("Please select a destination clinic first.");
      return;
    }
    startTransition(async () => {
      const result = await deliverTransport(caseId, selectedClinicId);
      if (!result.success) alert(result.error ?? "Failed to mark as delivered.");
    });
  }

  function estimateTravelTime(distanceKm: number | null): string {
    if (distanceKm == null) return "N/A";
    const mins = Math.round((distanceKm / 40) * 60 + 5);
    return `~${mins} mins`;
  }

  // Position the selected clinic at index 1 so that LeafletMap draws the route polyline to it
  const destinationClinics = (nearestClinics ?? []).filter((c) => c.clinicLat != null && c.clinicLng != null);
  const selectedClinicObj = destinationClinics.find((c) => c.vetId === selectedClinicId);
  const otherClinicsObj = destinationClinics.filter((c) => c.vetId !== selectedClinicId);

  const sortedClinics = [...destinationClinics].sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
  const visibleClinics = showAllClinics ? sortedClinics : sortedClinics.slice(0, 3);
  const hasMoreThanThree = sortedClinics.length > 3;

  const mapMarkers = lat && lng
    ? [
        {
          lat: lat,
          lng: lng,
          title: isPrecise ? "Rescue Location (Precise)" : "Approximate Rescue Location (Privacy Protected)",
          iconType: isPrecise ? ("rescue" as const) : ("fuzzed" as const),
        },
        ...(selectedClinicObj
          ? [{
              lat: selectedClinicObj.clinicLat!,
              lng: selectedClinicObj.clinicLng!,
              title: `DESTINATION: ${selectedClinicObj.clinicName}`,
              iconType: "recommended-clinic" as const,
            }]
          : []),
        ...otherClinicsObj.map((c) => ({
          lat: c.clinicLat!,
          lng: c.clinicLng!,
          title: c.clinicName,
          iconType: "clinic" as const,
        })),
      ]
    : [];

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)] space-y-6">
      <div className="flex items-center justify-between border-b border-[#2D3748]/5 pb-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-[#2D3748]">
          <Truck size={18} strokeWidth={2} className="text-[#6C5CE7]" /> Transport Dispatch
        </h3>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${config.bg} ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Status Header */}
      {transporter && (
        <div className="flex items-center gap-2.5 text-xs text-[#2D3748]/75">
          <div className="h-6 w-6 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center text-[#6C5CE7]">
            <User size={12} strokeWidth={2} />
          </div>
          <span>Assigned Transporter: <strong className="text-[#2D3748]">{transporter}</strong></span>
        </div>
      )}

      {/* Dispatch Guidance Details - active transits */}
      {/* Delivered Destination Info */}
      {status === "DELIVERED" && (
        <div className="rounded-[12px] border border-emerald-100 bg-emerald-50/20 p-4 space-y-1.5 flex items-start gap-2.5">
          <Hospital size={16} className="mt-0.5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <h5 className="font-bold text-emerald-800 uppercase tracking-wider">Delivered Destination</h5>
            <p className="font-semibold text-[#2D3748] mt-1">{assignedVetClinic || "Verified Vet Clinic"}</p>
            <p className="text-[10px] text-[#2D3748]/60 mt-0.5">{formatVetName(assignedVetName)}</p>
          </div>
        </div>
      )}

      {/* Dispatch Guidance Details - active transits */}
      {status !== "DELIVERED" && lat && lng && (
        <div className="space-y-5">
          
          {/* Section 1: Pickup */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#2D3748]/60 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Pickup Location
            </h4>
            <div className="rounded-[12px] bg-slate-50 border border-slate-100 p-3 space-y-2.5">
              <div className="flex items-start gap-2 text-xs">
                <MapPin size={14} className="mt-0.5 text-red-500 shrink-0" />
                <div>
                  <p className="font-semibold text-[#2D3748]">Rescue Area</p>
                  <p className="text-[#2D3748]/65 mt-0.5">
                    {isPrecise ? "Precise location unlocked for rescue transit." : "Approximate location displayed to protect privacy."}
                  </p>
                  {isPrecise && preciseAddress && (
                    <p className="mt-1.5 font-medium text-[#6C5CE7] bg-[#6C5CE7]/5 px-2.5 py-1.5 rounded-[8px] border border-[#6C5CE7]/10 inline-block">
                      📍 {preciseAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Transit Map */}
              <div className="relative h-48 w-full overflow-hidden rounded-[10px] border border-[#A788FA]/10 bg-slate-100">
                <LeafletMap mode="display" center={[lat, lng]} zoom={14} markers={mapMarkers} />
              </div>
            </div>
          </div>

          {/* Section 2: Destination selection (assigned transporter) or info (other users) */}
          {status === "CLAIMED" && isAssignedTransporter && (
            <div className="space-y-4">
              {destinationClinics.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#2D3748]/60 uppercase tracking-wider flex items-center gap-1.5 pl-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <Hospital size={14} className="text-[#6C5CE7] shrink-0" />
                    <span>Select Destination Clinic</span>
                  </h4>
                  <div className="space-y-2">
                    {visibleClinics.map((c) => {
                      const isFirst = sortedClinics.indexOf(c) === 0;
                      return (
                        <label
                          key={c.vetId}
                          className={`relative flex flex-col gap-2 rounded-[16px] border p-4 cursor-pointer transition ${
                            selectedClinicId === c.vetId
                              ? "border-[#6C5CE7] bg-[#6C5CE7]/[0.02] shadow-[0_4px_12px_rgba(108,92,231,0.04)]"
                              : "border-[#2D3748]/10 hover:bg-slate-50"
                          }`}
                        >
                          {isFirst && (
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800 border border-amber-200/50 uppercase tracking-wider">
                                ⭐ Recommended Destination
                              </span>
                              <span className="text-[9px] font-medium text-[#2D3748]/55">
                                Nearest verified partner clinic
                              </span>
                            </div>
                          )}
                          <div className="flex items-start gap-2.5">
                            <input
                              type="radio"
                              name="destination_clinic"
                              value={c.vetId}
                              checked={selectedClinicId === c.vetId}
                              onChange={() => setSelectedClinicId(c.vetId)}
                              className="mt-1 accent-[#6C5CE7] shrink-0 cursor-pointer"
                            />
                            <div className="min-w-0 flex-1 text-xs">
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-[#2D3748] truncate">{c.clinicName}</p>
                                <span className="inline-flex rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 border border-emerald-200/50 uppercase tracking-wider shrink-0">
                                  Verified
                                </span>
                              </div>
                              <p className="text-[10px] text-[#2D3748]/70 mt-0.5">Assigned Vet: {formatVetName(c.vetName)}</p>
                              {c.clinicAddress && <p className="text-[9px] text-[#2D3748]/40 truncate mt-0.5">{c.clinicAddress}</p>}
                            </div>
                            <div className="shrink-0 text-right text-xs">
                              <span className="font-bold text-[#2D3748] block">{c.distance != null ? `${c.distance.toFixed(1)} km` : "N/A"}</span>
                              <span className="block text-[9px] text-[#2D3748]/50 mt-0.5">{estimateTravelTime(c.distance)}</span>
                            </div>
                          </div>
                        </label>
                      );
                    })}

                    {hasMoreThanThree && (
                      <button
                        type="button"
                        onClick={() => setShowAllClinics(!showAllClinics)}
                        className="mt-2 text-xs font-bold text-[#6C5CE7] hover:text-[#A788FA] flex items-center gap-1 cursor-pointer pl-1 transition-colors"
                      >
                        {showAllClinics ? "Show fewer clinics" : `Show all clinics (+${sortedClinics.length - 3} more)`}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Delivering to banner for transporter */}
              {selectedClinicObj && (
                <div className="rounded-[12px] border border-[#6C5CE7]/20 bg-[#6C5CE7]/[0.02] p-4 space-y-3">
                  <div>
                    <span className="inline-flex rounded-full bg-[#6C5CE7]/10 px-2 py-0.5 text-[9px] font-bold text-[#6C5CE7] uppercase tracking-wider mb-2">
                      Delivering to
                    </span>
                    <h5 className="text-sm font-bold text-[#2D3748]">{selectedClinicObj.clinicName}</h5>
                    <p className="text-xs text-[#2D3748]/65 mt-0.5">Verified Veterinarian: {formatVetName(selectedClinicObj.vetName)}</p>
                    {selectedClinicObj.clinicAddress && (
                      <p className="text-[11px] text-[#2D3748]/50 mt-1">{selectedClinicObj.clinicAddress}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs border-t border-[#6C5CE7]/10 pt-3">
                    <div>
                      <span className="text-[#2D3748]/40 block text-[10px]">Approx. Distance</span>
                      <strong className="text-[#2D3748]">{selectedClinicObj.distance != null ? `~${selectedClinicObj.distance.toFixed(1)} km` : "N/A"}</strong>
                    </div>
                    <div>
                      <span className="text-[#2D3748]/40 block text-[10px]">Est. Travel Time</span>
                      <strong className="text-[#2D3748]">{estimateTravelTime(selectedClinicObj.distance)}</strong>
                    </div>
                    <div className="col-span-2 text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-2 rounded-[8px] mt-1 flex items-start gap-1.5 border border-emerald-100">
                      <Info size={12} className="shrink-0 mt-0.5 text-emerald-600" />
                      <span>Reason: <span className="font-semibold">Nearest verified partner clinic</span></span>
                    </div>
                  </div>

                  {/* Navigation Action Buttons */}
                  {selectedClinicObj.clinicLat != null && selectedClinicObj.clinicLng != null && (
                    <div className="space-y-1.5 pt-2">
                      <p className="text-[10px] font-bold text-[#2D3748]/60 uppercase tracking-wider flex items-center gap-1">
                        <Navigation size={10} className="text-[#6C5CE7]" /> Start Navigation
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${selectedClinicObj.clinicLat},${selectedClinicObj.clinicLng}&travelmode=driving`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 rounded-[8px] bg-white border border-[#2D3748]/10 py-2 text-[10px] font-bold text-[#2D3748] hover:bg-slate-50 transition shadow-xs cursor-pointer"
                        >
                          Google Maps
                        </a>
                        <a
                          href={`http://maps.apple.com/?saddr=${lat},${lng}&daddr=${selectedClinicObj.clinicLat},${selectedClinicObj.clinicLng}&dirflg=d`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 rounded-[8px] bg-white border border-[#2D3748]/10 py-2 text-[10px] font-bold text-[#2D3748] hover:bg-slate-50 transition shadow-xs cursor-pointer"
                        >
                          Apple Maps
                        </a>
                        <a
                          href={`https://waze.com/ul?ll=${selectedClinicObj.clinicLat},${selectedClinicObj.clinicLng}&navigate=yes`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 rounded-[8px] bg-white border border-[#2D3748]/10 py-2 text-[10px] font-bold text-[#2D3748] hover:bg-slate-50 transition shadow-xs cursor-pointer"
                        >
                          Waze
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Delivering to (view only for non-transporters) */}
          {status === "CLAIMED" && !isAssignedTransporter && (
            <div className="rounded-[12px] border border-slate-100 bg-slate-50/50 p-4 space-y-1.5 flex items-start gap-2.5">
              <Hospital size={16} className="mt-0.5 text-slate-500 shrink-0" />
              <div className="text-xs">
                <h5 className="font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <Truck size={10} /> Delivering to
                </h5>
                <p className="font-semibold text-[#2D3748] mt-1">{selectedClinicObj?.clinicName || destinationClinics[0]?.clinicName || "Partner Clinic"}</p>
                <p className="text-[10px] text-[#2D3748]/60 mt-0.5">{formatVetName(selectedClinicObj?.vetName || destinationClinics[0]?.vetName)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="pt-2 border-t border-[#2D3748]/5">
        {status === "OPEN" && (
          <button
            onClick={handleClaim}
            disabled={isPending}
            className="w-full rounded-[12px] bg-[#6C5CE7] py-3 text-xs font-bold text-white hover:bg-[#A788FA] transition shadow-md disabled:opacity-60 cursor-pointer"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-1"><LoaderCircle size={12} className="animate-spin" /> Claiming Case...</span>
            ) : "Volunteer to Transport"}
          </button>
        )}

        {status === "CLAIMED" && isAssignedTransporter && (
          <button
            onClick={handleDeliver}
            disabled={isPending}
            className="w-full rounded-[12px] bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md disabled:opacity-60 cursor-pointer"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-1"><LoaderCircle size={12} className="animate-spin" /> Updating Status...</span>
            ) : "Mark Delivered to Vet"}
          </button>
        )}
      </div>
    </div>
  );
}

