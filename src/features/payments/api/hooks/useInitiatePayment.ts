import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentsApi } from "../payments.api";
import { getErrorMessage } from "@/lib/errors";
import type { InitiatePaymentRequest } from "../../types/payment.types";

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (payload: InitiatePaymentRequest) => paymentsApi.initiatePayment(payload),
    onSuccess: ({ checkoutUrl, txRef }) => {
      sessionStorage.setItem("lastTxRef", txRef);
      window.location.href = checkoutUrl;
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}