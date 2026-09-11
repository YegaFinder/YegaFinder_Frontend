"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chatApi } from "../api/chat.api";
import { useChatSocket } from "./useChatSocket";
import type { ChatMessage } from "../types/chat.types";

/**
 * A short delay before falling back to REST after a socket send — not a
 * server timeout, just "if the socket claimed to send it but nothing to
 * indicate success happens quickly, try the reliable path instead of
 * leaving the message stuck looking pending forever." Generous on
 * purpose; this only fires for messages the socket accepted, so most of
 * the time it never triggers at all — the socket's own echo confirms the
 * message well before this fires.
 */
const SOCKET_ACK_GRACE_MS = 4000;

export function useConversation(threadId: string | undefined) {
  const { status: socketStatus, send: sendViaSocket, subscribe } = useChatSocket();

  // Keyed by message id so duplicates (a message arriving via both an
  // optimistic local add and a later socket echo, or via both history and
  // a live event) collapse naturally into one entry instead of two.
  const [messagesById, setMessagesById] = useState<Record<string, ChatMessage>>({});
  const [oldestCursor, setOldestCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const ackTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const loadOlder = useCallback(async () => {
    if (!threadId || !hasMore || isLoadingHistory) return;

    setIsLoadingHistory(true);
    setHistoryError(null);
    try {
      const page = await chatApi.getMessages(threadId, oldestCursor ?? undefined);
      setMessagesById((prev) => {
        const next = { ...prev };
        page.data.forEach((m) => {
          next[m.id] = m;
        });
        return next;
      });
      setOldestCursor(page.nextCursor);
      setHasMore(page.nextCursor !== null);
    } catch {
      setHistoryError("Couldn't load earlier messages. Try again.");
    } finally {
      setIsLoadingHistory(false);
    }
  }, [threadId, hasMore, isLoadingHistory, oldestCursor]);

  // Reset everything when switching threads — otherwise the previous
  // thread's messages would flash briefly under the new thread's header.
  useEffect(() => {
    setMessagesById({});
    setOldestCursor(null);
    setHasMore(true);
    setHistoryError(null);
    if (threadId) loadOlder();
    // loadOlder is intentionally excluded — it's recreated on every state
    // change it causes, which would otherwise re-trigger this effect in a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  // Live incoming messages for this thread.
  useEffect(() => {
    if (!threadId) return;
    return subscribe((event) => {
      if (event.type === "message" && event.message.threadId === threadId) {
        setMessagesById((prev) => ({ ...prev, [event.message.id]: event.message }));
        // A confirmed message arriving means whatever pending/failed
        // optimistic entry it corresponds to is done needing its ack timer.
        clearTimeout(ackTimers.current[event.message.id]);
        delete ackTimers.current[event.message.id];
      }
    });
  }, [threadId, subscribe]);

  useEffect(() => {
    const timers = ackTimers.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  /**
   * Optimistic send: the message shows up instantly with a temporary id
   * and "pending" status. It tries the socket first (fast path); if the
   * socket isn't open, or the socket accepted it but nothing confirms
   * receipt within SOCKET_ACK_GRACE_MS, it falls back to REST — which
   * either replaces the temp message with the real one, or marks it
   * "failed" so the composer can offer to retry instead of the message
   * just silently vanishing.
   */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!threadId || !text.trim()) return;

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const optimistic: ChatMessage = {
        id: tempId,
        threadId,
        senderId: "me", // placeholder — the component knows the real sender by comparing to the logged-in user, not by this value
        text,
        createdAt: new Date().toISOString(),
        clientStatus: "pending",
      };
      setMessagesById((prev) => ({ ...prev, [tempId]: optimistic }));

      async function sendOverRest() {
        try {
          const confirmed = await chatApi.sendMessage(threadId as string, text);
          setMessagesById((prev) => {
            const next = { ...prev };
            delete next[tempId];
            next[confirmed.id] = confirmed;
            return next;
          });
        } catch {
          setMessagesById((prev) => ({
            ...prev,
            [tempId]: { ...prev[tempId], clientStatus: "failed" },
          }));
        }
      }

      const sentViaSocket = sendViaSocket({ type: "message", message: optimistic });
      if (!sentViaSocket) {
        await sendOverRest();
        return;
      }

      // Socket claimed to send it — give it a moment to be confirmed by an
      // echoed `message` event (handled in the subscribe effect above,
      // which clears this timer). If nothing confirms it in time, assume
      // the socket silently dropped it and fall back to the reliable path.
      ackTimers.current[tempId] = setTimeout(sendOverRest, SOCKET_ACK_GRACE_MS);
    },
    [threadId, sendViaSocket],
  );

  /** Re-attempts a message that ended up "failed" — reuses the same optimistic-send path with its original text. */
  const retryMessage = useCallback(
    (failedId: string) => {
      const failed = messagesById[failedId];
      if (!failed) return;
      setMessagesById((prev) => {
        const next = { ...prev };
        delete next[failedId];
        return next;
      });
      sendMessage(failed.text);
    },
    [messagesById, sendMessage],
  );

  const messages = Object.values(messagesById).sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return {
    messages,
    isLoadingHistory,
    historyError,
    hasMore,
    loadOlder,
    sendMessage,
    retryMessage,
    socketStatus,
  };
}