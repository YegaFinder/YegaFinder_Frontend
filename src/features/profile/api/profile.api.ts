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

  /**
   * §9.3 — Pattern A, direct multipart to /profile/avatar.
   * Real S3 upload as of the Sprint 3 backend carry-over fix ("finish
   * real S3 uploads for avatar/logo/banner/gallery") — this used to be
   * a stub that fabricated a fake URL, which is why ProfileAvatar.tsx
   * previously routed around it through /uploads/presign instead. Now
   * that the documented endpoint is live, ProfileAvatar.tsx calls this
   * directly, same as uploadLogo/uploadBanner below.
   */
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<ApiEnvelope<{ avatarUrl: string }>>("/profile/avatar", form);
    return data.data;
  },
};