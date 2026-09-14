import { apiClient } from "@/lib/api-client";
import type { Review, NewReview } from "@/types/business.types";

export const reviewsApi = {
  // §5.1 — Pattern C, public, no auth
  getReviews: async (businessId: string): Promise<Review[]> => {
    const { data } = await apiClient.get<Review[]>(`/businesses/${businessId}/reviews`);
    return data;
  },

  // §5.2 — Pattern C, auth required
  submitReview: async (businessId: string, payload: NewReview): Promise<Review> => {
    const { data } = await apiClient.post<Review>(`/businesses/${businessId}/reviews`, payload);
    return data;
  },
};