"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import {
  merchantProfileApi,
  type UpdateMerchantProfileRequest,
  type BusinessHoursEntry,
} from "../api/merchant-profile.api";
import type { MerchantProfile } from "../types/profile.types";

export const merchantProfileKeys = {
  profile: ["profile", "merchant"] as const,
  hours: ["profile", "merchant", "business-hours"] as const,
};

/** First fetch for a merchant with no profile row yet (GET). */
export function useMerchantProfile() {
  const query = useQuery({
    queryKey: merchantProfileKeys.profile,
    queryFn: async (): Promise<MerchantProfile | null> => {
      try {
        return await merchantProfileApi.getProfile();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) return null;
        throw err;
      }
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/** First save for a merchant with no profile row yet (POST). */
export function useCreateMerchantProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMerchantProfileRequest & { businessName: string }) =>
      merchantProfileApi.createProfile(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(merchantProfileKeys.profile, profile);
      queryClient.invalidateQueries({ queryKey: merchantProfileKeys.profile });
    },
  });
}

/** Every edit once a profile exists — business details, contact info,
 * logo/banner (PUT). Called locally inside each form/handler so each
 * gets its own independent isPending/error state. */
export function useUpdateMerchantProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMerchantProfileRequest) => merchantProfileApi.updateProfile(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(merchantProfileKeys.profile, profile);
      queryClient.invalidateQueries({ queryKey: merchantProfileKeys.profile });
    },
  });
}


export function useBusinessHours() {
  const query = useQuery({
    queryKey: merchantProfileKeys.hours,
    queryFn: merchantProfileApi.getBusinessHours,
  });

  return {
    hours: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useUpdateBusinessHours() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hours: BusinessHoursEntry[]) => merchantProfileApi.updateBusinessHours(hours),
    onSuccess: (hours) => {
      queryClient.setQueryData(merchantProfileKeys.hours, hours);
      queryClient.invalidateQueries({ queryKey: merchantProfileKeys.hours });
    },
  });
}