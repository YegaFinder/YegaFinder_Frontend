import { apiClient } from "@/lib/api-client";
import type { Listing } from "../types/listing.types";

// Real endpoint is /listings, not /businesses — confirmed from backend
// source (public-listings.controller.ts).
//
// FIXED: GET /listings DOES support page/limit query params server-side
// (YegnaFinder_Backend_Reference.md §7.1: "GET /api/v1/listings?page=1&limit=10").
// getListings() previously called it with no params at all, which meant
// every caller silently got only the default first page back — "search"
// built on top of that (SearchFeed.tsx) was really just client-side
// filtering over page 1, quietly missing businesses as the catalog grows.
// There's also a real, public, paginated full-text search endpoint,
// GET /listings/search?q=, that nothing in this feature was using.

export interface GetListingsParams {
  page?: number;
  limit?: number;
}

interface ListingsResponse {
  listings: Listing[];
  meta: { total: number; page: number; limit: number };
}

export const listingsApi = {
  getListings: async (params?: GetListingsParams): Promise<ListingsResponse> => {
    const { data } = await apiClient.get<ListingsResponse>("/listings", { params });
    return data;
  },

  getListingById: async (id: string): Promise<Listing> => {
    const { data } = await apiClient.get<Listing>(`/listings/${id}`);
    return data;
  },

  /** Backend: GET /listings/search?q=&page=&limit= — public, paginated, real full-text search. */
  searchListings: async (query: string, params?: GetListingsParams): Promise<ListingsResponse> => {
    const { data } = await apiClient.get<ListingsResponse>("/listings/search", {
      params: { q: query, ...params },
    });
    return data;
  },
};
