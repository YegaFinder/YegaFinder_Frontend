import { apiClient } from "@/lib/api-client";
import type { ChatMessage } from "../types/chat.types";

/**
 * Real contract per YegnaFinder_Backend_Reference.md §11 — REST only, no
 * WebSocket anywhere in the backend. No thread id: a conversation is
 * addressed directly by businessId. Neither endpoint uses the standard
 * {success,data,message} envelope — messages controllers return the raw
 * entity/array directly.
 */
export const chatApi = {
  /** Backend: GET /messages/:businessId → { messages: ChatMessage[] }, oldest→newest. */
  getMessages: async (businessId: string): Promise<ChatMessage[]> => {
    const { data } = await apiClient.get<{ messages: ChatMessage[] }>(`/messages/${businessId}`);
    return data.messages ?? [];
  },

  /**
   * Backend: POST /messages { businessId, text }
   * conversationId is omitted — the backend derives it automatically.
   * IMPORTANT: this 403s for any non-Customer role (§11) — there is
   * currently no merchant-reply endpoint. Only call this from a customer
   * context; see MerchantMessagesScreen for how the merchant side handles
   * that restriction instead of calling this at all.
   */
  sendMessage: async (businessId: string, text: string): Promise<ChatMessage> => {
    const { data } = await apiClient.post<ChatMessage>("/messages", { businessId, text });
    return data;
  },
};