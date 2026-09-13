"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../api/chat.api";
import type { ChatMessage } from "../types/chat.types";

function messagesQueryKey(businessId: string) {
  return ["chat", "messages", businessId] as const;
}

/**
 * No WebSocket in the real contract (§11), so "live" here means polling —
 * refetchInterval re-checks every few seconds while this screen is open,
 * matching the doc's explicit recommendation ("poll every 3–5s while a
 * thread is open"). Cleared automatically on unmount by react-query.
 */
export function useConversation(businessId: string | undefined, currentUserId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: businessId ? messagesQueryKey(businessId) : ["chat", "messages", "none"],
    queryFn: () => chatApi.getMessages(businessId as string),
    enabled: !!businessId,
    refetchInterval: 5000,
  });

  const sendMessage = useCallback(
    async (text: string) => {
      if (!businessId || !text.trim() || !currentUserId) return;

      const key = messagesQueryKey(businessId);
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const optimistic: ChatMessage = {
        id: tempId,
        conversationId: `${currentUserId}:${businessId}`,
        customerId: currentUserId,
        businessId,
        senderRole: "customer",
        text,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clientStatus: "pending",
      };

      queryClient.setQueryData<ChatMessage[]>(key, (old) => [...(old ?? []), optimistic]);

      try {
        const confirmed = await chatApi.sendMessage(businessId, text);
        queryClient.setQueryData<ChatMessage[]>(key, (old) =>
          (old ?? []).map((m) => (m.id === tempId ? confirmed : m)),
        );
      } catch {
        queryClient.setQueryData<ChatMessage[]>(key, (old) =>
          (old ?? []).map((m) => (m.id === tempId ? { ...m, clientStatus: "failed" } : m)),
        );
      }
    },
    [businessId, currentUserId, queryClient],
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