export type { Message, SenderRole, MerchantThread } from "@/types/business.types";

export interface SendMessageRequest {
  businessId: string;
  text: string;
}