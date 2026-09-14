import { apiClient } from "@/lib/api-client";
import { unwrapMaybeEnveloped } from "@/lib/api-response";
import type { Review, NewReview } from "@/types/business.types";

export const reviewsApi = {
  // §5.1 — Pattern C, direct array, public, no auth
  getReviews: async (businessId: string): Promise<Review[]> => {
    const { data } = await apiClient.get<Review[]>(`/businesses/${businessId}/reviews`);
    return Array.isArray(data) ? data : [];
  },

  // §5.2 — documented as "might not have full envelope," handled defensively
  submitReview: async (businessId: string, payload: NewReview): Promise<Review> => {
    const { data } = await apiClient.post<unknown>(`/businesses/${businessId}/reviews`, payload);
    return unwrapMaybeEnveloped<Review>(data);
  },
};