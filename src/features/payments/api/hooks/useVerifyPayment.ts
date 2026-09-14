import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "../payments.api";

export function useVerifyPayment(txRef: string | null, options?: { pollWhilePending?: boolean }) {
  return useQuery({
    queryKey: ["payment", txRef],
    queryFn: () => paymentsApi.verifyPayment(txRef!),
    enabled: !!txRef,
    refetchInterval: (query) =>
      options?.pollWhilePending && query.state.data?.status === "PENDING" ? 3000 : false,
  });
}