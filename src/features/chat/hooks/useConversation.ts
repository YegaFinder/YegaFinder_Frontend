"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../api/chat.api";
import type { ChatMessage } from "../types/chat.types";

function messagesQueryKey(businessId: string) {
  return ["chat", "messages", businessId] as const;
}

/**
 * No WebSocket in the real contract, so "live" here means polling —
 * refetchInterval re-checks for new messages every few seconds while this
 * screen is open. Not real-time, but a reasonable stand-in until (if
 * ever) the backend adds a socket; way simpler than the WebSocket
 * reconnect/backoff machinery the old version needed, since there's
 * nothing to reconnect.
 *
 * Optimistic send is still worth keeping even without a socket: the send
 * request itself can be slow or fail, and showing the message immediately
 * (pending, then confirmed or failed) is better than waiting on the round
 * trip either way.
 */
export function useConversation(businessId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: businessId ? messagesQueryKey(businessId) : ["chat", "messages", "none"],
    queryFn: () => chatApi.getMessages(businessId as string),
    enabled: !!businessId,
    refetchInterval: 5000,
  });

  const sendMessage = useCallback(
    async (text: string) => {
      if (!businessId || !text.trim()) return;

      const key = messagesQueryKey(businessId);
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const optimistic: ChatMessage = {
        id: tempId,
        businessId,
        senderId: "me", // placeholder — the component knows the real sender by comparing to the logged-in user, not by this value
        text,
        createdAt: new Date().toISOString(),
        clientStatus: "pending",
      };

      queryClient.setQueryData<ChatMessage[]>(key, (old) => [...(old ?? []), optimistic]);

      try {
        const confirmed = await chatApi.sendMessage(businessId, text);
        queryClient.setQueryData<ChatMessage[]>(key, (old) => (old ?? []).map((m) => (m.id === tempId ? confirmed : m)));
      } catch {
        queryClient.setQueryData<ChatMessage[]>(key, (old) =>
          (old ?? []).map((m) => (m.id === tempId ? { ...m, clientStatus: "failed" } : m)),
        );
      }
    },
    [businessId, queryClient],
  );

  const retryMessage = useCallback(
    (failedId: string) => {
      if (!businessId) return;
      const key = messagesQueryKey(businessId);
      const failed = query.data?.find((m) => m.id === failedId);
      if (!failed) return;

      queryClient.setQueryData<ChatMessage[]>(key, (old) => (old ?? []).filter((m) => m.id !== failedId));
      sendMessage(failed.text);
    },
    [businessId, query.data, queryClient, sendMessage],
  );

  return {
    messages: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    sendMessage,
    retryMessage,
  };
}