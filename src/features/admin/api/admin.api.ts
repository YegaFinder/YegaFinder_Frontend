import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type { Business, Review, AdminAnalyticsSummary, RejectListingRequest } from "../types/admin.types";

export const adminApi = {
  // §11.1 — Pattern A, direct array in data
  getListingsForApproval: async (status?: "PENDING" | "APPROVED" | "REJECTED"): Promise<Business[]> => {
    const { data } = await apiClient.get<ApiEnvelope<Business[]>>("/admin/listings", { params: { status } });
    return data.data;
  },

  approveListing: async (businessId: string): Promise<Business> => {
    const { data } = await apiClient.post<ApiEnvelope<Business>>(`/admin/listings/${businessId}/approve`);
    return data.data;
  },

  rejectListing: async (businessId: string, payload: RejectListingRequest): Promise<Business> => {
    const { data } = await apiClient.post<ApiEnvelope<Business>>(`/admin/listings/${businessId}/reject`, payload);
    return data.data;
  },

  // §11.4 — Pattern A, nested pagination
  getReviewsForModeration: async (page = 1, limit = 20) => {
    const { data } = await apiClient.get<ApiEnvelope<{ data: Review[]; total: number; page: number }>>(
      "/admin/reviews",
      { params: { page, limit } },
    );
    return data.data;
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    await apiClient.delete(`/admin/reviews/${reviewId}`);
  },

  getAnalyticsSummary: async (): Promise<AdminAnalyticsSummary> => {
    const { data } = await apiClient.get<ApiEnvelope<AdminAnalyticsSummary>>("/admin/analytics/summary");
    return data.data;
  },
};