"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/features/business-discovery/api/categories.api";

export function useTopLevelCategories() {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getCategories(),
  });
  return { topLevel: query.data?.data ?? [], isLoading: query.isLoading };
}

export function useSubcategories(categoryId?: string) {
  const query = useQuery({
    queryKey: ["categories", categoryId, "subcategories"],
    queryFn: () => categoriesApi.getSubcategories(categoryId as string),
    enabled: !!categoryId,
  });
  return { subcategories: query.data?.data ?? [], isLoading: query.isLoading };
}