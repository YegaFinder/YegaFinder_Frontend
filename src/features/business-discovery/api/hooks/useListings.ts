import { useQuery } from "@tanstack/react-query";
import { listingsApi, type GetListingsParams } from "../listings.api";

export function useListings(params?: GetListingsParams) {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => listingsApi.getListings(params),
  });
}
