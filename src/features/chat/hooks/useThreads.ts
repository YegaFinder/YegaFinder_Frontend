"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../api/chat.api";
import { useChatSocket } from "./useChatSocket";
import type { ChatThread } from "../types/chat.types";

export const CHAT_THREADS_QUERY_KEY = ["chat", "threads"] as const;

/**
 * REST gives the initial list and is what survives a page refresh; the
 * socket keeps it live after that (a new message bumps a thread to the
 * top and updates its unread count without waiting for a refetch).
 * `socketStatus` is exposed so the UI can show a small "reconnecting..."
 * indicator rather than pretending everything's always live.
 */
export function useThreads() {
  const queryClient = useQueryClient();
  const { status: socketStatus, subscribe } = useChatSocket();
  const [liveThreads, setLiveThreads] = useState<Record<string, ChatThread>>({});

  const query = useQuery({
    queryKey: CHAT_THREADS_QUERY_KEY,
    queryFn: chatApi.getThreads,
  });

  // Socket-driven thread updates layer on top of the REST snapshot rather
  // than replacing it — a `thread_updated` event only ever describes one
  // thread at a time, so there's no reason to refetch the whole list for it.
  useEffect(() => {
    return subscribe((event) => {
      if (event.type === "thread_updated") {
        setLiveThreads((prev) => ({ ...prev, [event.thread.id]: event.thread }));
      } else if (event.type === "message") {
        // A live message that isn't accompanied by its own thread_updated
        // event still needs to bump that thread's preview — patch just the
        // fields a new message actually changes rather than requiring the
        // backend to always send both events together.
        setLiveThreads((prev) => {
          const existing = prev[event.message.threadId] ?? query.data?.find((t) => t.id === event.message.threadId);
          if (!existing) return prev;
          return {
            ...prev,
            [event.message.threadId]: {
              ...existing,
              lastMessage: {
                text: event.message.text,
                createdAt: event.message.createdAt,
                senderId: event.message.senderId,
              },
              unreadCount: existing.unreadCount + 1,
            },
          };
        });
      }
    });
  }, [subscribe, query.data]);

  const threads = useMemo(() => {
    const base = query.data ?? [];
    const merged = base.map((thread) => liveThreads[thread.id] ?? thread);
    return [...merged].sort((a, b) => {
      const aTime = a.lastMessage?.createdAt ?? "";
      const bTime = b.lastMessage?.createdAt ?? "";
      return bTime.localeCompare(aTime);
    });
  }, [query.data, liveThreads]);

  /** Call when a thread is opened, so its unread count clears locally without waiting on a server round trip. */
  function markThreadRead(threadId: string) {
    setLiveThreads((prev) => {
      const existing = prev[threadId] ?? query.data?.find((t) => t.id === threadId);
      if (!existing) return prev;
      return { ...prev, [threadId]: { ...existing, unreadCount: 0 } };
    });
    // TODO: also tell the backend the thread was read, once there's an
    // endpoint for it — for now this is a local-only, optimistic clear.
  }

  return {
    threads,
    isLoading: query.isLoading,
    isError: query.isError,
    socketStatus,
    markThreadRead,
    refetch: () => queryClient.invalidateQueries({ queryKey: CHAT_THREADS_QUERY_KEY }),
  };
}