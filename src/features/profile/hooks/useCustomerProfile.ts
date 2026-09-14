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

export const CUSTOMER_PROFILE_QUERY_KEY = ["profile", "customer"] as const;

export function useCustomerProfile() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: CUSTOMER_PROFILE_QUERY_KEY,
    queryFn: profileApi.getProfile,
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

    updateProfile: updateMutation.mutateAsync,
    isSaving: updateMutation.isPending,
  };
}

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
 * Uploads the avatar via POST /profile/avatar (guide §9.3). Sprint 3's
 * backend carry-over fix ("finish real S3 uploads for
 * avatar/logo/banner/gallery") retired the old fake-URL stub, so this
 * now goes straight to the documented endpoint — the same pattern
 * already used for logo/banner (see merchantProfileApi.uploadLogo /
 * uploadBanner) — instead of the undocumented /uploads/presign
 * workaround. That endpoint returns only `{ avatarUrl }`, not a full
 * profile, so we merge it into the cached profile ourselves rather than
 * relying on the response to replace the whole object.
 */
export function useUpdateAvatar(onSuccess: (profile: CustomerProfile) => void) {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  async function updateAvatar(file: File) {
    setIsSaving(true);
    try {
      const { avatarUrl } = await profileApi.uploadAvatar(file);

      const previous = queryClient.getQueryData<CustomerProfile>(CUSTOMER_PROFILE_QUERY_KEY);
      const updated: CustomerProfile = previous
        ? { ...previous, avatarUrl }
        : ({ avatarUrl } as CustomerProfile);

      queryClient.setQueryData(CUSTOMER_PROFILE_QUERY_KEY, updated);
      await queryClient.invalidateQueries({ queryKey: CUSTOMER_PROFILE_QUERY_KEY });

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