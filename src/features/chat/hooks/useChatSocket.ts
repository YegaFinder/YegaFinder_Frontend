"use client";

import { useCallback, useEffect, useState } from "react";
import { env } from "@/lib/env";
import { getAccessToken } from "@/lib/auth-storage";
import type { ChatSocketEvent } from "../types/chat.types";

export type ChatSocketStatus = "connecting" | "open" | "reconnecting" | "closed" | "unsupported";

type Listener = (event: ChatSocketEvent) => void;
type StatusListener = (status: ChatSocketStatus) => void;

/**
 * Everything below is module-scoped, not component state — deliberately.
 * A thread list and an open conversation both want live updates at the
 * same time, and if useChatSocket opened a fresh WebSocket per component
 * that calls it, that's two (or more) connections to the same backend for
 * one browser tab. Instead there's exactly one socket per tab, shared by
 * every subscriber, reference-counted so it only closes once the last one
 * unmounts.
 */
let socket: WebSocket | null = null;
let refCount = 0;
let reconnectAttempt = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let manualClose = false;

const messageListeners = new Set<Listener>();
const statusListeners = new Set<StatusListener>();

function broadcastStatus(status: ChatSocketStatus) {
  statusListeners.forEach((listen) => listen(status));
}

/**
 * UNCONFIRMED: both the derived path ("/chat") and the query-string token
 * auth below are guesses, not a spec — nobody has built the chat server
 * yet. Set NEXT_PUBLIC_WS_URL once the real endpoint exists if it doesn't
 * match this guess; that's the only other thing that would need to change.
 */
function resolveSocketUrl(): string | null {
  if (env.NEXT_PUBLIC_WS_URL) return env.NEXT_PUBLIC_WS_URL;

  try {
    const url = new URL(env.NEXT_PUBLIC_API_URL);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/chat";
    return url.toString();
  } catch {
    return null;
  }
}

function scheduleReconnect() {
  if (manualClose) return;
  // 1s, 2s, 4s, 8s, 16s, then capped at 30s — enough backoff that a
  // backend restart doesn't get hammered with reconnect attempts, but
  // still recovers within half a minute once it's back.
  const delay = Math.min(30_000, 1000 * 2 ** reconnectAttempt);
  reconnectAttempt += 1;
  broadcastStatus("reconnecting");
  reconnectTimer = setTimeout(connectSocket, delay);
}

function connectSocket() {
  if (typeof window === "undefined" || !("WebSocket" in window)) {
    broadcastStatus("unsupported");
    return;
  }

  const url = resolveSocketUrl();
  if (!url) {
    broadcastStatus("closed");
    return;
  }

  manualClose = false;
  broadcastStatus(reconnectAttempt > 0 ? "reconnecting" : "connecting");

  const token = getAccessToken();
  const authedUrl = token ? `${url}${url.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}` : url;

  try {
    socket = new WebSocket(authedUrl);
  } catch {
    // Some environments throw synchronously on a malformed URL rather
    // than failing asynchronously via onerror — treat it the same way.
    scheduleReconnect();
    return;
  }

  socket.onopen = () => {
    reconnectAttempt = 0;
    broadcastStatus("open");
  };

  socket.onmessage = (event) => {
    // A frame that isn't valid JSON, or doesn't look like a ChatSocketEvent,
    // shouldn't be able to take the whole chat feature down — drop it and
    // keep listening for the next one.
    try {
      const parsed = JSON.parse(event.data) as ChatSocketEvent;
      messageListeners.forEach((listen) => listen(parsed));
    } catch {
      console.warn("[chat] ignored a socket frame that wasn't valid JSON");
    }
  };

  socket.onclose = () => {
    socket = null;
    if (!manualClose && refCount > 0) scheduleReconnect();
    else broadcastStatus("closed");
  };

  socket.onerror = () => {
    // onclose fires immediately after onerror for a failed connection —
    // let onclose own reconnect scheduling so it doesn't get scheduled twice.
    socket?.close();
  };
}

function disconnectSocket() {
  manualClose = true;
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = null;
  socket?.close();
  socket = null;
  reconnectAttempt = 0;
}

export interface UseChatSocketResult {
  status: ChatSocketStatus;
  /**
   * Returns false (never throws) if the socket isn't open right now —
   * callers are expected to fall back to chatApi.sendMessage over REST
   * when this happens, not to treat it as a hard failure.
   */
  send: (event: ChatSocketEvent) => boolean;
  subscribe: (listener: Listener) => () => void;
}

export function useChatSocket(): UseChatSocketResult {
  const [status, setStatus] = useState<ChatSocketStatus>(socket?.readyState === WebSocket.OPEN ? "open" : "connecting");

  useEffect(() => {
    refCount += 1;
    statusListeners.add(setStatus);

    if (refCount === 1) {
      connectSocket();
    } else if (socket?.readyState === WebSocket.OPEN) {
      // Joining a connection that's already up — reflect that immediately
      // rather than showing "connecting" for a socket that isn't.
      setStatus("open");
    }

    return () => {
      refCount -= 1;
      statusListeners.delete(setStatus);
      if (refCount === 0) disconnectSocket();
    };
  }, []);

  const send = useCallback((event: ChatSocketEvent) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify(event));
    return true;
  }, []);

  const subscribe = useCallback((listener: Listener) => {
    messageListeners.add(listener);
    return () => messageListeners.delete(listener);
  }, []);

  return { status, send, subscribe };
}