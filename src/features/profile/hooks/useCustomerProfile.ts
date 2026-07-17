"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { profileApi } from "../api/profile.api";
import { getErrorMessage } from "@/lib/errors";
import type {
  CustomerProfile,
  CreateCustomerProfileRequest,
  UpdateCustomerProfileRequest,
} from "../types/profile.types";

/** Shared query key — every read AND every mutation's invalidation must use this exact tuple. */
export const CUSTOMER_PROFILE_QUERY_KEY = ["profile", "customer"] as const;

export function useCustomerProfile() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: CUSTOMER_PROFILE_QUERY_KEY,
    queryFn: profileApi.getProfile,
    // A brand-new customer legitimately has no profile yet (404) — don't
    // burn retries treating that as a transient failure.
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  const profileNotCreatedYet = axios.isAxiosError(query.error) && query.error.response?.status === 404;

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: CUSTOMER_PROFILE_QUERY_KEY });
  }

  const createMutation = useMutation({
    mutationFn: (payload: CreateCustomerProfileRequest) => profileApi.createProfile(payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(CUSTOMER_PROFILE_QUERY_KEY, data);
      await invalidate();
      toast.success("Profile created.");
    },
    onError: async (error) => {
      // The backend has been observed to commit the create and still
      // respond with an error (a stray 500 right after the insert, or a
      // genuine 409 because an earlier attempt already went through).
      // Rather than trust the error response blindly, check whether a
      // profile exists now — if it does, this is actually a success, so
      // the user shouldn't have to reload or hit "Create" twice.
      try {
        const existingProfile = await profileApi.getProfile();
        queryClient.setQueryData(CUSTOMER_PROFILE_QUERY_KEY, existingProfile);
        toast.success("Profile created.");
        return;
      } catch {
        // Genuinely wasn't created — fall through to the real error below.
      }
      toast.error(getErrorMessage(error, { 409: "A profile already exists for this account." }));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateCustomerProfileRequest) => profileApi.updateProfile(payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(CUSTOMER_PROFILE_QUERY_KEY, data);
      await invalidate();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, { 404: "Create your profile first." }));
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError && !profileNotCreatedYet,
    profileNotCreatedYet,
    error: query.error,
    refetch: query.refetch,

    createProfile: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    // Kept as `updateProfile` / `isSaving` for drop-in compatibility with
    // existing callers (CustomerProfileForm, ProfileAvatar, notifications).
    updateProfile: updateMutation.mutateAsync,
    isSaving: updateMutation.isPending,
  };
}

/**
 * Submits profile edits (dateOfBirth/bio/preferredLanguage). Name and
 * phone live on `User` and have no confirmed edit endpoint yet, so
 * there's nothing to sync back into the auth store from this call.
 */
export function useUpdateProfile(onSuccess?: (profile: CustomerProfile) => void) {
  const { updateProfile, isSaving } = useCustomerProfile();
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: UpdateCustomerProfileRequest) {
    setError(null);
    try {
      const updated = await updateProfile(payload);
      toast.success("Profile updated.");
      onSuccess?.(updated);
      return updated;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    }
  }

  return { updateProfile: submit, isSaving, error };
}

/**
 * Updates the avatar via the same PUT /profiles/customer used for the
 * rest of the profile — there's no separate avatar endpoint in the
 * confirmed contract, and the two-step S3 upload flow requires manually
 * PUTting the resulting `fileUrl` into this field yourself (§6.21).
 */
export function useUpdateAvatar(onSuccess: (profile: CustomerProfile) => void) {
  const { updateProfile, isSaving } = useCustomerProfile();

  async function updateAvatar(avatarUrl: string) {
    try {
      const updated = await updateProfile({ avatarUrl });
      toast.success("Profile photo updated.");
      onSuccess(updated);
      return updated;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return null;
    }
  }

  return { updateAvatar, isSaving };
}

/**
 * There is no separate notifications endpoint — `notificationPreferences`
 * is a top-level field on the same profile resource, replaced wholesale
 * on every PUT. The caller (NotificationPreferences.tsx) already builds
 * the full `{ ...preferences, [key]: checked }` object before calling
 * this, so a plain pass-through PUT is correct.
 */
export function useUpdateNotificationPreferences(onSuccess?: (profile: CustomerProfile) => void) {
  const { updateProfile, isSaving } = useCustomerProfile();

  async function updatePreferences(payload: { notificationPreferences: Record<string, boolean> }) {
    try {
      const updated = await updateProfile(payload);
      toast.success("Notification preferences saved.");
      onSuccess?.(updated);
      return updated;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return null;
    }
  }

  return { updatePreferences, isSaving };
}