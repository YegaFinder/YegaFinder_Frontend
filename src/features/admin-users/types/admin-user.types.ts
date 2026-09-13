import type { User } from "@/features/auth/types/auth.types";

// User already matches UserResponseDto exactly (see auth.types.ts comment),
// so no separate AdminUser type is needed — reuse it as-is.
export type { User };

export interface UsersQueryMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsersFilter {
  role?: User["role"];
  isActive?: boolean;
  page: number;
  limit: number;
}