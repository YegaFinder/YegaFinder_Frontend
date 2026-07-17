"use client";

import { AppHeader } from "@/components/shared/app-header";
import { useRoleGuard } from "@/lib/hooks/useRoleGuard";

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const { isAllowed } = useRoleGuard("Merchant");

  if (!isAllowed) return null;

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <AppHeader role="Merchant" />
      <main className="flex-1">
        <div className="container max-w-5xl mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}