import { apiClient } from "@/lib/api-client";
import type { Message, MerchantThread, SendMessageRequest } from "../types/message.types";

export const messagesApi = {
  // §7.1 — Pattern C
  getMessages: async (businessId: string, page = 1, limit = 20): Promise<Message[]> => {
    const { data } = await apiClient.get<Message[]>(`/messages/${businessId}`, { params: { page, limit } });
    return data;
  },

  sendMessage: async (payload: SendMessageRequest): Promise<Message> => {
    const { data } = await apiClient.post<Message>("/messages", payload);
    return data;
  },

  // merchant only
  getMerchantThreads: async (): Promise<MerchantThread[]> => {
    const { data } = await apiClient.get<MerchantThread[]>("/messages/merchant/threads");
    return data;
  },
};