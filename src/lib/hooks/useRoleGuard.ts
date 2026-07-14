"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/constants/routes";
import type { Role } from "@/features/auth/types/auth.types";

export function useRoleGuard(allowedRole: Role) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (user.role !== allowedRole) {
      const fallback = user.role === "Merchant" ? ROUTES.MERCHANT_DASHBOARD : ROUTES.APP_HOME;
      router.replace(fallback);
    }
  }, [user, isAuthenticated, allowedRole, router]);

  const isAllowed = isAuthenticated && !!user && user.role === allowedRole;

  return { isAllowed, user };
}