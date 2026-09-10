import { apiClient } from "@/lib/api-client";
import type { Listing } from "../types/listing.types";

// Real endpoint is /listings, not /businesses — confirmed from backend
// source (public-listings.controller.ts). No query params supported
// server-side yet (no page/limit/category filtering exists there today).

interface ListingsResponse {
  listings: Listing[];
}

export const listingsApi = {
  getListings: async (): Promise<ListingsResponse> => {
    const { data } = await apiClient.get<ListingsResponse>("/listings");
    return data;
  },

  getListingById: async (id: string): Promise<Listing> => {
    const { data } = await apiClient.get<Listing>(`/listings/${id}`);
    return data;
  },
};
