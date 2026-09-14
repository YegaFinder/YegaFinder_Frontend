import { apiClient } from "@/lib/api-client";
import type { PaginatedEnvelope, ApiEnvelope } from "@/lib/api-response";
import type { Business, NearbyBusiness } from "@/types/business.types";

export interface GetBusinessesParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  q?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}
export interface SearchBusinessesParams extends GetBusinessesParams { q: string; }
export interface NearbyBusinessesParams {
  lat: number;
  lng: number;
  radius?: number;
  page?: number;
  limit?: number;
}

// Client-side great-circle distance. Used because the live /businesses/nearby
// handler computes distance internally for filter/sort then strips it before
// responding — so the server never sends distanceKm. We recompute from coords.
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const businessDiscoveryApi = {
  // §4.1 — Pattern B. Backing route: GET /businesses (DiscoveryController.findAll)
  // — the only non-shadowed, filterable, correctly-paginated discovery endpoint.
  // Supports q + categoryId + lat/lng/radius together.
  getBusinesses: async (params: GetBusinessesParams) => {
    const { data } = await apiClient.get<PaginatedEnvelope<Business>>("/businesses", { params });
    return data.data; // { items, total, page, limit, totalPages }
  },

  // §4.2 — DO NOT USE for new features. Backing route GET /businesses/search is
  // shadowed by BusinessDiscoveryController (registered first in profiles.module.ts)
  // and returns { businesses: [] } with no pagination — mismatched against this
  // function's PaginatedEnvelope assumption. Kept only so nothing else importing
  // it breaks; not wired into SearchFeed anymore. Use getBusinesses({ q }) instead.
  searchBusinesses: async (params: SearchBusinessesParams) => {
    const { data } = await apiClient.get<PaginatedEnvelope<Business>>("/businesses/search", { params });
    return data.data;
  },

  // §4.3 — Backing route GET /businesses/nearby is shadowed by
  // BusinessDiscoveryController (registered before DiscoveryController in
  // profiles.module.ts), so the live handler expects latitude/longitude/radiusKm
  // (not lat/lng/radius) and returns { businesses: [] } with NO pagination and
  // NO distanceKm field. We adapt on the client: map param names, paginate via
  // slice, and compute distanceKm ourselves from coordinates via haversine.
  // Businesses without latitude/longitude yield distanceKm: undefined — callers
  // must handle that (do not display a distance for them).
  // Real fix is backend-side: promote DiscoveryController.findNearby above the
  // shadowed controller and expose distanceKm. Flagged as a backend ticket.
  getNearbyBusinesses: async (params: NearbyBusinessesParams) => {
    const { lat, lng, radius = 10, page = 1, limit = 10 } = params;
    const { data } = await apiClient.get<{ businesses: Business[] }>("/businesses/nearby", {
      params: { latitude: lat, longitude: lng, radiusKm: radius },
    });
    const all = data.businesses ?? [];
    const start = (page - 1) * limit;
    const items: NearbyBusiness[] = all.slice(start, start + limit).map((b) => ({
      ...b,
      distanceKm:
        b.latitude != null && b.longitude != null
          ? haversineKm(lat, lng, b.latitude, b.longitude)
          : undefined,
    }));

    return {
      items,
      total: all.length,
      page,
      limit,
      totalPages: Math.ceil(all.length / limit),
    };
  },

  // §4.4 — Pattern A
  getBusinessById: async (id: string): Promise<Business> => {
    const { data } = await apiClient.get<ApiEnvelope<Business>>(`/businesses/${id}`);
    return data.data;
  },
};