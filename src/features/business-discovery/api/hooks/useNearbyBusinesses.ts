import { useQuery } from "@tanstack/react-query";
import { businessDiscoveryApi, type NearbyBusinessesParams } from "../business-discovery.api";

export function useNearbyBusinesses(params: NearbyBusinessesParams | null) {
  return useQuery({
    queryKey: ["businesses", "nearby", params],
    queryFn: () => businessDiscoveryApi.getNearbyBusinesses(params!),
    enabled: !!params,
  });
}
