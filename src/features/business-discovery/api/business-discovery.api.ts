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
export interface NearbyBusinessesParams extends GetBusinessesParams {
  lat: number; lng: number; radius?: number;
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

  // §4.3 — Pattern B, items include distanceKm.
  // NOTE: also shadowed the same way as searchBusinesses — real backing route
  // (BusinessDiscoveryController.nearby) expects latitude/longitude/radiusKm and
  // returns { businesses: [] }, not this function's assumed shape. Needs its own
  // fix pass — flagged for task #5, not touched here.
  getNearbyBusinesses: async (params: NearbyBusinessesParams) => {
    const { data } = await apiClient.get<PaginatedEnvelope<NearbyBusiness>>("/businesses/nearby", {
      params: { radius: 10, ...params },
    });
    return data.data;
  },

  // §4.4 — Pattern A
  getBusinessById: async (id: string): Promise<Business> => {
    const { data } = await apiClient.get<ApiEnvelope<Business>>(`/businesses/${id}`);
    return data.data;
  },
};