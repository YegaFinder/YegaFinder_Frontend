"use client";

import { useEffect, useRef, useState } from "react";
import { useMessages } from "../api/hooks/useMessages";
import { useSendMessage } from "../api/hooks/useSendMessage";

interface ChatWindowProps {
  businessId: string;
  businessName?: string;
  onClose?: () => void;
}

export function ChatWindow({ businessId, businessName, onClose }: ChatWindowProps) {
  const { data: messages, isLoading } = useMessages(businessId);
  const sendMessage = useSendMessage();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages?.length]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || sendMessage.isPending) return;
    sendMessage.mutate({ businessId, text: trimmed });
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-96 w-full max-w-md flex-col rounded-lg border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="text-sm font-medium">
          {businessName ? `Chat with ${businessName}` : "Chat"}
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground"
            aria-label="Close chat"
          >
            Close
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        ) : !messages?.length ? (
          <p className="text-sm text-muted-foreground">No messages yet. Say hello.</p>
        ) : (
          messages.map((m) => {
            const isMine = m.senderRole === "CUSTOMER";
            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    isMine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isMine ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t px-3 py-2">
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type a message..."
            className="flex-1 resize-none rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sendMessage.isPending}
            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
