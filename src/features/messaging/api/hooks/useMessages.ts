import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { messagesApi } from "../messages.api";
import { getSocket } from "@/lib/socket";
import { getAccessToken } from "@/lib/auth-storage";
import type { Message } from "../../types/message.types";

export function useMessages(businessId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["messages", businessId];

  const query = useQuery({
    queryKey,
    queryFn: () => messagesApi.getMessages(businessId),
    enabled: !!businessId,
  });

  useEffect(() => {
    if (!businessId) return;
    const token = getAccessToken();
    if (!token) return;

    const socket = getSocket(token);
    socket.emit("joinRoom", { businessId });

    const onMessage = (message: Message) => {
      queryClient.setQueryData<Message[]>(queryKey, (old = []) => [...old, message]);
    };
    socket.on("message", onMessage);

    return () => {
      socket.emit("leaveRoom", { businessId });
      socket.off("message", onMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  return query;
}