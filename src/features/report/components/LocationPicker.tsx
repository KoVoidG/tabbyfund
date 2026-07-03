"use client";

import { useState } from "react";
import { MapPin, Shield, LoaderCircle, Search, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { reverseGeocode, searchAddress } from "@/lib/geocode";

// Lazy-load LeafletMap component without SSR to avoid "window is not defined" errors
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-[#A788FA]/5 flex items-center justify-center border border-[#A788FA]/10">
      <span className="text-xs text-[#2D3748]/40">Loading map component...</span>
    </div>
  ),
});

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface LocationPickerProps {
  location?: LocationData;
  onLocationChange: (loc: LocationData) => void;
}

// Default center: Bangkok
const DEFAULT_LAT = 13.7563;
const DEFAULT_LNG = 100.5018;

export function LocationPicker({ location, onLocationChange }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const lat = location?.lat ?? DEFAULT_LAT;
  const lng = location?.lng ?? DEFAULT_LNG;

  const handleUseCurrentLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setErrorMsg("Unable to get your current location. Please allow location access or search by address.");
      return;
    }

    setIsLocating(true);
    setErrorMsg(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const currentLat = position.coords.latitude;
        const currentLng = position.coords.longitude;
        try {
          const address = await reverseGeocode(currentLat, currentLng);
          onLocationChange({ lat: currentLat, lng: currentLng, address });
        } catch (e) {
          console.error(e);
          onLocationChange({
            lat: currentLat,
            lng: currentLng,
            address: `Approximate location: ${currentLat.toFixed(3)}°N, ${currentLng.toFixed(3)}°E`,
          });
          setErrorMsg("We could not confirm this location. You can still continue if location is optional.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("[gps] Geolocation error:", error);
        setErrorMsg("Unable to get your current location. Please allow location access or search by address.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setErrorMsg("Please enter an address or landmark to search.");
      return;
    }
    setIsSearching(true);
    setErrorMsg(null);
    try {
      const result = await searchAddress(searchQuery);
      if (result) {
        onLocationChange({
          lat: result.lat,
          lng: result.lng,
          address: result.address,
        });
      } else {
        setErrorMsg("Address search failed. Please try a more specific address.");
      }
    } catch (e) {
      console.error("[search] Failed:", e);
      setErrorMsg("Address search failed. Please try a more specific address.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapLocationChange = async (newLat: number, newLng: number) => {
    setErrorMsg(null);
    try {
      const address = await reverseGeocode(newLat, newLng);
      onLocationChange({ lat: newLat, lng: newLng, address });
    } catch (e) {
      console.error(e);
      onLocationChange({
        lat: newLat,
        lng: newLng,
        address: `Approximate location: ${newLat.toFixed(3)}°N, ${newLng.toFixed(3)}°E`,
      });
      setErrorMsg("We could not confirm this location. You can still continue if location is optional.");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-base font-semibold text-[#2D3748]">
          Where is the cat?
        </h2>
        <p className="text-xs text-[#2D3748]/60 mt-0.5">
          Search for an address or click and drag the marker to pin the exact rescue location.
        </p>
      </div>

      {/* Geocoding Error Banner */}
      {errorMsg && (
        <div className="flex items-start justify-between gap-2.5 rounded-[12px] bg-red-50 border border-red-100 p-3.5 text-xs text-red-800">
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-[10px] font-bold text-red-600 hover:underline shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Address Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter street, landmark, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full rounded-[12px] border border-[#A788FA]/20 px-3.5 py-2.5 pl-9 text-xs focus:border-[#6C5CE7] focus:outline-none placeholder-[#2D3748]/35"
          />
          <Search size={14} className="absolute left-3.5 top-3 text-[#2D3748]/35" />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="rounded-[12px] bg-[#6C5CE7] px-4 text-xs font-semibold text-white hover:bg-[#A788FA] transition flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {isSearching ? <LoaderCircle size={12} className="animate-spin" /> : "Search"}
        </button>
      </div>

      {/* Map display */}
      <div className="relative h-64 rounded-[14px] border border-[#A788FA]/15 bg-slate-50 overflow-hidden shadow-inner">
        <LeafletMap
          mode="picker"
          center={[lat, lng]}
          zoom={location ? 16 : 12}
          onLocationChange={handleMapLocationChange}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        {/* GPS Button */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="flex items-center justify-center gap-2 rounded-[12px] border border-[#A788FA]/20 bg-white px-4 py-2.5 text-xs font-semibold text-[#6C5CE7] transition hover:bg-[#6C5CE7]/5 disabled:opacity-50 shrink-0"
        >
          {isLocating ? (
            <>
              <LoaderCircle size={12} className="animate-spin" />
              Locating...
            </>
          ) : (
            <>
              <MapPin size={12} strokeWidth={2} />
              Use Current Location
            </>
          )}
        </button>

        {/* Selected Address Display */}
        {location && (
          <div className="text-right flex-1 min-w-0 flex items-center justify-end">
            <span className="text-[10px] font-medium text-[#2D3748]/70 truncate max-w-full">
              📍 {location.address}
            </span>
          </div>
        )}
      </div>

      {/* Privacy notice */}
      <div className="flex gap-2.5 rounded-[10px] bg-[#FFF3E0]/40 p-3 border border-orange-100">
        <Shield size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#F3C9A6]" />
        <p className="text-[11px] text-[#2D3748]/70 leading-relaxed">
          <span className="font-medium text-[#D06A2C]">Privacy Shield Active:</span> The exact location is restricted to assigned volunteers and veterinarians. Public feeds only display a fuzzed marker.
        </p>
      </div>
    </div>
  );
}

