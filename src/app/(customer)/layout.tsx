"use client";

import { AppHeader } from "@/components/shared/app-header";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { useRoleGuard } from "@/lib/hooks/useRoleGuard";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { isAllowed } = useRoleGuard("Customer");

  // If not allowed, don't render anything
  if (!isAllowed) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader role="Customer" />
      {/* pb-16 reserves space for the fixed bottom nav so the last bit of
          content isn't hidden behind it; not needed at md+ where the bar
          doesn't render. */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <MobileBottomNav role="Customer" />
    </div>
  );
}