"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/constants/routes";
import type { Role } from "@/features/auth/types/auth.types";

// Widened from a single Role to Role | Role[] so the admin route group can
// allow both "Admin" and "Moderator" through the same guard — (customer)
// and (merchant) layouts keep passing a single role unchanged.
export function useRoleGuard(allowedRole: Role | Role[]) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (!allowedRoles.includes(user.role)) {
      const fallback =
        user.role === "Merchant"
          ? ROUTES.MERCHANT_DASHBOARD
          : user.role === "Admin" || user.role === "Moderator"
            ? ROUTES.ADMIN_DASHBOARD
            : ROUTES.APP_HOME;
      router.replace(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthenticated, router, ...allowedRoles]);

  const isAllowed = isAuthenticated && !!user && allowedRoles.includes(user.role);

  return { isAllowed, user };
}