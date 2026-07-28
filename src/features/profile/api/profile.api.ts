import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type {
  CustomerProfile,
  CreateCustomerProfileRequest,
  UpdateCustomerProfileRequest,
} from "../types/profile.types";


export const profileApi = {
  /** Backend: GET /profile (controller @Controller('profile')) */
  getProfile: async (): Promise<CustomerProfile> => {
    const { data } = await apiClient.get<ApiEnvelope<CustomerProfile>>("/profile");
    return data.data;
  },

  /** Backend: POST /profile */
  createProfile: async (payload: CreateCustomerProfileRequest): Promise<CustomerProfile> => {
    const { data } = await apiClient.post<ApiEnvelope<CustomerProfile>>("/profile", payload);
    return data.data;
  },

  /** Backend: PUT /profile */
  updateProfile: async (payload: UpdateCustomerProfileRequest): Promise<CustomerProfile> => {
    const { data } = await apiClient.put<ApiEnvelope<CustomerProfile>>("/profile", payload);
    return data.data;
  },

  /** Backend: POST /profile/avatar */
  uploadAvatar: async (file: File): Promise<CustomerProfile> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<ApiEnvelope<CustomerProfile>>("/profile/avatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },
};