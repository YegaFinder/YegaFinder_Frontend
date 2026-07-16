import { apiClient } from "@/lib/api-client";
import { unwrapApiResponse } from "@/lib/api-response";
import type { MerchantProfile, BusinessHours, DayOfWeek } from "../types/profile.types";



export type UpdateMerchantProfileRequest = Partial<{
  businessName: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  
}>;

export interface BusinessHoursEntry {
  dayOfWeek: DayOfWeek;
  openTime?: string;
  closeTime?: string;
  isClosed: boolean;
  is24Hours: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
}

export const merchantProfileApi = {
 
  getProfile: async (): Promise<MerchantProfile> => {
    const { data } = await apiClient.get("/profiles/merchant");
    return unwrapApiResponse<MerchantProfile>(data);
  },

  createProfile: async (
    payload: UpdateMerchantProfileRequest & { businessName: string },
  ): Promise<MerchantProfile> => {
    const { data } = await apiClient.post("/profiles/merchant", payload);
    return unwrapApiResponse<MerchantProfile>(data);
  },

  updateProfile: async (payload: UpdateMerchantProfileRequest): Promise<MerchantProfile> => {
    const { data } = await apiClient.put("/profiles/merchant", payload);
    return unwrapApiResponse<MerchantProfile>(data);
  },

  
  getBusinessHours: async (): Promise<BusinessHours[]> => {
    const { data } = await apiClient.get("/profiles/merchant/business-hours");
    return data.businessHours ?? [];
  },

  updateBusinessHours: async (hours: BusinessHoursEntry[]): Promise<BusinessHours[]> => {
    const { data } = await apiClient.put("/profiles/merchant/business-hours", {
      businessHours: hours,
    });
    return data.businessHours ?? [];
  },

  
  isOpen: async (): Promise<boolean> => {
    const { data } = await apiClient.get("/profiles/merchant/is-open");
    return !!data.isOpen;
  },
};