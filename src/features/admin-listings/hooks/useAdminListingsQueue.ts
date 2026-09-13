"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminListingsApi } from "../api/admin-listings.api";
import type { ListingApprovalStatus } from "../types/admin-listing.types";

export function useAdminListingsQueue(initialStatus: ListingApprovalStatus = "pending") {
  const [status, setStatus] = useState<ListingApprovalStatus>(initialStatus);
  const queryClient = useQueryClient();

  const {
    data: listings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-listings", status],
    queryFn: () => adminListingsApi.list(status),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-listings", status] });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminListingsApi.approve(id),
    onSuccess: invalidate,
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminListingsApi.reject(id, reason),
    onSuccess: invalidate,
  });

  return {
    listings,
    status,
    setStatus,
    isLoading,
    isError,
    approve: approveMutation.mutate,
    approvingId: approveMutation.isPending ? approveMutation.variables : undefined,
    reject: rejectMutation.mutate,
    rejectingId: rejectMutation.isPending ? rejectMutation.variables?.id : undefined,
  };
}