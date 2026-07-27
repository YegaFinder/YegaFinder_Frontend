import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";

export interface Promotion {
  id: string;
  businessId: string;
  code: string;
  description?: string;
  discountPercentage?: number;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionRequest {
  code: string;
  description?: string;
  discountPercentage?: number;
  validUntil: string;
  isActive?: boolean;
}

export const promotionsApi = {
  /** Backend: GET /merchant/promotions — bare array */
  list: async (): Promise<Promotion[]> => {
    const { data } = await apiClient.get<ApiEnvelope<Promotion[]>>("/merchant/promotions");
    return data.data;
  },

  /**
   * Backend: POST /merchant/promotions
   * ⚠️ No server-side validation at all (BACKEND_API_GUIDE.md §10.2) —
   * discountPercentage isn't range-checked, validUntil isn't date-checked,
   * and code isn't checked for uniqueness. All enforced client-side below.
   */
  create: async (payload: CreatePromotionRequest): Promise<Promotion> => {
    const { data } = await apiClient.post<ApiEnvelope<Promotion>>("/merchant/promotions", payload);
    return data.data;
  },

  /** Backend: DELETE /merchant/promotions/:id — scoped to caller's own business, always 200 */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/merchant/promotions/${id}`);
  },
};