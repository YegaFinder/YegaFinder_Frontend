"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { favoritesApi } from "../api/favorites.api";
import { getErrorMessage } from "@/lib/errors";

export const FAVORITES_QUERY_KEY = ["favorites"] as const;

export function useFavorites() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: favoritesApi.getFavorites,
  });

  const removeMutation = useMutation({
    mutationFn: (businessId: string) => favoritesApi.removeFavorite(businessId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
      toast.success("Removed from favorites.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return {
    favorites: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    removeFavorite: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
  };
}