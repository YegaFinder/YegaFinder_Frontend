"use client";

import { AppHeader } from "@/components/shared/app-header";
import { useRoleGuard } from "@/lib/hooks/useRoleGuard";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { isAllowed } = useRoleGuard("Customer");

  // If not allowed, don't render anything
  if (!isAllowed) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader role="Customer" />
      <main className="flex-1">{children}</main>
    </div>
  );
}