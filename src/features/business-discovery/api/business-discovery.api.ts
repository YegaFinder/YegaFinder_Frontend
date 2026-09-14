import { apiClient } from "@/lib/api-client";
import type { PaginatedEnvelope, ApiEnvelope } from "@/lib/api-response";
import type { Business, NearbyBusiness } from "@/types/business.types";

export interface GetBusinessesParams { page?: number; limit?: number; categoryId?: string; }
export interface SearchBusinessesParams extends GetBusinessesParams { q: string; }
export interface NearbyBusinessesParams extends GetBusinessesParams {
  lat: number; lng: number; radius?: number;
}

export const businessDiscoveryApi = {
  // §4.1 — Pattern B
  getBusinesses: async (params: GetBusinessesParams) => {
    const { data } = await apiClient.get<PaginatedEnvelope<Business>>("/businesses", { params });
    return data.data; // { items, total, page, limit, totalPages }
  },

  // §4.2 — Pattern B, same shape as getBusinesses
  searchBusinesses: async (params: SearchBusinessesParams) => {
    const { data } = await apiClient.get<PaginatedEnvelope<Business>>("/businesses/search", { params });
    return data.data;
  },

  // §4.3 — Pattern B, items include distanceKm
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
