/**
 * Chat is genuinely new ground — the backend's REST + WebSocket contract
 * for it doesn't exist anywhere yet (it's called out as Sprint 5 backend
 * work in the sprint plan). Everything here is a working assumption, not
 * a confirmed shape. Flagged individually below where it matters most.
 */

export interface ChatParticipant {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface ChatThread {
  id: string;
  participant: ChatParticipant;
  lastMessage?: {
    text: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
}

/**
 * `clientStatus` is a LOCAL-ONLY field, never sent by the server — it
 * exists so the UI can show an optimistically-sent message immediately
 * ("pending", greyed out) and flip it to "failed" (with a retry option)
 * if sending errors out, without waiting for a round trip either way.
 * A message that came from the server (REST history or a socket event)
 * simply won't have this field set.
 */
export type ChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  createdAt: string;
  clientStatus?: "pending" | "failed";
};

/**
 * UNCONFIRMED: the exact envelope the WebSocket sends per event. This is
 * a reasonable guess (event name + payload), not something copied from a
 * spec. useChatSocket.ts is the one place this assumption lives, so if
 * the real protocol turns out different, that's the only file to change.
 */
export type ChatSocketEvent =
  | { type: "message"; message: ChatMessage }
  | { type: "thread_updated"; thread: ChatThread };