import { Suspense } from "react";
import { CustomerMessagesDeepLink } from "@/features/messaging/components/CustomerMessagesDeepLink";

export default function MessagesPage() {
  return (
    <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">Loading...</p>}>
      <CustomerMessagesDeepLink />
    </Suspense>
  );
}