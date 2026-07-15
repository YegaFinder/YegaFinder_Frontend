"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { useImageUpload } from "@/lib/hooks/useImageUpload";
import { Button } from "@/components/ui/button";

interface ImageUploadFieldProps {
  label: string;
  accept?: string;
  onUploadSuccess: (url: string) => void;
  onRemove?: () => void;
  aspectRatio?: "square" | "video" | "auto";
}

export function ImageUploadField({
  label,
  accept = "image/jpeg, image/png, image/webp",
  onUploadSuccess,
  onRemove,
  aspectRatio = "auto",
}: ImageUploadFieldProps) {
  const { uploadImage, isUploading, progress } = useImageUpload();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  // object URLs from URL.createObjectURL() are never released by the
  // browser on their own — revoke on change/unmount to avoid leaking.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max size is 5MB.");
      return;
    }

    try {
      const url = await uploadImage(file);
      setPreview((old) => {
        if (old) URL.revokeObjectURL(old);
        return url;
      });
      onUploadSuccess(url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Image upload failed:", err);
      }
      toast.error("Failed to upload image. Please try again.");
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
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="text-center p-4">
            <span className="text-sm text-muted-foreground">Click to upload</span>
          </div>
        )}
        <input
          id={inputId}
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
          aria-label={label}
        />
      </div>
      {isUploading && (
        <div className="w-full bg-secondary h-1 rounded-full overflow-hidden mt-2">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {preview && !isUploading && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="w-fit gap-1.5 text-muted-foreground"
        >
          <X className="size-3.5" />
          Remove
        </Button>
      )}
    </div>
  );
}
