
import { apiClient } from "@/lib/api-client";
import type { BusinessCategory } from "@/types/business.types";

export const categoriesApi = {
  /** Backend: GET /categories — top-level categories only, each with subCategories embedded. */
  getCategories: async () => {
    const { data } = await apiClient.get<{ data: BusinessCategory[] }>("/categories");
    return data;
  },

  /**
   * FIXED: there is no GET /categories/:id/subcategories endpoint on the
   * backend (confirmed — categories.controller.ts only has GET /, GET /:id,
   * POST, PUT, DELETE). Subcategories come back embedded on GET /categories/:id
   * as `subCategories`. This function now fetches the parent category and
   * pulls that array out, so every existing caller (useSubcategories, etc.)
   * keeps working with no change on their end.
   */
  getSubcategories: async (categoryId: string) => {
    const { data } = await apiClient.get<{ data: Category }>(`/categories/${categoryId}`);
    return { data: data.data.subCategories ?? [] };
  },
};