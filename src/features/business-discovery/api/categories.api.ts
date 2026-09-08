import { apiClient } from "@/lib/api-client";
import type { Category } from "@/types/business.types";

export const categoriesApi = {
  getCategories: async () => {
    const { data } = await apiClient.get<{ data: Category[] }>("/categories");
    return data;
  },
  getSubcategories: async (categoryId: string) => {
    const { data } = await apiClient.get<{ data: Category[] }>(`/categories/${categoryId}/subcategories`);
    return data;
  },
};