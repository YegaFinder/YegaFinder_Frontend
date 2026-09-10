"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Spinner } from "@/components/shared/form-feedback";
import { useImageUpload } from "@/lib/hooks/useImageUpload";
import { useListingGallery } from "../hooks/useListingGallery";

interface ListingGalleryUploaderProps {
  listingId: string;
}

/**
 * Real version of profile/BusinessGallery.tsx's Sprint 2 stub: photos are
 * persisted through useListingGallery instead of local component state, so
 * they survive a page refresh.
 */
export function ListingGalleryUploader({ listingId }: ListingGalleryUploaderProps) {
  const { uploadImage, isUploading, progress } = useImageUpload();
  const { photos, isLoading, addPhoto, removePhoto, isRemoving } = useListingGallery(listingId);

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    for (const file of files) {
      try {
        const fileUrl = await uploadImage(file, "gallery");
        await addPhoto(fileUrl);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Failed to upload ${file.name}`);
      }
    }
    e.target.value = "";
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
        <Spinner className="size-4" /> Loading gallery...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {photos.map((photo) => (
        <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-[14px] border border-yegna-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt="Listing gallery photo" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => removePhoto(photo.id)}
            disabled={isRemoving}
            className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
            aria-label="Remove photo"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}

      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] border-2 border-dashed border-yegna-border bg-yegna-background text-xs text-muted-foreground hover:border-yegna-primary/40">
        {isUploading ? (
          <>
            <Spinner />
            <span>{progress}%</span>
          </>
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
          disabled={isUploading}
          onChange={handleFilesChange}
        />
      </label>
    </div>
  );
}