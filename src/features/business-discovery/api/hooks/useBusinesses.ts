import { useQuery } from "@tanstack/react-query";
import { businessDiscoveryApi, type GetBusinessesParams } from "../business-discovery.api";

export function useBusinesses(params: GetBusinessesParams) {
  return useQuery({
    queryKey: ["businesses", "list", params],
    queryFn: () => businessDiscoveryApi.getBusinesses(params),
  });
}