"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function AppHeader({ role }: { role: "Customer" | "Merchant" }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const storeLogout = useAuthStore((state) => state.logout);
  const router = useRouter();

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await authApi.logout();
    } catch {
      // Swallowed on purpose
    } finally {
      storeLogout(); 
      router.replace(ROUTES.LOGIN); 
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={role === "Merchant" ? ROUTES.MERCHANT_DASHBOARD : ROUTES.APP_HOME} className="font-bold text-yegna-primary text-xl">
            YegnaFinder
          </Link>
          <nav className="hidden md:flex gap-4">
            {role === "Customer" ? (
              <>
                <Link href={ROUTES.APP_HOME} className="text-sm font-medium hover:text-yegna-primary">Home</Link>
                <Link href={ROUTES.PROFILE} className="text-sm font-medium hover:text-yegna-primary">Profile</Link>
                <Link href={ROUTES.SAVED_PLACES} className="text-sm font-medium hover:text-yegna-primary">Saved Places</Link>
              </>
            ) : (
              <>
                <Link href={ROUTES.MERCHANT_DASHBOARD} className="text-sm font-medium hover:text-yegna-primary">Dashboard</Link>
                <Link href={ROUTES.MERCHANT_PROFILE} className="text-sm font-medium hover:text-yegna-primary">Profile</Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </div>
    </header>
  );
}
