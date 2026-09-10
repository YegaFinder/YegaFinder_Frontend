"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/features/business-discovery/api/categories.api";
import { normalizeCategoriesResponse } from "../utils/normalize-categories";

/**
 * Deliberately reuses business-discovery's categoriesApi rather than
 * duplicating a second categories client — categories are shared taxonomy
 * data, not something either feature owns exclusively.
 *
 * ASSUMPTION: GET /categories/:id/subcategories returns that category's
 * children, and that's the intended way to build a category picker. This
 * endpoint exists on main but nothing consumes it on the business-discovery
 * side yet either — confirm with backend before relying on this further.
 */
export function useSubcategories(categoryId?: string) {
  const query = useQuery({
    queryKey: ["categories", categoryId, "subcategories"],
    queryFn: () => categoriesApi.getSubcategories(categoryId as string),
    enabled: !!categoryId,
  });

  return {
    subcategories: normalizeCategoriesResponse(query.data),
    isLoading: query.isLoading,
    isError: query.isError,
  };
}