import { useQuery } from "@tanstack/react-query";
import { businessDiscoveryApi } from "../business-discovery.api";

export function useBusinessDetail(id: string) {
  return useQuery({
    queryKey: ["business", id],
    queryFn: () => businessDiscoveryApi.getBusinessById(id),
    enabled: !!id,
  });
}
