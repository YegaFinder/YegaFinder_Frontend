export type { Message, SenderRole } from "@/types/business.types";

export interface SendMessageRequest {
  businessId: string;
  text: string;
}