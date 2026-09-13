"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersApi } from "../api/admin-users.api";
import type { UsersFilter } from "../types/admin-user.types";

const PAGE_SIZE = 5;

export function useAdminUsersQueue() {
  const [role, setRole] = useState<UsersFilter["role"]>(undefined);
  const [isActive, setIsActive] = useState<UsersFilter["isActive"]>(undefined);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const queryKey = ["admin-users", role, isActive, page] as const;

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => adminUsersApi.list({ role, isActive, page, limit: PAGE_SIZE }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive: next }: { id: string; isActive: boolean }) =>
      adminUsersApi.setActive(id, next),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  return {
    users: data?.users ?? [],
    meta: data?.meta,
    role,
    setRole: (r: UsersFilter["role"]) => { setRole(r); setPage(1); },
    isActive,
    setIsActive: (v: UsersFilter["isActive"]) => { setIsActive(v); setPage(1); },
    page,
    setPage,
    isLoading,
    isError,
    toggleActive: toggleActiveMutation.mutate,
    togglingId: toggleActiveMutation.isPending ? toggleActiveMutation.variables?.id : undefined,
  };
}