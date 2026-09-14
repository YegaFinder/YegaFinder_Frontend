import { useQuery } from "@tanstack/react-query";
import { businessDiscoveryApi, type SearchBusinessesParams } from "../business-discovery.api";

export function useBusinessSearch(params: SearchBusinessesParams) {
  return useQuery({
    queryKey: ["businesses", "search", params],
    queryFn: () => businessDiscoveryApi.searchBusinesses(params),
    enabled: params.q.trim().length > 0,
  });
}