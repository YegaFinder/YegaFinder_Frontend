"use client";

/**
 * RECONSTRUCTED — this file was referenced (by both (customer)/layout.tsx
 * and (merchant)/layout.tsx) but its actual source was never shown to me,
 * so this is a best-effort rebuild, not a byte-for-byte copy of whatever
 * exists in the real repo. Diff this against the real file before
 * committing — if the real one already exists, keep that one and drop
 * this reconstruction note.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/features/auth/api/auth.api";
import { ROUTES } from "@/constants/routes";
import type { Role } from "@/features/auth/types/auth.types";

export function AppHeader({ role }: { role: Role }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const storeLogout = useAuthStore((state) => state.logout);

  const homeHref = role === "Merchant" ? ROUTES.MERCHANT_DASHBOARD : ROUTES.APP_HOME;

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // Even if the server call fails (network error, already-expired
      // token), still clear local state — staying "logged in" client-side
      // with a dead token is worse than a logout call that silently failed.
    } finally {
      storeLogout();
      router.push(ROUTES.LOGIN);
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-yegna-border bg-yegna-background/95 px-4 backdrop-blur">
      <Link href={homeHref} className="flex items-center">
        <Logo height={28} />
      </Link>

      <div className="flex items-center gap-3">
        {user?.email && (
          <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
        )}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  );
}
