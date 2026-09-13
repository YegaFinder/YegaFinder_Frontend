"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Spinner } from "@/components/shared/form-feedback";
import { merchantProfileApi } from "../api/merchant-profile.api";
import { getErrorMessage } from "@/lib/errors";
import type { GalleryPhoto } from "../types/profile.types";

const GALLERY_QUERY_KEY = ["profile", "merchant", "gallery"] as const;
const MAX_GALLERY_PHOTOS = 20; // matches the backend's hard cap (business-gallery.service.ts)

/**
 * FIXED: this component previously believed the gallery endpoints were
 * stubbed server-side and kept photos in local React state only. That
 * assumption was wrong — POST/GET/DELETE /merchant/gallery genuinely
 * persist to the business_gallery table (confirmed in
 * business-gallery.service.ts). This now calls the real API.
 */
export function BusinessGallery() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: GALLERY_QUERY_KEY,
    queryFn: merchantProfileApi.getGallery as () => Promise<GalleryPhoto[]>,
  });

  const photos = query.data ?? [];

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => merchantProfileApi.uploadGalleryPhotos(files),
    onSuccess: (newPhotos) => {
      queryClient.setQueryData<GalleryPhoto[]>(GALLERY_QUERY_KEY, (old) => [...(old ?? []), ...newPhotos]);
      toast.success("Photos added to your gallery.");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, {
          400: `You can have at most ${MAX_GALLERY_PHOTOS} gallery photos.`,
        }),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (photoId: string) => merchantProfileApi.deleteGalleryPhoto(photoId),
    onMutate: async (photoId) => {
      const previous = queryClient.getQueryData<GalleryPhoto[]>(GALLERY_QUERY_KEY);
      queryClient.setQueryData<GalleryPhoto[]>(GALLERY_QUERY_KEY, (old) =>
        (old ?? []).filter((p) => p.id !== photoId),
      );
      return { previous };
    },
    onError: (error, _photoId, context) => {
      if (context?.previous) queryClient.setQueryData(GALLERY_QUERY_KEY, context.previous);
      toast.error(getErrorMessage(error));
    },
  });

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    if (photos.length + files.length > MAX_GALLERY_PHOTOS) {
      toast.error(`You can have at most ${MAX_GALLERY_PHOTOS} gallery photos (you have ${photos.length}).`);
      e.target.value = "";
      return;
    }

    try {
      await uploadMutation.mutateAsync(files);
    } catch {
      /* toast already shown */
    }
    e.target.value = "";
  }

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
        <Spinner className="size-5" /> Loading gallery...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {photos.map((photo) => (
        // eslint-disable-next-line @next/next/no-img-element
        <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-[14px] border border-yegna-border">
          <img src={photo.mediaUrl} alt={photo.caption ?? "Business gallery photo"} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => deleteMutation.mutate(photo.id)}
            disabled={deleteMutation.isPending}
            className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Remove photo"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}

      {photos.length < MAX_GALLERY_PHOTOS && (
        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] border-2 border-dashed border-yegna-border bg-yegna-background text-xs text-muted-foreground hover:border-yegna-primary/40">
          {uploadMutation.isPending ? (
            <Spinner />
          ) : (
            <>
              <ImagePlus className="size-5" />
              <span>Add photos</span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={uploadMutation.isPending}
            onChange={handleFilesChange}
          />
        </label>
      )}
    </div>
  );
}