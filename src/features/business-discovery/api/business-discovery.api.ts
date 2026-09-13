import { apiClient } from "@/lib/api-client";
import type { Listing, NearbyListing, PaginatedListingsResponse } from "@/types/business.types";

/**
 * FIXED: this file used to export getBusinesses/getBusinessById, calling
 * GET /businesses and GET /businesses/:id. Two separate problems with
 * that, per YegnaFinder_Backend_Reference.md:
 *
 * 1. Compile error — those functions typed their responses as
 *    BusinessListItem/BusinessDetail, but nothing in this file (or
 *    anywhere else in the codebase) declares or imports those types
 *    anymore. That's a hard TypeScript build failure, not a runtime bug.
 * 2. Even fixed, GET /businesses and GET /businesses/:id are confirmed
 *    broken server-side: 401 for guests (missing @Public(), B3) and then
 *    500 even with a token (joins a non-existent `galleries` relation,
 *    B2). The doc's explicit recommendation is "use GET /listings and
 *    GET /listings/:id instead" (§7.6) — so this isn't a case of just
 *    fixing the import, the underlying calls needed to be replaced.
 *
 * getBusinesses/getBusinessById are deleted rather than kept as dead
 * code — they were unused everywhere already (grepped: only their own
 * hooks referenced them), and leaving a compiling-but-broken pair of
 * functions around is exactly the trap the backend doc warns about:
 * "sitting there ready to be wired up by someone who doesn't know
 * better." useBusinesses/useBusinessDetail now delegate to the
 * equivalents below (see their files for the deprecation notes).
 */

export interface GetListingsParams {
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

export const businessDiscoveryApi = {
  /** Backend: GET /listings?page=&limit= — public, paginated. Replaces the broken GET /businesses. */
  getListings: async (params?: GetListingsParams) => {
    const { data } = await apiClient.get<PaginatedListingsResponse<Listing>>("/listings", { params });
    return data;
  },

  /** Backend: GET /listings/:id — public. Replaces the broken GET /businesses/:id. */
  getListingById: async (id: string) => {
    const { data } = await apiClient.get<Listing>(`/listings/${id}`);
    return data;
  },

  /** Backend: GET /listings/search?q=&page=&limit= — public, paginated, real full-text search. */
  searchListings: async (query: string, params?: GetListingsParams) => {
    const { data } = await apiClient.get<PaginatedListingsResponse<Listing>>("/listings/search", {
      params: { q: query, ...params },
    });
    return data;
  },

  /** Backend: GET /listings/nearby?lat=&lng=&radius=&page=&limit= — public, paginated. */
  getNearby: async (params: GetNearbyParams) => {
    const { data } = await apiClient.get<PaginatedListingsResponse<NearbyListing>>("/listings/nearby", { params });
    return data;
  },
};
