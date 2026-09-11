"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function MessageComposer({ onSend, disabled }: MessageComposerProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-yegna-border p-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          // Enter sends, Shift+Enter adds a newline — the usual chat-app convention.
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        rows={1}
        placeholder="Type a message..."
        disabled={disabled}
        className="max-h-32 flex-1 resize-none rounded-[14px] border border-yegna-border bg-background px-3 py-2 text-sm disabled:opacity-50"
      />
      <Button type="submit" size="icon" disabled={disabled || !text.trim()}>
        <Send className="size-4" />
      </Button>
    </form>
  );
}