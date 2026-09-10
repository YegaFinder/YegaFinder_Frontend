import { useQuery } from "@tanstack/react-query";
import { businessDiscoveryApi } from "../business-discovery.api";
import type { GetNearbyParams } from "../business-discovery.api";

export function useNearbyBusinesses(params: GetNearbyParams | null) {
  return useQuery({
    queryKey: ["businesses", "nearby", params],
    queryFn: () => businessDiscoveryApi.getNearby(params as GetNearbyParams),
    // No coordinates yet (geolocation still pending/denied) — don't fire.
    enabled: params !== null,
  });
}
