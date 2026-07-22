"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { useImageUpload, ALLOWED_FILE_TYPES, MAX_FILE_SIZE, type UploadType } from "@/lib/hooks/useImageUpload";
import { Button } from "@/components/ui/button";

interface ImageUploadFieldProps {
  label: string;
  /** Which presign bucket/validation rule this upload uses. */
  uploadType: UploadType;
  accept?: string;
  /**
   * The already-saved URL for this field (e.g. profile.logoUrl). Shown
   * whenever there's no fresher local preview — without this, a saved
   * image simply disappears the moment the component remounts (e.g.
   * after a page refresh), because `preview` is purely local state.
   */
  value?: string;
  onUploadSuccess: (url: string) => void;
  onRemove?: () => void;
  aspectRatio?: "square" | "video" | "auto";
}

export function ImageUploadField({
  label,
  uploadType,
  accept,
  value,
  onUploadSuccess,
  onRemove,
  aspectRatio = "auto",
}: ImageUploadFieldProps) {
  const { uploadImage, isUploading, progress } = useImageUpload();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const resolvedAccept = accept ?? ALLOWED_FILE_TYPES[uploadType].join(", ");
  // A fresh local pick always wins; otherwise fall back to whatever is
  // already saved on the server.
  const displaySrc = preview ?? value ?? null;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Max size is 10MB.");
      return;
    }
    if (!ALLOWED_FILE_TYPES[uploadType].includes(file.type)) {
      toast.error(`Unsupported file type. Allowed: ${ALLOWED_FILE_TYPES[uploadType].join(", ")}`);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return localPreview;
    });

    try {
      const url = await uploadImage(file, uploadType);
      onUploadSuccess(url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Image upload failed:", err);
      }
      toast.error(err instanceof Error ? err.message : "Failed to upload image. Please try again.");
    }
  };

  function handleRemove() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onRemove?.();
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <div
        className={`relative flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20 ${
          aspectRatio === "square"
            ? "aspect-square w-32"
            : aspectRatio === "video"
              ? "aspect-video w-full"
              : "h-32 w-full"
        }`}
      >
        {displaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displaySrc} alt={`${label} preview`} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="text-center p-4">
            <span className="text-sm text-muted-foreground">Click to upload</span>
          </div>
        )}
        <input
          id={inputId}
          type="file"
          ref={fileInputRef}
          accept={resolvedAccept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
          aria-label={label}
        />
      </div>
      {isUploading && (
        <div className="w-full bg-secondary h-1 rounded-full overflow-hidden mt-2">
          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}
      {displaySrc && !isUploading && (
        <Button type="button" variant="ghost" size="sm" onClick={handleRemove} className="w-fit gap-1.5 text-muted-foreground">
          <X className="size-3.5" />
          Remove
        </Button>
      )}
    </div>
  );
}