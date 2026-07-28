"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { savedPlacesApi } from "../api/saved-places.api";
import { getErrorMessage } from "@/lib/errors";
import type { CreateSavedAddressRequest, UpdateSavedAddressRequest } from "../types/profile.types";

export const SAVED_PLACES_QUERY_KEY = ["saved-places"] as const;

export function useSavedAddresses() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SAVED_PLACES_QUERY_KEY,
    queryFn: savedPlacesApi.getSavedPlaces,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: SAVED_PLACES_QUERY_KEY });

  const addMutation = useMutation({
    mutationFn: (payload: CreateSavedAddressRequest) => savedPlacesApi.addSavedPlace(payload),
    onSuccess: async () => {
      await invalidate();
      toast.success("Address saved.");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }: UpdateSavedAddressRequest) => {
      await savedPlacesApi.deleteSavedPlace(id);
      return savedPlacesApi.addSavedPlace(payload);
    },
    onSuccess: async () => {
      await invalidate();
      toast.success("Address updated.");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => savedPlacesApi.deleteSavedPlace(id),
    onSuccess: async () => {
      await invalidate();
      toast.success("Address removed.");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return {
    addresses: query.data ?? [],
    isLoading: query.isLoading,
    isMutating: addMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    addAddress: async (payload: CreateSavedAddressRequest) => {
      try {
        await addMutation.mutateAsync(payload);
        return true;
      } catch {
        return false;
      }
    },
    updateAddress: async (payload: UpdateSavedAddressRequest) => {
      try {
        await updateMutation.mutateAsync(payload);
        return true;
      } catch {
        return false;
      }
    },
    deleteAddress: async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id);
        return true;
      } catch {
        return false;
      }
    },
  };
}