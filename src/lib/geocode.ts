/**
 * Server-side geocoding using Geoapify Forward Geocoding API.
 * API key: GEOAPIFY_API_KEY (server-only, never exposed to browser).
 *
 * Endpoint: https://api.geoapify.com/v1/geocode/search
 * Docs: https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/
 *
 * This helper is fail-safe: if geocoding fails for any reason
 * (network, timeout, invalid address, API limit, missing key),
 * it returns { lat: null, lng: null } and never throws.
 */

interface GeocodeResult {
  lat: number | null;
  lng: number | null;
}

/**
 * Geocode a vet clinic address using Geoapify.
 * Combines clinic name + address for better accuracy.
 *
 * @param clinicName - Name of the clinic (optional context)
 * @param clinicAddress - Street address to geocode
 * @returns { lat, lng } or { null, null } on failure
 */
export async function geocodeClinicAddress(
  clinicName: string | null,
  clinicAddress: string | null
): Promise<GeocodeResult> {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  // No API key configured — graceful fallback
  if (!apiKey) {
    console.warn("[geocode] GEOAPIFY_API_KEY not configured. Skipping geocoding.");
    return { lat: null, lng: null };
  }

  // Nothing to geocode
  if (!clinicAddress && !clinicName) {
    return { lat: null, lng: null };
  }

  // Build search text: prefer address, include name for context
  const searchText = [clinicName, clinicAddress].filter(Boolean).join(", ");

  try {
    const url = new URL("https://api.geoapify.com/v1/geocode/search");
    url.searchParams.set("text", searchText);
    url.searchParams.set("apiKey", apiKey);
    url.searchParams.set("limit", "1");
    url.searchParams.set("format", "json");

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      console.error(`[geocode] API returned ${response.status}: ${response.statusText}`);
      return { lat: null, lng: null };
    }

    const data = await response.json();

    // Geoapify returns { results: [{ lat, lon, ... }] } with format=json
    const results = data?.results;
    if (!results || results.length === 0) {
      console.warn("[geocode] No results for:", searchText);
      return { lat: null, lng: null };
    }

    const first = results[0];
    if (typeof first.lat !== "number" || typeof first.lon !== "number") {
      return { lat: null, lng: null };
    }

    return {
      lat: first.lat,
      lng: first.lon,
    };
  } catch (error) {
    // Network failure, timeout, or unexpected error — never block registration
    console.error("[geocode] Failed:", error instanceof Error ? error.message : "Unknown error");
    return { lat: null, lng: null };
  }
}
