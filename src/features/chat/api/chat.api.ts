import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type { ChatThread, ChatMessage } from "../types/chat.types";

/** UNCONFIRMED shape — cursor-based paging is a guess (typical for chat history), not a confirmed contract. */
export interface MessagesPage {
  data: ChatMessage[];
  /** Pass this back as `before` to fetch the next older page; null means there's nothing older left. */
  nextCursor: string | null;
}

/**
 * REST is the source of truth for history and the fallback path for
 * sending — the WebSocket (useChatSocket) is only for live delivery of
 * messages sent by the OTHER participant while this tab is open. Every
 * endpoint below is UNCONFIRMED; none of this exists on the backend yet.
 */
export const chatApi = {
  /** Backend: GET /chat/threads */
  getThreads: async (): Promise<ChatThread[]> => {
    const { data } = await apiClient.get<ApiEnvelope<ChatThread[]>>("/chat/threads");
    return data.data;
  },

  /** Backend: GET /chat/threads/:id/messages?before=&limit= */
  getMessages: async (threadId: string, before?: string): Promise<MessagesPage> => {
    const { data } = await apiClient.get<ApiEnvelope<MessagesPage>>(`/chat/threads/${threadId}/messages`, {
      params: { before },
    });
    return data.data;
  },

  /**
   * Backend: POST /chat/threads/:id/messages
   * Used as the actual send path when the socket isn't connected, and as
   * a safety net even when it is (see useConversation's send logic) —
   * REST failing is a clear, catchable error; a socket send silently
   * going nowhere because the connection dropped a second ago is not.
   */
  sendMessage: async (threadId: string, text: string): Promise<ChatMessage> => {
    const { data } = await apiClient.post<ApiEnvelope<ChatMessage>>(`/chat/threads/${threadId}/messages`, { text });
    return data.data;
  },
};