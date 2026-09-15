"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "../api/admin.api";
import { getErrorMessage } from "@/lib/errors";
import type { RejectListingRequest } from "../types/admin.types";

type StatusFilter = "PENDING" | "APPROVED" | "REJECTED";

const queryKey = (status: StatusFilter) => ["admin", "listings", status] as const;

// §11.1–11.3 — matches FRONTEND_API_IMPLEMENTATION_GUIDE.md exactly. Unlike
// the chat endpoints, these have no known backend bugs as of the notes
// shared so far.
export function useVerificationQueue() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<StatusFilter>("PENDING");

  const query = useQuery({
    queryKey: queryKey(status),
    queryFn: () => adminApi.getListingsForApproval(status),
  });

  function invalidateAll() {
    // A business moves between all three tabs on approve/reject, so refresh
    // every status bucket rather than just the one currently in view.
    return Promise.all(
      (["PENDING", "APPROVED", "REJECTED"] as const).map((s) =>
        queryClient.invalidateQueries({ queryKey: queryKey(s) }),
      ),
    );
  }

  const approveMutation = useMutation({
    mutationFn: (businessId: string) => adminApi.approveListing(businessId),
    onSuccess: async () => {
      await invalidateAll();
      toast.success("Listing approved.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ businessId, payload }: { businessId: string; payload: RejectListingRequest }) =>
      adminApi.rejectListing(businessId, payload),
    onSuccess: async () => {
      await invalidateAll();
      toast.success("Listing rejected.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return {
    status,
    setStatus,
    listings: query.data,
    isLoading: query.isLoading,
    isError: query.isError,

    approve: approveMutation.mutate,
    isApproving: approveMutation.isPending,

    reject: (businessId: string, reason: string) => rejectMutation.mutate({ businessId, payload: { reason } }),
    isRejecting: rejectMutation.isPending,
  };
}