"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/features/business-discovery/api/categories.api";
import { normalizeCategoriesResponse } from "../utils/normalize-categories";

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