/**
 * Lightweight address → coordinates lookup using OpenStreetMap's public
 * Nominatim API (https://nominatim.org/release-docs/latest/api/Search/).
 * No API key required, which matches "OpenStreetMap" already listed as
 * one of the project's Maps options.
 *
 * This exists specifically so SavedAddressesList stops submitting
 * `latitude: 0, longitude: 0` placeholders — see the docblock at the
 * top of that file for the full context.
 *
 * Production note: Nominatim's usage policy is fine for low-volume,
 * client-triggered lookups like this (one request per "Find location"
 * click), but it is rate-limited and asks for a descriptive User-Agent,
 * which browsers won't let client-side `fetch` set. If usage grows,
 * proxy this through the NestJS backend (which CAN set a User-Agent)
 * or swap in the Google Maps Geocoding API — the `GeocodeResult` shape
 * below is deliberately minimal so that swap won't ripple into callers.
 */

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  /** Human-readable resolved location, shown back to the user as a confirmation. */
  displayName: string;
}

export async function geocodeAddress(query: string): Promise<GeocodeResult | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Location lookup failed. Please try again.");
  }

  const results = (await response.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;

  if (results.length === 0) return null;

  const [first] = results;
  return {
    latitude: parseFloat(first.lat),
    longitude: parseFloat(first.lon),
    displayName: first.display_name,
  };
}
