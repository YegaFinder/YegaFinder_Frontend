export type { Payment, PaymentStatus } from "@/types/business.types";

export interface InitiatePaymentRequest { bookingId: string; }
export interface InitiatePaymentResponse { checkoutUrl: string; txRef: string; }