"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response"; 


export type UploadType = "avatar" | "logo" | "banner" | "document";

export const ALLOWED_FILE_TYPES: Record<UploadType, string[]> = {
  avatar: ["image/jpeg", "image/png", "image/webp"],
  logo: ["image/jpeg", "image/png", "image/webp"],
  banner: ["image/jpeg", "image/png", "image/webp"],
  document: ["application/pdf", "image/jpeg", "image/png"],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB, per FRONTEND_INTEGRATION_GUIDE.md

interface PresignResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

// This hook handles image uploads to the backend and S3, including progress tracking and error handling. It returns the uploaded file URL on success.
export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File, uploadType: UploadType = "avatar"): Promise<string> => {
    const allowedTypes = ALLOWED_FILE_TYPES[uploadType];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Unsupported file type for ${uploadType}. Allowed: ${allowedTypes.join(", ")}`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File is too large. Max size is 10MB.");
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const { data } = await apiClient.post<ApiEnvelope<PresignResponse>>("/uploads/presign", {
  filename: file.name,
  contentType: file.type,
  uploadType,
});
const { uploadUrl, fileUrl } = data.data;

      // Plain XMLHttpRequest (not fetch/apiClient) specifically for
      // upload-progress events — fetch has no upload-progress API.
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload to storage failed (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error("Upload to storage failed — network error."));

        xhr.send(file);
      });

      return fileUrl;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, progress };
}