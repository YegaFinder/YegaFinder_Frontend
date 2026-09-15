"use client";

import { useMemo, useState } from "react";
import { useMerchantProfile } from "@/features/profile/hooks/useMerchantProfile";
import { useMessages } from "../api/hooks/useMessages";
import { groupMessagesByCustomer } from "../lib/groupMessagesByCustomer";
import { MerchantThreadList } from "./MerchantThreadList";
import { ChatWindow } from "./ChatWindow";

export function MerchantMessagesView() {
  const { profile, isLoading: isProfileLoading, isError: isProfileError, profileNotCreatedYet } = useMerchantProfile();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // ASSUMPTION: MerchantProfile.id is the same id as the public Business
  // record (/businesses/:id, /messages/:businessId) — consistent with the
  // "single business per merchant" model confirmed in §10, but not something
  // I could independently verify without backend source access. Confirm
  // with your teammate/backend before relying on this in production.
  const businessId = profile?.id ?? "";

  // ONE query for the whole business's messages (confirmed: a merchant sees
  // every message, from every customer — see messages.api.ts). Threads and
  // the selected conversation are both derived from this single result, not
  // separate fetches — there's no backend support for fetching just one
  // customer's slice.
  const { data: allMessages, isLoading: isMessagesLoading, isError: isMessagesError } = useMessages(businessId);
  const threads = useMemo(() => groupMessagesByCustomer(allMessages ?? []), [allMessages]);
  const selectedThread = threads.find((t) => t.customerId === selectedCustomerId);

  if (isProfileLoading) {
    return <p className="p-4 text-sm text-muted-foreground">Loading...</p>;
  }

  if (profileNotCreatedYet) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        Finish setting up your business profile before customers can message you.
      </p>
    );
  }

  if (isProfileError || !profile) {
    return <p className="p-4 text-sm text-muted-foreground">Could not load your business profile.</p>;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[420px] overflow-hidden rounded-xl border">
      <div className={`w-full border-r sm:w-72 sm:shrink-0 ${selectedCustomerId ? "hidden sm:block" : "block"}`}>
        {isMessagesLoading ? (
          <p className="p-4 text-sm text-muted-foreground">Loading conversations...</p>
        ) : isMessagesError ? (
          <p className="p-4 text-sm text-muted-foreground">Could not load conversations.</p>
        ) : (
          <MerchantThreadList threads={threads} selectedCustomerId={selectedCustomerId} onSelect={setSelectedCustomerId} />
        )}
      </div>

      <div className={`flex-1 ${selectedCustomerId ? "block" : "hidden sm:flex sm:items-center sm:justify-center"}`}>
        {selectedThread ? (
          <div className="flex h-full flex-col">
            <button
              onClick={() => setSelectedCustomerId(null)}
              className="border-b px-4 py-2 text-left text-xs text-muted-foreground hover:text-foreground sm:hidden"
            >
              &larr; Back to conversations
            </button>
            <ChatWindow
              businessId={businessId}
              businessName={
                selectedThread.customerId === "__unassigned__"
                  ? "General"
                  : `Customer ${selectedThread.customerId.slice(0, 8)}`
              }
              viewerRole="MERCHANT"
              messages={selectedThread.messages}
              className="h-full w-full"
            />
          </div>
        ) : (
          <p className="p-4 text-sm text-muted-foreground">Select a conversation to view messages.</p>
        )}
      </div>
    </div>
  );
}