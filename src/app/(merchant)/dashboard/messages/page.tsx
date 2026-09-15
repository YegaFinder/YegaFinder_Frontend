import { MerchantMessagesView } from "@/features/messaging/components/MerchantMessagesView";

export default function MerchantMessagesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground">Conversations with your customers.</p>
      </header>
      <MerchantMessagesView />
    </main>
  );
}