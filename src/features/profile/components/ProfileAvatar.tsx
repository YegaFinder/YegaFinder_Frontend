"use client";

import { ImageUploadField } from "@/components/shared/image-upload-field";
import { useUpdateAvatar } from "../hooks/useCustomerProfile";
import { useAuthStore } from "@/store/auth-store";
import type { CustomerProfile } from "../types/profile.types";

interface ProfileAvatarProps {
  profile: CustomerProfile;
  /** Called with the freshly-updated profile after a successful upload — wire this to the page's `refetch` (or just re-set local state) so the new avatar shows up without a full reload. */
  onProfileUpdated: (profile: CustomerProfile) => void;
}

/**
 * Shows the current avatar and lets the customer replace it, using the
 * shared `ImageUploadField` (5MB / jpeg-png-webp check + real presigned
 * S3 upload already built into lib/hooks/useImageUpload.ts on main).
 * Initials come from the auth store's `User` since name isn't part of
 * `CustomerProfile` — see CustomerProfileForm.tsx's docblock.
 */
export function ProfileAvatar({ profile, onProfileUpdated }: ProfileAvatarProps) {
  const { updateAvatar, isSaving } = useUpdateAvatar(onProfileUpdated);
  const authUser = useAuthStore((state) => state.user);
  const initials = `${authUser?.firstName?.[0] ?? ""}${authUser?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="flex items-center gap-5">
      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-yegna-background text-xl font-semibold text-yegna-primary">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatarUrl} alt="Profile photo" className="size-full object-cover" />
        ) : (
          initials || "?"
        )}
      </div>

      <div className="w-full max-w-xs">
        <ImageUploadField
          label="Change photo"
          uploadType="avatar"
          aspectRatio="square"
          onUploadSuccess={(url) => updateAvatar(url)}
        />
        {isSaving && <p className="mt-1 text-xs text-muted-foreground">Saving…</p>}
      </div>
    </div>
  );
}