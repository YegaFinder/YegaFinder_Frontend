
import { apiClient } from "@/lib/api-client";
import type { BusinessCategory } from "@/types/business.types";

export const categoriesApi = {
  getCategories: async () => {
    const { data } = await apiClient.get<{ data: BusinessCategory[] }>("/categories");
    return data;
  },
  getCategoryById: async (categoryId: string) => {
    const { data } = await apiClient.get<{ data: BusinessCategory }>(`/categories/${categoryId}`);
    return data;
  },
};