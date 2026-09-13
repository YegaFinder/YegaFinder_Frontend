import { apiClient } from "@/lib/api-client";
import type { AdminListing, ListingApprovalStatus } from "../types/admin-listing.types";

// Backend wraps every response in { success, message, data, timestamp }
// (TransformInterceptor) - always unwrap .data, never read the top level.
interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const adminListingsApi = {
  async list(status?: ListingApprovalStatus): Promise<AdminListing[]> {
    const { data } = await apiClient.get<ApiEnvelope<{ listings: AdminListing[] }>>(
      "/admin/listings",
      { params: status ? { status } : undefined },
    );
    return data.data.listings;
  },

  async approve(id: string): Promise<AdminListing> {
    const { data } = await apiClient.post<ApiEnvelope<AdminListing>>(
      `/admin/listings/${id}/approve`,
    );
    return data.data;
  },

  async reject(id: string, reason: string): Promise<AdminListing> {
    const { data } = await apiClient.post<ApiEnvelope<AdminListing>>(
      `/admin/listings/${id}/reject`,
      { reason },
    );
    return data.data;
  },
};