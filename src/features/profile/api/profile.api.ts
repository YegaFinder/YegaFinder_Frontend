import { apiClient } from "@/lib/api-client";
import { ApiEnvelope } from "@/lib/api-response";   // fixed – now uses ApiEnvelope
import type {
  CustomerProfile,
  UpdateCustomerProfileRequest,
  UpdateNotificationPreferencesRequest,
  CreateSavedAddressRequest,
  UpdateSavedAddressRequest,
  SavedAddress,
} from "../types/profile.types";

export const profileApi = {
  // GET /profile/me
  async getMyProfile(): Promise<CustomerProfile> {
    const res = await apiClient.get<ApiEnvelope<CustomerProfile>>("/profile/me");
    return res.data.data;
  },

  // PATCH /profile/me (updates avatar, bio, etc.)
  async updateProfile(payload: UpdateCustomerProfileRequest): Promise<CustomerProfile> {
    const res = await apiClient.patch<ApiEnvelope<CustomerProfile>>("/profile/me", payload);
    return res.data.data;
  },

  // GET /profile/addresses
  async getSavedAddresses(): Promise<SavedAddress[]> {
    const res = await apiClient.get<ApiEnvelope<SavedAddress[]>>("/profile/addresses");
    return res.data.data;
  },

  // POST /profile/addresses
  async createSavedAddress(payload: CreateSavedAddressRequest): Promise<SavedAddress> {
    const res = await apiClient.post<ApiEnvelope<SavedAddress>>("/profile/addresses", payload);
    return res.data.data;
  },

  // PUT /profile/addresses/:id
  async updateSavedAddress({ id, ...payload }: UpdateSavedAddressRequest): Promise<SavedAddress> {
    const res = await apiClient.put<ApiEnvelope<SavedAddress>>(`/profile/addresses/${id}`, payload);
    return res.data.data;
  },

  // DELETE /profile/addresses/:id
  async deleteSavedAddress(id: string): Promise<void> {
    await apiClient.delete(`/profile/addresses/${id}`);
  },

  // PATCH /profile/me/notifications (assumed endpoint)
  async updateNotificationPreferences(
    payload: UpdateNotificationPreferencesRequest,
  ): Promise<CustomerProfile> {
    const res = await apiClient.patch<ApiEnvelope<CustomerProfile>>(
      "/profile/me/notifications",
      payload,
    );
    return res.data.data;
  },
};