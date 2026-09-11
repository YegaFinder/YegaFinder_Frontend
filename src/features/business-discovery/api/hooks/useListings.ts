import { useQuery } from "@tanstack/react-query";
import { listingsApi } from "../listings.api";

export function useListings() {
  return useQuery({
    queryKey: ["listings"],
    queryFn: () => listingsApi.getListings().then((res) => {
      console.log("verificationStatus values:", res.listings.map((l) => l.verificationStatus));
      return res;
    }),
  });
}
