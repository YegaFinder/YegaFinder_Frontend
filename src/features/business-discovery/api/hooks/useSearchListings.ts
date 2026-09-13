import { useQuery } from "@tanstack/react-query";
import { listingsApi, type GetListingsParams } from "../listings.api";

/**
 * Backs /search with the real GET /listings/search?q= endpoint instead of
 * client-side filtering over whatever happened to be on page 1 of
 * GET /listings. When the query is empty, falls back to the plain
 * paginated listings feed (search with no keyword is just "browse").
 */
export function useSearchListings(query: string, params?: GetListingsParams) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ["listings", "search", trimmed, params],
    queryFn: () =>
      trimmed ? listingsApi.searchListings(trimmed, params) : listingsApi.getListings(params),
  });
}
