"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useConversation } from "../hooks/useConversation";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";

interface ConversationViewProps {
  /** The business this conversation is with — there's no separate "thread id" in the real contract, this IS the identifier. */
  businessId: string | undefined;
  title?: string;
  /** False for the merchant view — POST /messages 403s for any non-Customer role, so there's no working send path to offer. */
  canSend?: boolean;
  /** Shown in place of the composer when canSend is false. */
  disabledReason?: string;
}

export function ConversationView({ businessId, title, canSend = true, disabledReason }: ConversationViewProps) {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { messages, isLoading, isError, sendMessage, retryMessage } = useConversation(businessId, currentUserId);

  const bottomRef = useRef<HTMLDivElement>(null);
  const previousMessageCount = useRef(0);

  useEffect(() => {
    if (messages.length > previousMessageCount.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    previousMessageCount.current = messages.length;
  }, [messages.length]);

  if (!businessId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No conversation selected.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-yegna-border px-4 py-3">
        <h2 className="font-medium text-yegna-navy">{title ?? "Conversation"}</h2>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading messages...</p>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-destructive">Couldn&apos;t load messages.</p>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No messages yet — say hello.</p>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderRole === "customer" && message.customerId === currentUserId}
              onRetry={retryMessage}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {canSend ? (
        <MessageComposer onSend={sendMessage} />
      ) : (
        <div className="border-t border-yegna-border p-3 text-center text-xs text-muted-foreground">
          {disabledReason ?? "Sending isn't available here."}
        </div>
      )}
    </div>
  );
}