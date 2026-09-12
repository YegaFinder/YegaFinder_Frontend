"use client";

import { useMerchantProfile } from "@/features/profile/hooks/useMerchantProfile";
import { Spinner } from "@/components/shared/form-feedback";
import { ConversationView } from "./ConversationView";

/**
 * KNOWN LIMITATION, not a bug: the real API has no endpoint for a merchant
 * to list which customers have messaged them, and POST /messages doesn't
 * take a recipient/customerId — only { businessId, text }. So this screen
 * shows ONE combined feed of every message sent to this business, from
 * every customer, with no way to separate them into per-customer threads.
 *
 * This needs backend to add something like GET /messages/merchant/threads,
 * or a customerId parameter on both the GET and POST, before "Messages"
 * works the way a merchant would expect once they have more than one
 * customer talking to them at once. Shipping this as a stopgap rather than
 * blocking the page entirely — but the banner below is deliberately not
 * subtle, so nobody mistakes this for a finished feature.
 *
 * ASSUMPTION: `profile.id` (from /merchant/profile) is the same id the
 * rest of the API calls `businessId`. Reasonable given merchant management
 * is singular (one business per merchant, no /merchant/listings
 * collection) — but not something I could directly confirm from the docs
 * provided. Worth a quick check against a real response.
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
        All customer messages appear in one combined feed for now — the backend doesn&apos;t yet support separating
        conversations by customer. Ask backend for a per-customer thread endpoint before relying on this for real use.
      </div>
      <div className="flex-1 overflow-hidden">
        <ConversationView businessId={profile?.id} title="All messages" />
      </div>
    </div>
  );
}