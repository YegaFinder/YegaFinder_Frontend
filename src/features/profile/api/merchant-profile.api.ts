import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type {
  MerchantProfile,
  BusinessHours,
  CreateMerchantProfileRequest,
  UpdateMerchantProfileRequest,
  UpdateBusinessHoursRequest,
  GalleryPhoto,
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
  const { data } = await apiClient.put<{
    success: boolean;
    businessHours: BusinessHours[];
  }>("/merchant/business-hours", payload);
  return data.businessHours ?? [];
},

  /** Backend: GET /merchant/business-hours */
  getBusinessHours: async (): Promise<BusinessHours[]> => {
  const { data } = await apiClient.get<{
    success: boolean;
    businessHours: BusinessHours[];
  }>("/merchant/business-hours");
  return data.businessHours ?? [];
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
  getGallery: async (): Promise<GalleryPhoto[]> => {
  const { data } = await apiClient.get<{
    success: boolean;
    gallery: GalleryPhoto[];
  }>("/merchant/gallery");
  return data.gallery ?? [];
},

  /** Backend: DELETE /merchant/gallery/:id */
  deleteGalleryPhoto: async (photoId: string): Promise<void> => {
    await apiClient.delete(`/merchant/gallery/${photoId}`);
  },

  uploadGalleryPhotos: async (files: File[]): Promise<GalleryPhoto[]> => {
  const form = new FormData();
  files.forEach((file) => form.append("files", file));
  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
    gallery: GalleryPhoto[];
  }>("/merchant/gallery", form);
  return data.gallery;
},
  /**
   * ADDED — Backend: POST /merchant/listing/submit (no body). Flips
   * listingStatus back to PENDING and isPublic to false, then waits on
   * an Admin/Moderator to approve it via /admin/listings/:id/approve.
   * Throws 400 if isProfileComplete is false — surface that as a clear
   * "finish your profile first" message, not a generic error.
   */
  submitForApproval: async (): Promise<MerchantProfile> => {
    const { data } = await apiClient.post<ApiEnvelope<MerchantProfile>>("/merchant/listing/submit");
    return data.data;
  },
};