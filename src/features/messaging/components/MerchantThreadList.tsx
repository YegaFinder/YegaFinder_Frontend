"use client";

import type { MerchantThread } from "../lib/groupMessagesByCustomer";
import { cn } from "@/lib/utils";

interface MerchantThreadListProps {
  threads: MerchantThread[];
  selectedCustomerId: string | null;
  onSelect: (customerId: string) => void;
}

/**
 * Purely presentational now — no longer fetches its own data. Threads are
 * derived client-side by the parent (see groupMessagesByCustomer.ts)
 * because the backend endpoint this used to call, GET
 * /messages/merchant/threads, is confirmed dead (route collision — see
 * messages.api.ts). There's no customer display name available anywhere in
 * the message payload, so each thread is labeled with a shortened id —
 * flag to backend if a real name is wanted here (needs either a name on
 * Message or a user-lookup endpoint).
 */
export function MerchantThreadList({ threads, selectedCustomerId, onSelect }: MerchantThreadListProps) {
  if (!threads.length) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        No messages yet. Conversations customers start will show up here.
      </p>
    );
  }

  return (
    <ul className="divide-y overflow-y-auto">
      {threads.map((thread) => {
        const isSelected = thread.customerId === selectedCustomerId;
        const lastMessage = thread.messages[thread.messages.length - 1];
        const label =
          thread.customerId === "__unassigned__"
            ? "General"
            : `Customer ${thread.customerId.slice(0, 8)}`;

        return (
          <li key={thread.customerId}>
            <button
              onClick={() => onSelect(thread.customerId)}
              className={cn(
                "flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition-colors hover:bg-muted",
                isSelected && "bg-muted",
              )}
            >
              <span className="truncate text-sm font-medium">{label}</span>
              {lastMessage && (
                <>
                  <span className="w-full truncate text-xs text-muted-foreground">{lastMessage.text}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(lastMessage.createdAt).toLocaleString()}
                  </span>
                </>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}