"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/shared/form-feedback";
import { useThreads } from "../hooks/useThreads";
import type { ChatThread } from "../types/chat.types";

interface ChatThreadListProps {
  selectedThreadId?: string;
  onSelect: (thread: ChatThread) => void;
}

function timeAgo(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  return `${Math.floor(diffHr / 24)}d`;
}

export function ChatThreadList({ selectedThreadId, onSelect }: ChatThreadListProps) {
  const { threads, isLoading, isError, socketStatus, markThreadRead } = useThreads();

  function handleSelect(thread: ChatThread) {
    onSelect(thread);
    if (thread.unreadCount > 0) markThreadRead(thread.id);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
        <Spinner className="size-4" /> Loading conversations...
      </div>
    );
  }

  if (isError) {
    return <p className="py-12 text-center text-sm text-destructive">Couldn&apos;t load your messages.</p>;
  }

  return (
    <div className="flex flex-col">
      {socketStatus === "reconnecting" && (
        <div className="border-b border-yegna-border bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
          Reconnecting — new messages may be delayed.
        </div>
      )}

      {threads.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No conversations yet.</p>
      ) : (
        threads.map((thread) => (
          <button
            key={thread.id}
            type="button"
            onClick={() => handleSelect(thread)}
            className={cn(
              "flex items-center gap-3 border-b border-yegna-border px-3 py-3 text-left transition-colors hover:bg-muted/40",
              selectedThreadId === thread.id && "bg-muted/60",
            )}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-yegna-primary/10 text-sm font-semibold text-yegna-primary">
              {thread.participant.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium text-yegna-navy">{thread.participant.name}</span>
                {thread.lastMessage && (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {timeAgo(thread.lastMessage.createdAt)}
                  </span>
                )}
              </div>
              <p className="truncate text-sm text-muted-foreground">{thread.lastMessage?.text ?? "No messages yet"}</p>
            </div>
            {thread.unreadCount > 0 && (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-yegna-primary text-xs font-medium text-white">
                {thread.unreadCount > 9 ? "9+" : thread.unreadCount}
              </span>
            )}
          </button>
        ))
      )}
    </div>
  );
}