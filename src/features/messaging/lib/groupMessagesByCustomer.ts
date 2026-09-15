import type { Message } from "../types/message.types";

export interface MerchantThread {
  customerId: string;
  messages: Message[];
}

const UNASSIGNED = "__unassigned__";

/**
 * Client-side replacement for the dead GET /messages/merchant/threads
 * endpoint (see the note in messages.api.ts and CHAT_MESSAGES_FRONTEND_GUIDE.md
 * §1/§4). A merchant's GET /messages/:businessId returns every message for
 * the business, from every customer, as one flat list — this groups that
 * list into per-customer threads for display.
 *
 * CUSTOMER-authored messages group correctly and reliably: senderId IS the
 * customer's real id.
 *
 * MERCHANT-authored messages carry no customerId/recipientId at all (the
 * backend doesn't record who a reply targets), so they're assigned here to
 * whichever customer thread was most recently active — a heuristic, not a
 * guarantee. It's right for the common case (merchant replies shortly after
 * that customer's message) and wrong if a merchant is fielding two
 * customers' messages interleaved in time. A merchant message with no
 * customer message before it yet (e.g. merchant messaged first) lands in
 * an "unassigned" bucket instead of guessing further.
 *
 * This entire function becomes unnecessary once backend adds either a real
 * threads endpoint or a customerId/recipientId on Message — flagged as
 * backend ticket #1 in CHAT_MESSAGES_FRONTEND_GUIDE.md §4.
 */
export function groupMessagesByCustomer(messages: Message[]): MerchantThread[] {
  const byCustomer = new Map<string, Message[]>();
  let currentCustomerId: string | null = null;

  const sorted = [...messages].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  for (const message of sorted) {
    let key: string;
    if (message.senderRole === "CUSTOMER") {
      currentCustomerId = message.senderId;
      key = message.senderId;
    } else {
      key = currentCustomerId ?? UNASSIGNED;
    }
    if (!byCustomer.has(key)) byCustomer.set(key, []);
    byCustomer.get(key)!.push(message);
  }

  return Array.from(byCustomer.entries())
    .map(([customerId, msgs]) => ({ customerId, messages: msgs }))
    .sort((a, b) => {
      const aLast = a.messages[a.messages.length - 1]?.createdAt ?? "";
      const bLast = b.messages[b.messages.length - 1]?.createdAt ?? "";
      return bLast.localeCompare(aLast); // most recently active thread first
    });
}

export const UNASSIGNED_THREAD_ID = UNASSIGNED;