"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function AppHomePage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const user = useAuthStore((state) => state.user);
  const storeLogout = useAuthStore((state) => state.logout);
  const router = useRouter();

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      // Best-effort: revoke the refresh token server-side. If this call
      // fails (network issue, token already expired, etc.) we still
      // clear local state in `finally` below — the user should never
      // be stuck unable to log out just because the API call failed.
      await authApi.logout();
    } catch {
      // Swallowed on purpose — see comment above.
    } finally {
      storeLogout(); // clears localStorage tokens + the access_token cookie
      router.replace(ROUTES.LOGIN); // replace, not push — same reasoning as useLogin.ts
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <p className="text-muted-foreground text-lg">Not implemented yet.</p>
      {user?.email && (
        <p className="text-sm text-muted-foreground">
          Logged in as <span className="font-medium text-foreground">{user.email}</span>
        </p>
      )}
      <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? "Logging out..." : "Log out"}
      </Button>
    </main>
  );
}
