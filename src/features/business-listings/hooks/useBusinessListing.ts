"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { businessListingsApi } from "../api/business-listings.api";
import { getErrorMessage } from "@/lib/errors";
import { MY_LISTINGS_QUERY_KEY } from "./useMyListings";
import type { CreateListingRequest, UpdateListingRequest } from "../types/business-listing.types";

export function listingQueryKey(id: string) {
  return ["business-listings", "detail", id] as const;
}

/**
 * `id` is undefined on the "new listing" screen — the detail query is
 * disabled in that case, and only `createListing` gets used. On the edit
 * screen, `id` is always passed and all four operations are available.
 *
 * Combines read + write in one hook, same shape as useMerchantProfile —
 * the convention this codebase already uses for a single-resource feature.
 */
export function useBusinessListing(id?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: id ? listingQueryKey(id) : ["business-listings", "detail", "new"],
    queryFn: () => businessListingsApi.getListing(id as string),
    enabled: !!id,
  });

  function invalidateList() {
    return queryClient.invalidateQueries({ queryKey: MY_LISTINGS_QUERY_KEY });
  }

  const createMutation = useMutation({
    mutationFn: (payload: CreateListingRequest) => businessListingsApi.createListing(payload),
    onSuccess: async () => {
      await invalidateList();
      toast.success("Listing created — it'll go live once an admin approves it.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateListingRequest) => businessListingsApi.updateListing(id as string, payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(listingQueryKey(data.id), data);
      await invalidateList();
      toast.success("Listing updated.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => businessListingsApi.deleteListing(id as string),
    onSuccess: async () => {
      await invalidateList();
      toast.success("Listing removed.");
    },
    onError: (error) => {
      // A listing tied to active bookings almost certainly can't be
      // deleted outright once Sprint 5 ships — this is a safe guess at
      // the shape of that conflict now, cheap to adjust once the real
      // error message is known.
      toast.error(getErrorMessage(error, { 409: "This listing has active bookings and can't be deleted yet." }));
    },
  });

  return {
    listing: query.data,
    isLoading: query.isLoading,
    isError: query.isError,

    createListing: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateListing: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteListing: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}