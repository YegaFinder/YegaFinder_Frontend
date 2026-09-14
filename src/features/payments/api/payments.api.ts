import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type { Payment, InitiatePaymentRequest, InitiatePaymentResponse } from "../types/payment.types";

export const paymentsApi = {
  // §8.1 — Pattern A
  initiatePayment: async (payload: InitiatePaymentRequest): Promise<InitiatePaymentResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<InitiatePaymentResponse>>("/payments/initiate", payload);
    return data.data;
  },

  // §8.2 — Pattern A
  verifyPayment: async (txRef: string): Promise<Payment> => {
    const { data } = await apiClient.get<ApiEnvelope<Payment>>(`/payments/verify/${txRef}`);
    return data.data;
  },
};