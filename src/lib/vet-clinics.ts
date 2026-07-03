import { createServiceClient } from "@/lib/supabase/service";

export interface VetClinic {
  vetId: string;
  vetName: string;
  clinicName: string;
  clinicAddress: string | null;
  clinicLat: number | null;
  clinicLng: number | null;
  distance: number | null; // km, null if coordinates not available
}

/**
 * Get verified vet clinics, optionally sorted by distance from a location.
 */
export async function getVerifiedVetClinics(
  fromLat?: number,
  fromLng?: number
): Promise<VetClinic[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, clinic_name, clinic_address, clinic_lat, clinic_lng")
    .eq("role", "vet")
    .eq("is_verified", true)
    .not("clinic_name", "is", null);

  if (error || !data) return [];

  const clinics: VetClinic[] = data
    .filter((v) => v.clinic_name)
    .map((v) => {
      let distance: number | null = null;
      if (fromLat != null && fromLng != null && v.clinic_lat != null && v.clinic_lng != null) {
        distance = haversineKm(fromLat, fromLng, v.clinic_lat, v.clinic_lng);
      }
      return {
        vetId: v.id,
        vetName: v.display_name,
        clinicName: v.clinic_name!,
        clinicAddress: v.clinic_address,
        clinicLat: v.clinic_lat,
        clinicLng: v.clinic_lng,
        distance,
      };
    });

  // Sort by distance (nearest first), nulls last
  clinics.sort((a, b) => {
    if (a.distance == null && b.distance == null) return 0;
    if (a.distance == null) return 1;
    if (b.distance == null) return -1;
    return a.distance - b.distance;
  });

  return clinics;
}

/** Haversine formula — approximate distance in km between two lat/lng points. */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal place
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
