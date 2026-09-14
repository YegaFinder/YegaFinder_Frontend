"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/hooks/useImageUpload";
import { Button } from "@/components/ui/button";
import { useUpdateAvatar } from "../hooks/useCustomerProfile";
import { useAuthStore } from "@/store/auth-store";
import type { CustomerProfile } from "../types/profile.types";

interface ProfileAvatarProps {
  profile: CustomerProfile;
  onProfileUpdated: (profile: CustomerProfile) => void;
}

/**
 * Uploads straight to POST /profile/avatar (guide §9.3) — the same
 * direct multipart pattern merchants already use for logo/banner.
 * Client-side validation reuses the 10MB / jpeg-png-webp rules from
 * useImageUpload.ts (constants only — no presign call happens here).
 */
export function ProfileAvatar({ profile, onProfileUpdated }: ProfileAvatarProps) {
  const { updateAvatar, isSaving } = useUpdateAvatar(onProfileUpdated);
  const authUser = useAuthStore((state) => state.user);
  const initials = `${authUser?.firstName?.[0] ?? ""}${authUser?.lastName?.[0] ?? ""}`.toUpperCase();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Max size is 10MB.");
      return;
    }
    if (!ALLOWED_FILE_TYPES.avatar.includes(file.type)) {
      toast.error(`Unsupported file type. Allowed: ${ALLOWED_FILE_TYPES.avatar.join(", ")}`);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return localPreview;
    });

    await updateAvatar(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const displaySrc = preview ?? profile.avatarUrl ?? null;

  return (
    <div className="flex items-center gap-5">
      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-yegna-background text-xl font-semibold text-yegna-primary">
        {displaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displaySrc} alt="Profile photo" className="size-full object-cover" />
        ) : (
          initials || "?"
        )}
      </div>

      <div className="w-full max-w-xs">
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_FILE_TYPES.avatar.join(", ")}
          onChange={handleFileChange}
          disabled={isSaving}
          className="hidden"
          id="avatar-upload"
          aria-label="Change photo"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isSaving}
          onClick={() => fileInputRef.current?.click()}
        >
          {isSaving ? "Uploading…" : "Change photo"}
        </Button>
      </div>
    </div>
  );
}