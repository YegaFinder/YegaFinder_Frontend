import { useMutation } from "@tanstack/react-query";
import { getAccessToken } from "@/lib/auth-storage";
import { getSocket } from "@/lib/socket";
import { messagesApi } from "../messages.api";
import type { SendMessageRequest } from "../../types/message.types";

export function useSendMessage() {
  return useMutation({
    mutationFn: async (payload: SendMessageRequest) => {
      const token = getAccessToken();
      if (token) {
        // real-time path — server should also persist and echo back via "message" event
        getSocket(token).emit("sendMessage", payload);
        return null;
      }
      // REST fallback
      return messagesApi.sendMessage(payload);
    },
  });
}