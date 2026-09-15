"use client";

import { useQuery } from "@tanstack/react-query";
import { messagesApi } from "../messages.api";

/**
 * REMOVED: the WebSocket listener this hook used to have.
 * CHAT_MESSAGES_FRONTEND_GUIDE.md §1/§3 confirms the socket gateway
 * (`/chat` namespace) reads and writes a COMPLETELY SEPARATE table
 * (`chat_messages`) from this REST endpoint (`messages`) — the two systems
 * don't share data at all today. Appending socket "message" events into
 * this REST-backed cache, as the previous version did, would silently show
 * messages that a page refresh (re-fetching from `messages`) would make
 * disappear again. The guide's own recommendation: build against REST here
 * and treat the socket as experimental until backend unifies the two
 * stores. Polling stands in for real-time until then.
 */
export function useMessages(businessId: string) {
  return useQuery({
    queryKey: ["messages", businessId],
    queryFn: () => messagesApi.getMessages(businessId),
    enabled: !!businessId,
    refetchInterval: 5_000,
  });
}