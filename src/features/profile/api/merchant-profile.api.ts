import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type {
  MerchantProfile,
  BusinessHours,
  CreateMerchantProfileRequest,
  UpdateMerchantProfileRequest,
  UpdateBusinessHoursRequest,
} from "../types/profile.types";

export const merchantProfileApi = {
  /** Backend: GET /merchant/profile */
  getProfile: async (): Promise<MerchantProfile> => {
    const { data } = await apiClient.get<ApiEnvelope<MerchantProfile>>("/merchant/profile");
    return data.data;
  },

  /** Backend: POST /merchant/profile */
  createProfile: async (payload: CreateMerchantProfileRequest): Promise<MerchantProfile> => {
    const { data } = await apiClient.post<ApiEnvelope<MerchantProfile>>("/merchant/profile", payload);
    return data.data;
  },

  /** Backend: PUT /merchant/profile — send all changed fields; businessName is required every time */
  updateProfile: async (payload: UpdateMerchantProfileRequest): Promise<MerchantProfile> => {
    const { data } = await apiClient.put<ApiEnvelope<MerchantProfile>>("/merchant/profile", payload);
    return data.data;
  },

  /**
   * Backend: PUT /merchant/business-hours
   *
   * TEMPORARY WORKAROUND: the backend returns `{ success, businessHours }`
   * instead of the standard `{ data: { ... } }` envelope. The frontend handles
   * both shapes so it keeps working the instant the backend fix ships.
   * Once the backend is normalized, the `"businessHours" in inner` branch
   * stops being hit — safe to delete then, but harmless to leave.
   */
  updateBusinessHours: async (payload: UpdateBusinessHoursRequest): Promise<BusinessHours[]> => {
    const { data } = await apiClient.put<
      ApiEnvelope<BusinessHours[] | { success: boolean; businessHours: BusinessHours[] }>
    >("/merchant/business-hours", payload);

    const inner = data.data;
    if (inner && typeof inner === "object" && !Array.isArray(inner) && "businessHours" in inner) {
      return inner.businessHours;
    }
    return inner as BusinessHours[];
  },

  /** Backend: GET /merchant/business-hours */
  getBusinessHours: async (): Promise<BusinessHours[]> => {
    const { data } = await apiClient.get<ApiEnvelope<{ businessHours: BusinessHours[] }>>("/merchant/business-hours");
    // Backend returns { businessHours: [...] } wrapped in the envelope
    const inner = data.data as unknown as { businessHours: BusinessHours[] };
    return inner?.businessHours ?? (data.data as unknown as BusinessHours[]);
  },

  /** Backend: POST /merchant/logo */
  uploadLogo: async (file: File): Promise<MerchantProfile> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<ApiEnvelope<MerchantProfile>>("/merchant/logo", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  /** Backend: POST /merchant/banner */
  uploadBanner: async (file: File): Promise<MerchantProfile> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<ApiEnvelope<MerchantProfile>>("/merchant/banner", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  /** Backend: GET /merchant/gallery */
  getGallery: async (): Promise<unknown[]> => {
    const { data } = await apiClient.get<ApiEnvelope<{ gallery: unknown[] }>>("/merchant/gallery");
    const inner = data.data as unknown as { gallery: unknown[] };
    return inner?.gallery ?? [];
  },

  /** Backend: DELETE /merchant/gallery/:id */
  deleteGalleryPhoto: async (photoId: string): Promise<void> => {
    await apiClient.delete(`/merchant/gallery/${photoId}`);
  },
};