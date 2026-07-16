"use client";

import { AppHeader } from "@/components/shared/app-header";
import { useRoleGuard } from "@/lib/hooks/useRoleGuard";

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const { isAllowed } = useRoleGuard("Merchant");

  if (!isAllowed) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader role="Merchant" />
      <main className="flex-1">{children}</main>
    </div>
  );
}