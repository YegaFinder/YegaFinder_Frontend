"use client";

import { useEffect, useRef } from "react";
import { Spinner } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useConversation } from "../hooks/useConversation";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";

interface ConversationViewProps {
  threadId: string | undefined;
  /** Looked up by the parent from the thread list it already has — avoids this component needing its own thread-metadata fetch just to show a name. */
  participantName?: string;
}

export function ConversationView({ threadId, participantName }: ConversationViewProps) {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { messages, isLoadingHistory, historyError, hasMore, loadOlder, sendMessage, retryMessage, socketStatus } =
    useConversation(threadId);

  const bottomRef = useRef<HTMLDivElement>(null);
  const previousMessageCount = useRef(0);

  // Only auto-scroll when a message is actually added (new send/receive),
  // not on every render — otherwise loading older history would yank the
  // view back down to the bottom right after the user scrolled up for it.
  useEffect(() => {
    if (messages.length > previousMessageCount.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    previousMessageCount.current = messages.length;
  }, [messages.length]);

  if (!threadId) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Select a conversation to start reading.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-yegna-border px-4 py-3">
        <h2 className="font-medium text-yegna-navy">{participantName ?? "Conversation"}</h2>
        {socketStatus !== "open" && socketStatus !== "connecting" && (
          <p className="text-xs text-amber-600">
            {socketStatus === "reconnecting" ? "Reconnecting..." : "Live updates unavailable — messages still send."}
          </p>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {hasMore && (
          <div className="flex justify-center pb-2">
            <Button variant="outline" size="sm" onClick={loadOlder} disabled={isLoadingHistory}>
              {isLoadingHistory ? <Spinner className="size-3.5" /> : null}
              Load earlier messages
            </Button>
          </div>
        )}

        {historyError && <p className="text-center text-xs text-destructive">{historyError}</p>}

        {messages.length === 0 && !isLoadingHistory ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No messages yet — say hello.</p>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUserId}
              onRetry={retryMessage}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <MessageComposer onSend={sendMessage} />
    </div>
  );
}