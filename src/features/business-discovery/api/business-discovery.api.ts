import { apiClient } from "@/lib/api-client";
import type { Listing, NearbyListing, PaginatedListingsResponse } from "@/types/business.types";
export interface GetBusinessesParams {
  category?: string; // unconfirmed: is this a category id or name? ask backend
  page?: number;
  limit?: number;
}

export interface GetNearbyParams {
  lat: number;
  lng: number;
  radius?: number;
  page?: number;
  limit?: number;
}

// Matches the doc's actual example payloads, not the app's existing
// ApiResponse/PaginatedResponse types — those disagree on meta field names
// and whether "success" is present. Confirm with backend before Sprint 4.
interface BusinessListResponse {
  data: BusinessListItem[];
  meta: { total: number; page: number; limit: number };
}
interface BusinessDetailResponse {
  data: BusinessDetail;
}
// UNCONFIRMED shape (Sprint 4 backend endpoint) — mirrors BusinessListResponse
// until the real contract is confirmed; update both together if it drifts.
interface NearbyBusinessResponse {
  data: NearbyBusinessItem[];
}

export const businessDiscoveryApi = {
  getBusinesses: async (params: GetBusinessesParams) => {
    const { data } = await apiClient.get<BusinessListResponse>("/businesses", { params });
    return data;
  },

  getBusinessById: async (id: string) => {
    const { data } = await apiClient.get<BusinessDetailResponse>(`/businesses/${id}`);
    return data;
  },

  /** Minimal integration for the /nearby page shell — GET /businesses/nearby
   * per the V1 Sprint Plan (Sprint 4 backend). Only wired up enough to make
   * the shell show real pins; full filter/sort query params can be added
   * here as /nearby grows past a shell. */
  getNearby: async (params: GetNearbyParams) => {
  const { data } = await apiClient.get<PaginatedListingsResponse<NearbyListing>>("/listings/nearby", { params });
  return data;
},
};