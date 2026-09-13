"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/features/business-discovery/api/categories.api";
import { normalizeCategoriesResponse } from "../utils/normalize-categories";

/**
 * Deliberately reuses business-discovery's categoriesApi rather than
 * duplicating a second categories client — categories are shared taxonomy
 * data, not something either feature owns exclusively.
 *
 * FIXED: GET /categories/:id/subcategories doesn't exist in the confirmed
 * API reference. Subcategories come nested inside GET /categories/:id's
 * response instead, so this now calls getCategoryById and reads
 * `.subCategories` off the result.
 */
export function useSubcategories(categoryId?: string) {
  const query = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => categoriesApi.getCategoryById(categoryId as string),
    enabled: !!categoryId,
  });

  return {
    subcategories: normalizeCategoriesResponse(query.data?.data?.subCategories),
    isLoading: query.isLoading,
    isError: query.isError,
  };
}