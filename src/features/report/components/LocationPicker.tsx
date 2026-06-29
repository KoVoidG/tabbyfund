"use client";

import { MapPin, Shield } from "lucide-react";

interface LocationData {
  lat: number;
  lng: number;
  fuzzedLat: number;
  fuzzedLng: number;
  address: string;
}

interface LocationPickerProps {
  location?: LocationData;
  onLocationChange: (loc: LocationData) => void;
}

/**
 * LocationPicker — Step 3 of the rescue wizard.
 * Placeholder map + GPS with privacy explanation.
 * Will be replaced with real Leaflet map integration later.
 */
export function LocationPicker({ location, onLocationChange }: LocationPickerProps) {
  function handleUseCurrentLocation() {
    // Mock GPS for demo
    const mockLocation: LocationData = {
      lat: 13.7380,
      lng: 100.5608,
      fuzzedLat: 13.739,
      fuzzedLng: 100.562,
      address: "Sukhumvit Soi 23, Bangkok",
    };
    onLocationChange(mockLocation);
  }

  return (
    <div className="space-y-5">
      <h2 className="font-heading text-base font-semibold text-[#2D3748]">
        Where is the cat?
      </h2>
      <p className="text-sm text-[#2D3748]/60">
        Help volunteers find the cat by pinning the location.
      </p>

      {/* Map placeholder */}
      <div className="relative h-48 rounded-[14px] border border-[#A788FA]/15 bg-gradient-to-br from-[#F7F7FB] to-[#A788FA]/5 flex items-center justify-center overflow-hidden">
        {location ? (
          <div className="flex flex-col items-center gap-2">
            <MapPin size={32} strokeWidth={1.5} className="text-[#6C5CE7]" />
            <p className="text-xs font-medium text-[#2D3748]">{location.address}</p>
            <p className="text-[10px] text-[#2D3748]/50">
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <MapPin size={32} strokeWidth={1.5} className="text-[#A788FA]/40" />
            <p className="text-xs text-[#2D3748]/40">Map will appear here</p>
          </div>
        )}
      </div>

      {/* GPS Button */}
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#A788FA]/20 py-3 text-sm font-medium text-[#6C5CE7] transition hover:bg-[#6C5CE7]/5"
      >
        <MapPin size={16} strokeWidth={1.5} />
        {location ? "Update Location" : "Use Current Location"}
      </button>

      {/* Privacy notice */}
      <div className="flex gap-2.5 rounded-[10px] bg-[#FFF3E0]/40 p-3">
        <Shield size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#F3C9A6]" />
        <p className="text-[11px] text-[#2D3748]/70 leading-relaxed">
          <span className="font-medium">Privacy:</span> The public map intentionally hides the exact location to protect the cat. Only assigned volunteers and vets can see precise coordinates.
        </p>
      </div>
    </div>
  );
}
