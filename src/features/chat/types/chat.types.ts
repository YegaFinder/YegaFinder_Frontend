/**
 * Matches the real Message entity (YegnaFinder_Backend_Reference.md §11 /
 * §18) — no thread id exists; a conversation is addressed directly by
 * businessId, and conversationId is server-derived as `${customerId}:${businessId}`.
 */
export interface ChatMessage {
  id: string;
  conversationId: string;
  customerId: string;
  businessId: string;
  senderRole: "customer" | "business" | "system";
  text: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  /** LOCAL-ONLY — never sent by the server. Lets a just-sent message show up instantly, greyed out, before the request round-trips. */
  clientStatus?: "pending" | "failed";
}