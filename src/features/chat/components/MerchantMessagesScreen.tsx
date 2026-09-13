"use client";

import { useMerchantProfile } from "@/features/profile/hooks/useMerchantProfile";
import { Spinner } from "@/components/shared/form-feedback";
import { ConversationView } from "./ConversationView";

/**
 * TWO KNOWN LIMITATIONS, not bugs:
 *
 * 1. No per-customer threads: the real API has no endpoint for a merchant
 *    to list which customers have messaged them, and GET/POST /messages
 *    don't take a customerId — only { businessId, text }. So this screen
 *    shows ONE combined feed of every message sent to this business, from
 *    every customer, with no way to separate them into per-customer threads.
 *
 * 2. Merchants cannot reply at all: POST /messages throws 403 for any
 *    non-Customer role (YegnaFinder_Backend_Reference.md §11) — there is
 *    no merchant-reply endpoint anywhere in the backend today. The
 *    composer is intentionally disabled here rather than shown active,
 *    since an active composer would just produce an endless, confusing
 *    "failed to send, tap to retry" loop that can never succeed.
 *
 * Both need backend work — a per-customer thread endpoint and a
 * senderRole: 'business' write path — before this screen is a real
 * merchant inbox. Shipping read-only as a stopgap rather than blocking
 * the page entirely.
 *
 * ASSUMPTION: `profile.id` (from /merchant/profile) is the same id the
 * rest of the API calls `businessId` — reasonable given merchant
 * management is singular, but worth a quick check against a real response.
 */
export function MerchantMessagesScreen() {
  const { profile, isLoading } = useMerchantProfile();

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center gap-2 text-muted-foreground">
        <Spinner className="size-5" /> Loading...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
        All customer messages appear in one combined feed, and replying isn&apos;t supported yet — the backend has
        no way for a business to send a message. Reply to customers by phone or email for now.
      </div>
      <div className="flex-1 overflow-hidden">
        <ConversationView
          businessId={profile?.id}
          title="All messages"
          canSend={false}
          disabledReason="Merchant replies aren't supported by the backend yet — reply by phone or email instead."
        />
      </div>
    </div>
  );
}