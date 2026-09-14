import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewsApi } from "../reviews.api";
import { getErrorMessage } from "@/lib/errors";
import type { NewReview } from "@/types/business.types";

export function useSubmitReview(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NewReview) => reviewsApi.submitReview(businessId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", businessId] });
      queryClient.invalidateQueries({ queryKey: ["business", businessId] }); // averageRating/totalReviews change
      toast.success("Review submitted!");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}