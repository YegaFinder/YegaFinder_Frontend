import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type { BusinessCategory } from "@/types/business.types";

export const categoriesApi = {
  // Pattern A, no auth required — public endpoint per the guide
  getCategories: async (): Promise<BusinessCategory[]> => {
    const { data } = await apiClient.get<ApiEnvelope<BusinessCategory[]>>("/categories");
    return data.data;
  },
};