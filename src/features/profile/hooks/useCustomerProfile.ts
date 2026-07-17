"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { profileApi } from "../api/profile.api";
import { getErrorMessage } from "@/lib/errors";
import type {
  CustomerProfile,
  UpdateCustomerProfileRequest,
  UpdateNotificationPreferencesRequest,
} from "../types/profile.types";

/**
 * Fetches the current customer's profile on mount. Follows the same
 * manual useState + try/catch shape as features/auth's hooks rather than
 * TanStack Query's useQuery, to stay consistent with the rest of the
 * codebase. `refetch` is exposed so mutation hooks below (or the page
 * itself) can pull fresh data after a write without a page reload.
 */
export function useCustomerProfile() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profileApi.getMyProfile();
      setProfile(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, isLoading, error, refetch: fetchProfile };
}

/**
 * Submits profile edits (dateOfBirth/bio/preferredLanguage — see
 * profile.schema.ts's docblock for why name/phone aren't here). Name and
 * phone live on `User` and have no confirmed edit endpoint yet, so
 * there's nothing to sync back into the auth store from this call.
 */
export function useUpdateProfile(onSuccess?: (profile: CustomerProfile) => void) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateProfile(payload: UpdateCustomerProfileRequest) {
    setIsSaving(true);
    setError(null);
    try {
      const updated = await profileApi.updateProfile(payload);
      toast.success("Profile updated.");
      onSuccess?.(updated);
      return updated;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  return { updateProfile, isSaving, error };
}

/**
 * Updates the avatar via the same PATCH /profile/me used for the rest of
 * the profile (see profileApi.updateProfile's docblock) — there's no
 * separate avatar endpoint in the confirmed contract.
 *
 * `avatarUrl` lives on `CustomerProfile`, not on auth's `User`
 * (features/auth/types/auth.types.ts has no `avatarUrl` field), so there's
 * nothing to sync into the auth store here — AppHeader doesn't render an
 * avatar today. `onSuccess` is required and is how the caller (e.g.
 * ProfilePage passing its own `refetch`) gets the updated profile back
 * into view without a full reload.
 */
export function useUpdateAvatar(onSuccess: (profile: CustomerProfile) => void) {
  const [isSaving, setIsSaving] = useState(false);

  async function updateAvatar(avatarUrl: string) {
    setIsSaving(true);
    try {
      const updated = await profileApi.updateProfile({ avatarUrl });
      toast.success("Profile photo updated.");
      onSuccess(updated);
      return updated;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  return { updateAvatar, isSaving };
}

export function useUpdateNotificationPreferences(onSuccess?: (profile: CustomerProfile) => void) {
  const [isSaving, setIsSaving] = useState(false);

  async function updatePreferences(payload: UpdateNotificationPreferencesRequest) {
    setIsSaving(true);
    try {
      const updated = await profileApi.updateNotificationPreferences(payload);
      toast.success("Notification preferences saved.");
      onSuccess?.(updated);
      return updated;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  return { updatePreferences, isSaving };
}