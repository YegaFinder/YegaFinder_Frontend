"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "../messages.api";
import type { SendMessageRequest } from "../../types/message.types";

/**
 * FIXED: this used to send over the WebSocket gateway by default (REST only
 * as a fallback when no token was present), while useMessages reads from
 * REST. CHAT_MESSAGES_FRONTEND_GUIDE.md §1/§3 confirms the socket gateway
 * and the REST endpoints read/write two completely separate database
 * tables (`chat_messages` vs `messages`) that are never synced. Sending via
 * the socket meant a message could appear to send successfully yet never
 * show up in the conversation view (which reads `messages` via REST) —
 * always REST now, matching useMessages, so every sent message is
 * immediately visible on the next poll/refetch.
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessageRequest) => messagesApi.sendMessage(payload),
    onSuccess: (_message, variables) => {
      // Nudge an immediate refetch rather than waiting for the next 5s poll
      // tick, so the sender sees their own message right away.
      queryClient.invalidateQueries({ queryKey: ["messages", variables.businessId] });
    },
  });
}