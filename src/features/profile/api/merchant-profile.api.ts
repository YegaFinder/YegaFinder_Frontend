import { apiClient } from "@/lib/api-client";
import { unwrapFlexibleList, type ApiEnvelope } from "@/lib/api-response";
import type {
  MerchantProfile,
  BusinessHours,
  CreateMerchantProfileRequest,
  UpdateMerchantProfileRequest,
  UpdateBusinessHoursRequest,
  GalleryPhoto,
} from "../types/profile.types";

export const merchantProfileApi = {
  getProfile: async (): Promise<MerchantProfile> => {
    const { data } = await apiClient.get<ApiEnvelope<MerchantProfile>>("/merchant/profile");
    return data.data;
  },

  createProfile: async (payload: CreateMerchantProfileRequest): Promise<MerchantProfile> => {
    const { data } = await apiClient.post<ApiEnvelope<MerchantProfile>>("/merchant/profile", payload);
    return data.data;
  },

  updateProfile: async (payload: UpdateMerchantProfileRequest): Promise<MerchantProfile> => {
    const { data } = await apiClient.put<ApiEnvelope<MerchantProfile>>("/merchant/profile", payload);
    return data.data;
  },

  /** §10.4 — documented inconsistent envelope, handled defensively. */
  updateBusinessHours: async (payload: UpdateBusinessHoursRequest): Promise<BusinessHours[]> => {
    const { data } = await apiClient.put<unknown>("/merchant/business-hours", payload);
    return unwrapFlexibleList<BusinessHours>(data, "businessHours");
  },

  getBusinessHours: async (): Promise<BusinessHours[]> => {
    const { data } = await apiClient.get<unknown>("/merchant/business-hours");
    return unwrapFlexibleList<BusinessHours>(data, "businessHours");
  },

  uploadLogo: async (file: File): Promise<MerchantProfile> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<ApiEnvelope<MerchantProfile>>("/merchant/logo", form);
    return data.data;
  },

  uploadBanner: async (file: File): Promise<MerchantProfile> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await apiClient.post<ApiEnvelope<MerchantProfile>>("/merchant/banner", form);
    return data.data;
  },

  /** §10.7 — documented inconsistent envelope, handled defensively. */
  getGallery: async (): Promise<GalleryPhoto[]> => {
    const { data } = await apiClient.get<unknown>("/merchant/gallery");
    return unwrapFlexibleList<GalleryPhoto>(data, "gallery");
  },

  uploadGalleryPhotos: async (files: File[]): Promise<GalleryPhoto[]> => {
    const form = new FormData();
    files.forEach((file) => form.append("files", file)); // plural field name, per §10.7
    const { data } = await apiClient.post<unknown>("/merchant/gallery", form);
    return unwrapFlexibleList<GalleryPhoto>(data, "gallery");
  },

  deleteGalleryPhoto: async (photoId: string): Promise<void> => {
    await apiClient.delete(`/merchant/gallery/${photoId}`);
  },

  submitForApproval: async (): Promise<MerchantProfile> => {
    const { data } = await apiClient.post<ApiEnvelope<MerchantProfile>>("/merchant/listing/submit");
    return data.data;
  },
};