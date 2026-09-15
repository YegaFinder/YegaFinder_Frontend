"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useBusinessDetail } from "@/features/business-discovery/api/hooks/useBusinessDetail";
import { ChatWindow } from "./ChatWindow";
import { ROUTES } from "@/constants/routes";

/**
 * There is no documented "my conversations" list endpoint for customers
 * (only /messages/merchant/threads exists, merchant-only, per §7.1) — so
 * this can't be a real inbox the way the merchant messages page is. It's a
 * deep-link target instead: /messages?businessId=... opens that
 * conversation directly (e.g. from a future notification's link). Without
 * a businessId it just points people back to where chat actually lives
 * today — a business's own page — rather than showing an empty list that
 * pretends to be a real inbox.
 */
export function CustomerMessagesDeepLink() {
  const businessId = useSearchParams().get("businessId");
  const { data: business, isLoading } = useBusinessDetail(businessId ?? "");

  if (!businessId) {
    return (
      <main className="mx-auto max-w-md px-4 py-10 text-center space-y-3">
        <h1 className="text-xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Open a business&apos;s page to start or continue a conversation.
        </p>
        <Link href={ROUTES.SEARCH} className="text-sm font-medium text-yegna-primary underline">
          Find a business
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <ChatWindow
          businessId={businessId}
          businessName={business?.businessName}
          viewerRole="CUSTOMER"
          className="h-[calc(100vh-8rem)] w-full"
        />
      )}
    </main>
  );
}