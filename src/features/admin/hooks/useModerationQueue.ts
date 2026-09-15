"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "../api/admin.api";
import { getErrorMessage } from "@/lib/errors";

const queryKey = (page: number) => ["admin", "reviews", page] as const;

// §11.4/11.5 — matches FRONTEND_API_IMPLEMENTATION_GUIDE.md exactly.
export function useModerationQueue() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 20;

  const query = useQuery({
    queryKey: queryKey(page),
    queryFn: () => adminApi.getReviewsForModeration(page, limit),
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => adminApi.deleteReview(reviewId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("Review removed.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return {
    reviews: query.data?.data,
    total: query.data?.total ?? 0,
    page,
    limit,
    totalPages: query.data ? Math.max(1, Math.ceil(query.data.total / limit)) : 1,
    setPage,
    isLoading: query.isLoading,
    isError: query.isError,

    deleteReview: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.variables,
  };
}