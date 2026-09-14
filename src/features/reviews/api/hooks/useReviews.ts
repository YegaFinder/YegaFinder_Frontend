import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "../reviews.api";

export function useReviews(businessId: string) {
  return useQuery({
    queryKey: ["reviews", businessId],
    queryFn: () => reviewsApi.getReviews(businessId),
    enabled: !!businessId,
  });
}