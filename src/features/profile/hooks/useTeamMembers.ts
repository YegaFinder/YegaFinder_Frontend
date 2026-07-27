"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { staffApi, type CreateStaffRequest } from "../api/staff.api";
import { getErrorMessage } from "@/lib/errors";

export const TEAM_MEMBERS_QUERY_KEY = ["merchant", "staff"] as const;

export function useTeamMembers() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: TEAM_MEMBERS_QUERY_KEY,
    queryFn: staffApi.list,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateStaffRequest) => staffApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_QUERY_KEY });
      toast.success("Team member added.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, { 500: "Couldn't add that user — double-check the user ID." }));
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => staffApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_QUERY_KEY });
      toast.success("Team member removed.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return {
    staff: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    addStaff: createMutation.mutateAsync,
    isAdding: createMutation.isPending,
    removeStaff: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
  };
}