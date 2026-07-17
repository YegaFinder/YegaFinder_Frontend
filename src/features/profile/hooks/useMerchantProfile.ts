"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { merchantProfileApi } from "../api/merchant-profile.api";
import { getErrorMessage } from "@/lib/errors";
import type {
  MerchantProfile,
  CreateMerchantProfileRequest,
  UpdateMerchantProfileRequest,
  UpdateBusinessHoursRequest,
} from "../types/profile.types";

/** Shared query key convention — every read AND every mutation's invalidation must use this exact tuple. */
export const MERCHANT_PROFILE_QUERY_KEY = ["profile", "merchant"] as const;

export function useMerchantProfile() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: MERCHANT_PROFILE_QUERY_KEY,
    queryFn: merchantProfileApi.getProfile,
    // A brand-new merchant legitimately has no profile yet (404) —
    // don't burn retries treating that as a transient failure.
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) return false;
      return failureCount < 1;
    },
  });

  const profileNotCreatedYet = axios.isAxiosError(query.error) && query.error.response?.status === 404;

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: MERCHANT_PROFILE_QUERY_KEY });
  }

  const createMutation = useMutation({
    mutationFn: (payload: CreateMerchantProfileRequest) => merchantProfileApi.createProfile(payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(MERCHANT_PROFILE_QUERY_KEY, data);
      await invalidate();
      toast.success("Business profile created.");
    },
    onError: async (error) => {
      // Same as the customer flow: the backend has been observed to
      // commit the create and still respond with an error (a stray 500
      // right after the insert, or a genuine 409 because an earlier
      // attempt already went through). Check whether the profile exists
      // now before treating this as a real failure.
      try {
        const existingProfile = await merchantProfileApi.getProfile();
        queryClient.setQueryData(MERCHANT_PROFILE_QUERY_KEY, existingProfile);
        toast.success("Business profile created.");
        return;
      } catch {
        // Genuinely wasn't created — fall through to the real error below.
      }
      toast.error(getErrorMessage(error, { 409: "A merchant profile already exists for this account." }));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateMerchantProfileRequest) => merchantProfileApi.updateProfile(payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(MERCHANT_PROFILE_QUERY_KEY, data);
      await invalidate();
      toast.success("Business details saved.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, { 404: "Create your business profile first." }));
    },
  });

  const updateHoursMutation = useMutation({
    mutationFn: (payload: UpdateBusinessHoursRequest) => merchantProfileApi.updateBusinessHours(payload),
    onSuccess: async (businessHours) => {
      queryClient.setQueryData<MerchantProfile | undefined>(MERCHANT_PROFILE_QUERY_KEY, (old) =>
        old ? { ...old, businessHours } : old,
      );
      await invalidate();
      toast.success("Business hours saved.");
    },
    onError: (error) => {
      // Business-rule messages here are real and safe to show verbatim
      // (§4.3) — Zod should catch these first; this is the fallback.
      toast.error(getErrorMessage(error));
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
    isUpdating: updateMutation.isPending,

    updateBusinessHours: updateHoursMutation.mutateAsync,
    isUpdatingHours: updateHoursMutation.isPending,
  };
}