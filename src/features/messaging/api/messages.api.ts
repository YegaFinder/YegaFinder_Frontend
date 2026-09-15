import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type { Message, SendMessageRequest } from "../types/message.types";

// Confirmed against CHAT_MESSAGES_FRONTEND_GUIDE.md §2 — this is the ONLY
// live, reachable implementation (BusinessMessagingController / `messages`
// table). A second implementation (ChatController / `chat_messages` table)
// exists in the backend but is completely unreachable over HTTP due to a
// route-registration collision — do not build against it, and do not
// resurrect the customerId query param idea from an earlier draft of this
// file: the guide confirms this endpoint "supports no query params today",
// so it was silently doing nothing.
export const messagesApi = {
  // §2.2 — Pattern A, but note the payload is { messages: Message[] }, NOT
  // a bare array — this earlier version had this wrong (had assumed Pattern
  // C). No page/limit/cursor support server-side; the whole conversation
  // comes back every time, already sorted ascending by createdAt.
  //
  // KNOWN BACKEND BUGS, not client-side issues (§4 of the guide — raise
  // these with backend, don't work around them speculatively here):
  //   - Customer role: only sees messages THEY sent (senderId = self).
  //     Merchant replies are invisible to the customer. Confirmed bug,
  //     not a design choice.
  //   - Merchant role: sees every message for the business, from every
  //     customer, with NO ownership check that the business is theirs.
  getMessages: async (businessId: string): Promise<Message[]> => {
    const { data } = await apiClient.get<ApiEnvelope<{ messages: Message[] }>>(`/messages/${businessId}`);
    return data.data.messages;
  },

  // §2.1 — Pattern A, { businessId, text } only. The DTO uses
  // `forbidNonWhitelisted: true` — sending any extra field (e.g. a
  // speculative customerId to target one customer) gets the WHOLE request
  // rejected with 400, not just ignored. Do not add fields here without a
  // confirmed DTO update from backend.
  sendMessage: async (payload: SendMessageRequest): Promise<Message> => {
    const { data } = await apiClient.post<ApiEnvelope<Message>>("/messages", payload);
    return data.data;
  },

  // REMOVED: getMerchantThreads (GET /messages/merchant/threads). Confirmed
  // dead by CHAT_MESSAGES_FRONTEND_GUIDE.md §1 — Express matches
  // BusinessMessagingController's GET /:businessId route first, so this
  // call actually runs with businessId="merchant" literally and returns
  // (an effectively empty) message list, never a threads summary. There is
  // currently no working merchant-inbox endpoint. The merchant thread list
  // is now derived entirely client-side from getMessages() — see
  // features/messaging/lib/groupMessagesByCustomer.ts.
};