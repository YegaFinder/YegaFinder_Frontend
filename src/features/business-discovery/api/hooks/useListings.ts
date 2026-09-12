import { useQuery } from "@tanstack/react-query";
import { listingsApi } from "../listings.api";

export function useListings() {
  return useQuery({
    queryKey: ["listings"],
    queryFn: () => listingsApi.getListings(),
  });
}
