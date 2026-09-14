import { io, type Socket } from "socket.io-client";
import { env } from "./env";

// A namespace is addressed by appending it to the connection URL —
// it is NOT the `path` option (that overrides the engine.io transport
// endpoint, default "/socket.io", and is unrelated to this).
const CHAT_NAMESPACE = "/chat";

let socket: Socket | null = null;

export function getSocket(token: string): Socket {
  if (socket?.connected) return socket;

  const httpBaseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "");

  socket = io(`${httpBaseUrl}${CHAT_NAMESPACE}`, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}