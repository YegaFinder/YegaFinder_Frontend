/**
 * Rebuilt against the real contract (frontend_api_reference.md §5). The
 * previous version assumed a WebSocket connection and a separate "thread"
 * resource with its own id — neither exists in the real API. Messaging is
 * plain REST, and a conversation is addressed directly by businessId;
 * there is no thread id distinct from that.
 *
 * The message object's exact fields aren't shown in either doc (only the
 * request body for sending is documented — GET /messages/:businessId's
 * entry just says "returns an array of message objects" with no example).
 * This shape is a reasonable inference, not a confirmed one. Flagged again
 * in chat.api.ts, right where it matters.
 */
export interface ChatMessage {
  id: string;
  businessId: string;
  senderId: string;
  text: string;
  createdAt: string;
  /** LOCAL-ONLY — never sent by the server. Lets a just-sent message show up instantly, greyed out, before the request round-trips. */
  clientStatus?: "pending" | "failed";
}