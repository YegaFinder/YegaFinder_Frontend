"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { profileApi } from "../api/profile.api";
import { getErrorMessage } from "@/lib/errors";
import type {
  CreateSavedAddressRequest,
  SavedAddress,
  UpdateSavedAddressRequest,
} from "../types/profile.types";

/**
 * Owns the saved-addresses list plus create/update/delete. Mirrors the
 * manual-state convention used elsewhere in this feature and in
 * features/auth. Mutations refetch the list on success rather than
 * hand-patching local state, since the list is small and a refetch keeps
 * this file simple and always consistent with the server.
 */
export function useSavedAddresses() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profileApi.listSavedAddresses();
      setAddresses(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  async function addAddress(payload: CreateSavedAddressRequest) {
    setIsMutating(true);
    try {
      await profileApi.createSavedAddress(payload);
      toast.success("Address saved.");
      await fetchAddresses();
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  async function updateAddress(id: string, payload: UpdateSavedAddressRequest) {
    setIsMutating(true);
    try {
      await profileApi.updateSavedAddress(id, payload);
      toast.success("Address updated.");
      await fetchAddresses();
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  async function deleteAddress(id: string) {
    setIsMutating(true);
    try {
      await profileApi.deleteSavedAddress(id);
      toast.success("Address removed.");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  return {
    addresses,
    isLoading,
    error,
    isMutating,
    addAddress,
    updateAddress,
    deleteAddress,
    refetch: fetchAddresses,
  };
}
