"use client";

import { useAuthStore } from "@/store/auth-store";

export default function AppHomePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[calc(100vh-3.5rem)]">
      <p className="text-muted-foreground text-lg">Not implemented yet.</p>
      {user?.email && (
        <p className="text-sm text-muted-foreground">
          Logged in as <span className="font-medium text-foreground">{user.email}</span>
        </p>
      )}
    </div>
  );
}