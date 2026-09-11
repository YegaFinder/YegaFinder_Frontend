"use client";

import { useState } from "react";
import { ChatThreadList } from "./ChatThreadList";
import { ConversationView } from "./ConversationView";
import type { ChatThread } from "../types/chat.types";

/**
 * The one thing customer and merchant messaging actually differ on is the
 * page title — everything else (the list, the conversation, the socket)
 * is identical, so both routes render this instead of each reimplementing
 * the same master-detail layout.
 */
export function ChatScreen({ title }: { title: string }) {
  const [selectedThread, setSelectedThread] = useState<ChatThread | undefined>();

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <h1 className="border-b border-yegna-border px-4 py-3 text-xl font-semibold text-yegna-navy">{title}</h1>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full max-w-sm overflow-y-auto border-r border-yegna-border sm:block">
          <ChatThreadList selectedThreadId={selectedThread?.id} onSelect={setSelectedThread} />
        </div>

        <div className="hidden flex-1 sm:block">
          <ConversationView threadId={selectedThread?.id} participantName={selectedThread?.participant.name} />
        </div>
      </div>
    </div>
  );
}