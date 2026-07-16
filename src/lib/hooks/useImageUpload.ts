"use client";

import { useState } from "react";


const STUB_ALLOWED =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ALLOW_STUB_UPLOAD === "true";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string> => {
    if (!STUB_ALLOWED) {
      throw new Error(
        "useImageUpload is still a stub — wire it up to the real presigned-upload endpoint before shipping to production.",
      );
    }

    setIsUploading(true);
    setProgress(0);

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            resolve(URL.createObjectURL(file));
            return 100;
          }
          return prev + 25;
        });
      }, 500);
    });
  };

  return { uploadImage, isUploading, progress };
}