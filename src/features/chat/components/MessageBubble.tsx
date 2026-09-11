"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "../types/chat.types";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  onRetry: (messageId: string) => void;
}

export function MessageBubble({ message, isOwn, onRetry }: MessageBubbleProps) {
  const isPending = message.clientStatus === "pending";
  const isFailed = message.clientStatus === "failed";

  return (
    <div className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-[16px] px-3.5 py-2 text-sm",
          isOwn ? "bg-yegna-primary text-white" : "bg-muted text-yegna-navy",
          isPending && "opacity-60",
          isFailed && "border border-destructive/40 bg-destructive/10 text-destructive",
        )}
      >
        {message.text}
      </div>

      {isPending && <span className="mt-0.5 text-xs text-muted-foreground">Sending...</span>}

      {isFailed && (
        <button
          type="button"
          onClick={() => onRetry(message.id)}
          className="mt-0.5 flex items-center gap-1 text-xs text-destructive hover:underline"
        >
          <RotateCcw className="size-3" /> Failed to send — tap to retry
        </button>
      )}
    </div>
  );
}