import type { Category } from "@/types/business.types";

/**
 * Single choke point for turning whatever categoriesApi actually returns
 * into a plain Category[] safe to .map() over.
 *
 * WHY THIS EXISTS: categoriesApi.getCategories/getSubcategories (in
 * business-discovery) currently return a still-wrapped `{ data: Category[] }`
 * rather than a flat array — almost certainly an unintentional double-wrap
 * that's likely to get "fixed" at some point without much warning. Every
 * place that did `response?.data ?? []` inline instead of going through
 * this function would need to be found and edited individually when that
 * happens. Routing every category response through here means that's a
 * one-line fix in ONE place instead of a hunt through every component that
 * touches categories.
 *
 * It also refuses to throw on a shape it doesn't recognize — a backend
 * deploy that changes the response shape should make the picker show
 * "no categories" until someone notices, not crash the whole form.
 */
export function normalizeCategoriesResponse(response: unknown): Category[] {
  // Today's shape: { data: Category[] }
  if (response && typeof response === "object" && "data" in response) {
    const inner = (response as { data: unknown }).data;
    if (Array.isArray(inner)) return inner as Category[];
  }

  // In case the double-wrap ever gets fixed and this starts returning a
  // flat array directly — supported without needing a second code change.
  if (Array.isArray(response)) return response as Category[];

  return [];
}