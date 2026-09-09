import { apiClient } from "@/lib/api-client";
import type { BusinessListItem, BusinessDetail } from "@/types/business.types";

export interface GetBusinessesParams {
  category?: string; // unconfirmed: is this a category id or name? ask backend
  page?: number;
  limit?: number;
}

// Matches the doc's actual example payloads, not the app's existing
// ApiResponse/PaginatedResponse types — those disagree on meta field names
// and whether "success" is present. Confirm with backend before Sprint 4.
interface BusinessListResponse {
  data: BusinessListItem[];
  meta: { total: number; page: number; limit: number };
}
interface BusinessDetailResponse {
  data: BusinessDetail;
}

export const businessDiscoveryApi = {
  getBusinesses: async (params: GetBusinessesParams) => {
    const { data } = await apiClient.get<BusinessListResponse>("/businesses", { params });
    return data;
  },

  getBusinessById: async (id: string) => {
    const { data } = await apiClient.get<BusinessDetailResponse>(`/businesses/${id}`);
    return data;
  },
};