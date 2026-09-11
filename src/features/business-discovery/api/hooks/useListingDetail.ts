import { useQuery } from "@tanstack/react-query";
import { listingsApi } from "../listings.api";

export function useListingDetail(id: string) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingsApi.getListingById(id),
    enabled: !!id,
  });
}
