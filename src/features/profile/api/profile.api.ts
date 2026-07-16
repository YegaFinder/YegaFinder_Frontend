import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  CustomerProfile,
  SavedAddress,
  UpdateCustomerProfileRequest,
  UpdateNotificationPreferencesRequest,
  CreateSavedAddressRequest,
  UpdateSavedAddressRequest,
} from "../types/profile.types";

/**
 * Every profile-related HTTP call, in one place — mirrors the convention
 * in features/auth/api/auth.api.ts. Endpoint paths below (especially
 * anything under /profile/addresses and /profile/me/notifications) are
 * NOT yet confirmed against the backend. If/when the real contract
 * differs, this file is the only place that should need to change.
 */
export const profileApi = {
  getMyProfile: async (): Promise<CustomerProfile> => {
    const { data } = await apiClient.get<ApiResponse<CustomerProfile>>("/profile/me");
    return data.data;
  },

  /** Also used for the avatar update (see updateAvatar in useCustomerProfile.ts) — there's no separate avatar endpoint in the confirmed contract, so it's just an `avatarUrl` field on the same PATCH. */
  updateProfile: async (payload: UpdateCustomerProfileRequest): Promise<CustomerProfile> => {
    const { data } = await apiClient.patch<ApiResponse<CustomerProfile>>("/profile/me", payload);
    return data.data;
  },

  updateNotificationPreferences: async (
    payload: UpdateNotificationPreferencesRequest,
  ): Promise<CustomerProfile> => {
    const { data } = await apiClient.patch<ApiResponse<CustomerProfile>>(
      "/profile/me/notifications",
      payload,
    );
    return data.data;
  },

  listSavedAddresses: async (): Promise<SavedAddress[]> => {
    const { data } = await apiClient.get<ApiResponse<SavedAddress[]>>("/profile/addresses");
    return data.data;
  },

  createSavedAddress: async (payload: CreateSavedAddressRequest): Promise<SavedAddress> => {
    const { data } = await apiClient.post<ApiResponse<SavedAddress>>(
      "/profile/addresses",
      payload,
    );
    return data.data;
  },

  updateSavedAddress: async (
    id: string,
    payload: UpdateSavedAddressRequest,
  ): Promise<SavedAddress> => {
    const { data } = await apiClient.patch<ApiResponse<SavedAddress>>(
      `/profile/addresses/${id}`,
      payload,
    );
    return data.data;
  },

  deleteSavedAddress: async (id: string): Promise<void> => {
    await apiClient.delete(`/profile/addresses/${id}`);
  },
};
