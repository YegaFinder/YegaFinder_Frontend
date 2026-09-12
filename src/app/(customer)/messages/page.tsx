/**
 * PLACEHOLDER — the real API has no endpoint to list "which businesses have
 * I messaged" (see chat/components/MerchantMessagesScreen.tsx's note for
 * the equivalent merchant-side gap). A generic inbox at /messages with no
 * business in the URL can't be built against GET /messages/:businessId
 * alone — it needs a specific businessId to fetch.
 *
 * The real shape this probably wants is a route like /messages/[businessId],
 * reached via a "Message this business" button on a business detail page
 * (business-discovery's territory, not this branch's) — not a standalone
 * inbox. Flagging this rather than guessing a redesign for a route this
 * branch doesn't own.
 */
export default function CustomerMessagesPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
      <h1 className="text-xl font-semibold text-yegna-navy">Messages</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Message a business from its listing page to start a conversation.
      </p>
    </div>
  );
}