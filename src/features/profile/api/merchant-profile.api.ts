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
  /** 404s if the merchant hasn't created a profile yet — the hook treats that as "no profile", not a fetch error. */
  getProfile: async (): Promise<MerchantProfile> => {
    const { data } = await apiClient.get<ApiEnvelope<MerchantProfile>>("/profiles/merchant");
    return data.data;
  },

  createProfile: async (payload: CreateMerchantProfileRequest): Promise<MerchantProfile> => {
    const { data } = await apiClient.post<ApiEnvelope<MerchantProfile>>("/profiles/merchant", payload);
    return data.data;
  },

  /** Partial merge server-side (Object.assign-style) — only send changed fields. */
  updateProfile: async (payload: UpdateMerchantProfileRequest): Promise<MerchantProfile> => {
    const { data } = await apiClient.put<ApiEnvelope<MerchantProfile>>("/profiles/merchant", payload);
    return data.data;
  },

  /**
   * Full delete-and-recreate (§5.9) — always send all 7 days.
   * This controller does NOT go through the ok() helper, so the §3
   * envelope bug fires unconditionally here: the real payload is
   * `{ success, businessHours }`, and because it has no `message`/`data`
   * keys of its own, the outer TransformInterceptor's `??` fallback
   * re-substitutes that whole object as `data`. Net result: the array
   * lives two levels deep — response.data.data.businessHours.
   */
  updateBusinessHours: async (payload: UpdateBusinessHoursRequest): Promise<BusinessHours[]> => {
    const { data } = await apiClient.put<ApiEnvelope<{ success: boolean; businessHours: BusinessHours[] }>>(
      "/profiles/merchant/business-hours",
      payload,
    );
    return data.data.businessHours;
  },
};