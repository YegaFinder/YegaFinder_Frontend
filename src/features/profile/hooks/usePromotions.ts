"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { promotionsApi, type CreatePromotionRequest } from "../api/promotions.api";
import { getErrorMessage } from "@/lib/errors";

export const PROMOTIONS_QUERY_KEY = ["merchant", "promotions"] as const;

export function usePromotions() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: PROMOTIONS_QUERY_KEY,
    queryFn: promotionsApi.list,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreatePromotionRequest) => promotionsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTIONS_QUERY_KEY });
      toast.success("Promotion created.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => promotionsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTIONS_QUERY_KEY });
      toast.success("Promotion removed.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return {
    promotions: query.data ?? [],
    isLoading: query.isLoading,
    createPromotion: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    removePromotion: removeMutation.mutateAsync,
  };
}