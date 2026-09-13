import { useQuery } from "@tanstack/react-query";
import { businessDiscoveryApi, type GetListingsParams } from "../business-discovery.api";

/**
 * @deprecated This used to call the confirmed-broken GET /businesses
 * (401 for guests, 500 even with a token — see business-discovery.api.ts).
 * It's unused anywhere in the app today; kept only so any existing
 * imports keep compiling, now pointed at the working GET /listings
 * instead. Prefer calling businessDiscoveryApi.getListings directly, or
 * the feature's useListings hook, in new code.
 */
export function useBusinesses(params?: GetListingsParams) {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => businessDiscoveryApi.getListings(params),
  });
}
