import { apiClient } from "@/lib/api-client";
import type { Listing } from "../types/listing.types";

// Real endpoint is /listings, not /businesses - confirmed from backend
// source (public-listings.controller.ts). No query params supported
// server-side yet (no page/limit/category filtering exists there today).
//
// ENVELOPE NOTE: CommonModule registers TransformInterceptor globally via
// APP_INTERCEPTOR, and PublicListingsController has no per-controller
// opt-out - so this response is very likely wrapped as
// { success, message, data: { listings }, timestamp }, NOT the raw
// { listings } shape this file originally assumed. Could not confirm
// empirically (no reachable backend, local or Railway, as of this
// writing) - so this unwraps defensively for both shapes rather than
// guess wrong either way. Once a real backend is reachable, verify
// which branch actually fires and simplify this back to one shape.

interface ListingsResponse {
  listings: Listing[];
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

function unwrapListings(raw: ListingsResponse | ApiEnvelope<ListingsResponse>): Listing[] {
  if ("data" in raw && raw.data && "listings" in raw.data) {
    return raw.data.listings;
  }
  if ("listings" in raw) {
    return raw.listings;
  }
  return [];
}

export const listingsApi = {
  getListings: async (): Promise<ListingsResponse> => {
    const { data } = await apiClient.get<ListingsResponse | ApiEnvelope<ListingsResponse>>("/listings");
    return { listings: unwrapListings(data) };
  },

  getListingById: async (id: string): Promise<Listing> => {
    const { data } = await apiClient.get<Listing | ApiEnvelope<Listing>>(`/listings/${id}`);
    if ("data" in data && data.data) {
      return data.data;
    }
    return data as Listing;
  },
};