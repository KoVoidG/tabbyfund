"use server";

/**
 * Server-side geocoding using Geoapify Forward & Reverse Geocoding APIs.
 * API key: GEOAPIFY_API_KEY (server-only, never exposed to browser).
 */

interface GeocodeResult {
  lat: number | null;
  lng: number | null;
}

/**
 * Geocode a vet clinic address using Geoapify.
 * Combines clinic name + address for better accuracy.
 */
export async function geocodeClinicAddress(
  clinicName: string | null,
  clinicAddress: string | null
): Promise<GeocodeResult> {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    console.warn("[geocode] GEOAPIFY_API_KEY not configured. Skipping geocoding.");
    return { lat: null, lng: null };
  }

  if (!clinicAddress && !clinicName) {
    return { lat: null, lng: null };
  }

  const searchText = [clinicName, clinicAddress].filter(Boolean).join(", ");

  try {
    const url = new URL("https://api.geoapify.com/v1/geocode/search");
    url.searchParams.set("text", searchText);
    url.searchParams.set("apiKey", apiKey);
    url.searchParams.set("limit", "1");
    url.searchParams.set("format", "json");

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(`[geocode] API returned ${response.status}: ${response.statusText}`);
      return { lat: null, lng: null };
    }

    const data = await response.json();
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
    console.error("[geocode] Failed:", error instanceof Error ? error.message : "Unknown error");
    return { lat: null, lng: null };
  }
}

/**
 * Search/forward geocode an address string.
 */
export async function searchAddress(
  text: string
): Promise<{ lat: number; lng: number; address: string } | null> {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey || !text?.trim()) {
    return null;
  }

  try {
    const url = new URL("https://api.geoapify.com/v1/geocode/search");
    url.searchParams.set("text", text);
    url.searchParams.set("apiKey", apiKey);
    url.searchParams.set("limit", "1");
    url.searchParams.set("format", "json");

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(`[geocode] Search API returned ${response.status}`);
      return null;
    }

    const data = await response.json();
    const results = data?.results;
    if (!results || results.length === 0) {
      return null;
    }

    const first = results[0];
    if (typeof first.lat !== "number" || typeof first.lon !== "number") {
      return null;
    }

    return {
      lat: first.lat,
      lng: first.lon,
      address: first.formatted || text,
    };
  } catch (error) {
    console.error("[geocode] Search failed:", error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to a readable address.
 * If geocoding fails or API key is missing, returns coordinate string to avoid fake/default.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    console.warn("[geocode] GEOAPIFY_API_KEY not configured. Returning coordinate text.");
    return `Approximate location: ${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;
  }

  try {
    const url = new URL("https://api.geoapify.com/v1/geocode/reverse");
    url.searchParams.set("lat", lat.toString());
    url.searchParams.set("lon", lng.toString());
    url.searchParams.set("apiKey", apiKey);
    url.searchParams.set("format", "json");

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(`[geocode] Reverse API returned ${response.status}`);
      return `Approximate location: ${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;
    }

    const data = await response.json();
    const results = data?.results;
    if (results && results.length > 0) {
      return results[0].formatted || `Approximate location: ${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;
    }
  } catch (error) {
    console.error("[geocode] Reverse geocoding failed:", error);
  }

  return `Approximate location: ${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;
}
