import { useQuery } from "@tanstack/react-query";
import { businessDiscoveryApi } from "../business-discovery.api";

/**
 * @deprecated This used to call the confirmed-broken GET /businesses/:id
 * (401 for guests, 500 even with a token — see business-discovery.api.ts).
 * It's unused anywhere in the app today; kept only so any existing
 * imports keep compiling, now pointed at the working GET /listings/:id
 * instead. Prefer calling businessDiscoveryApi.getListingById directly,
 * or the feature's useListingDetail hook, in new code.
 */
export function useBusinessDetail(id: string) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => businessDiscoveryApi.getListingById(id),
    enabled: !!id,
  });
}