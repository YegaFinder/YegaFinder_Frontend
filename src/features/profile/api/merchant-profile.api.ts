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
   *
   * TEMPORARY WORKAROUND for a backend envelope bug (see backend review
   * action item #2): this controller returns `{ success, businessHours }`
   * instead of `{ data: { businessHours } }`, and because that payload
   * has no `message`/`data` keys of its own, TransformInterceptor's `??`
   * fallback re-substitutes the whole object as `data`. Net result: the
   * array currently lives two levels deep — response.data.data.businessHours
   * — instead of response.data.data like every other endpoint.
   *
   * This unwrap checks BOTH shapes, so the frontend keeps working the
   * instant the backend fix ships with no further frontend change
   * needed. Once fixed, `inner` will already be `BusinessHours[]`
   * directly and the `"businessHours" in inner` branch simply stops
   * being hit — safe to delete then, but harmless to leave.
   */
  updateBusinessHours: async (payload: UpdateBusinessHoursRequest): Promise<BusinessHours[]> => {
    const { data } = await apiClient.put<
      ApiEnvelope<BusinessHours[] | { success: boolean; businessHours: BusinessHours[] }>
    >("/profiles/merchant/business-hours", payload);

    const inner = data.data;
    if (inner && typeof inner === "object" && !Array.isArray(inner) && "businessHours" in inner) {
      return inner.businessHours;
    }
    return inner as BusinessHours[];
  },
};