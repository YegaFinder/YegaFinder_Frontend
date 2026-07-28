"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bookmark, User, LayoutDashboard } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

const CUSTOMER_ITEMS: NavItem[] = [
  { href: ROUTES.APP_HOME, label: "Home", icon: Home },
  { href: ROUTES.SAVED_PLACES, label: "Saved", icon: Bookmark },
  { href: ROUTES.PROFILE, label: "Profile", icon: User },
];

const MERCHANT_ITEMS: NavItem[] = [
  { href: ROUTES.MERCHANT_DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.MERCHANT_PROFILE, label: "Profile", icon: User },
];

/**
 * Mirrors the same set of destinations AppHeader's desktop <nav> exposes
 * at md+ — this is the mobile-first equivalent of that nav, not an
 * extra/different menu. Keep the two in sync if routes are added.
 *
 * Fixed to the bottom of the viewport (thumb-reachable, native-app
 * pattern) and only rendered below md — desktop already has the top
 * nav, so this and AppHeader's <nav> are mutually exclusive, never both
 * visible at once.
 */
export function MobileBottomNav({ role }: { role: "Customer" | "Merchant" }) {
  const pathname = usePathname();
  const items = role === "Customer" ? CUSTOMER_ITEMS : MERCHANT_ITEMS;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      {items.map(({ href, label, icon: Icon }) => {
        // Exact match for the app-home "/" style root of each role,
        // startsWith for nested routes (e.g. /profile/edit) so the tab
        // stays highlighted while you're anywhere under it.
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors",
              // 44px+ tap target height (py-2 + icon + label comfortably clears it)
              "min-h-[56px]",
              isActive ? "text-yegna-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
