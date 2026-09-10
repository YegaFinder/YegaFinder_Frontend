"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { businessListingsApi } from "../api/business-listings.api";
import { getErrorMessage } from "@/lib/errors";
import type { BusinessListingGalleryPhoto } from "@/types/business.types";

export function galleryQueryKey(listingId: string) {
  return ["business-listings", "gallery", listingId] as const;
}

/**
 * Real replacement for BusinessGallery.tsx's Sprint 2 stub — photos are
 * persisted via the API instead of local component state, so the gallery
 * survives a page refresh.
 */
export function useListingGallery(listingId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: galleryQueryKey(listingId),
    queryFn: () => businessListingsApi.getGallery(listingId),
    enabled: !!listingId,
  });

  const addMutation = useMutation({
    mutationFn: (fileUrl: string) => businessListingsApi.addGalleryPhoto(listingId, fileUrl),
    onSuccess: (photo) => {
      queryClient.setQueryData<BusinessListingGalleryPhoto[]>(galleryQueryKey(listingId), (old) =>
        old ? [...old, photo] : [photo],
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const removeMutation = useMutation({
    mutationFn: (photoId: string) => businessListingsApi.deleteGalleryPhoto(listingId, photoId),
    onSuccess: (_, photoId) => {
      queryClient.setQueryData<BusinessListingGalleryPhoto[]>(galleryQueryKey(listingId), (old) =>
        old?.filter((p) => p.id !== photoId),
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    photos: query.data ?? [],
    isLoading: query.isLoading,

    addPhoto: addMutation.mutateAsync,
    isAdding: addMutation.isPending,

    removePhoto: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
  };
}