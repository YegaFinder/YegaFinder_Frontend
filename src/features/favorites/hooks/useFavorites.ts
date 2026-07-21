"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { favoritesApi } from "../api/favorites.api";
import { getErrorMessage } from "@/lib/errors";

/** Shared query key — every read AND every mutation's invalidation must use this exact tuple. */
export const FAVORITES_QUERY_KEY = ["favorites"] as const;

/**
 * Defensive by design: the backend `/favorites` endpoints don't exist
 * yet (backend review action item #1), so a fresh install of this repo
 * will get a 404 from every call here. `endpointNotBuiltYet` lets the
 * page show a friendly "coming soon" state instead of a scary error
 * banner — once the backend module ships, this starts resolving
 * normally with no changes needed here.
 */
export function useFavorites() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: favoritesApi.getFavorites,
    retry: false,
  });

  const endpointNotBuiltYet =
    axios.isAxiosError(query.error) &&
    (query.error.response?.status === 404 || query.error.response?.status === 501);

  const removeMutation = useMutation({
    mutationFn: (businessId: string) => favoritesApi.removeFavorite(businessId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
      toast.success("Removed from favorites.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    favorites: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError && !endpointNotBuiltYet,
    endpointNotBuiltYet,
    removeFavorite: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
  };
}
