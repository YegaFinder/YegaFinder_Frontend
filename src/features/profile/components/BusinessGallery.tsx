"use client";

import { useState } from "react";
import { ImagePlus, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Spinner } from "@/components/shared/form-feedback";
import { useImageUpload } from "@/lib/hooks/useImageUpload";

interface GalleryPhoto {
  id: string;
  url: string;
}

/**
 * ⚠️ `GET/POST/DELETE /merchant/gallery` are fully stubbed server-side —
 * GET always returns [], POST parses files but never persists them, and
 * the real `business_gallery` table is never read/written by any code
 * path (BACKEND_API_GUIDE.md §5.7, §11). Calling those three endpoints
 * for real photo storage would be pointless right now.
 *
 * What IS real: the presigned-S3 upload flow (§6), so photos uploaded
 * here get real, working, hosted URLs. This component keeps the photo
 * list in local state for the session so it's fully usable for demos and
 * previews today — it will not survive a refresh until the backend
 * actually wires up §5.7. Swap the local state below for the gallery API
 * calls once that ships.
 */
export function BusinessGallery() {
  const { uploadImage, isUploading, progress } = useImageUpload();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    for (const file of files) {
      try {
        const url = await uploadImage(file, "document"); // accepts jpeg/png, same S3 pipeline
        setPhotos((prev) => [...prev, { id: crypto.randomUUID(), url }]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Failed to upload ${file.name}`);
      }
    }
    toast.success("Photos added to your gallery.");
    e.target.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
        <span>Gallery photos aren&apos;t saved on the backend yet — they&apos;ll reset on refresh for now.</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((photo) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-[14px] border border-yegna-border">
            <img src={photo.url} alt="Business gallery photo" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(photo.id)}
              className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
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
            accept="image/jpeg,image/png"
            multiple
            className="hidden"
            disabled={isUploading}
            onChange={handleFilesChange}
          />
        </label>
      </div>
    </div>
  );
}