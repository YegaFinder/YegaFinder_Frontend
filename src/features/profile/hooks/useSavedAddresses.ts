"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useCustomerProfile } from "./useCustomerProfile";
import { getErrorMessage } from "@/lib/errors";
import type { CreateSavedAddressRequest, SavedAddress, UpdateSavedAddressRequest } from "../types/profile.types";

/**
 * IMPORTANT: there is no `/profile/addresses` (or similar) endpoint on
 * this backend. `savedAddresses` is just a field on the customer profile
 * (Final-YegnaFinder-Frontend-Integration-Guide.md §5.7, §7), and PUT
 * /profiles/customer replaces that field wholesale — it is NOT validated
 * item-by-item (`@IsArray()` only, no `@ValidateNested()`), so a
 * malformed address object would be accepted as-is.
 *
 * This hook reads the current list off the cached profile
 * (via useCustomerProfile, same React Query cache as the rest of the
 * feature) and PUTs back the full mutated array. IDs for new addresses
 * are generated client-side since there's no create-a-single-address
 * endpoint to return one.
 */
export function useSavedAddresses() {
  const { profile, isLoading, updateProfile } = useCustomerProfile();
  const [isMutating, setIsMutating] = useState(false);

  const addresses = profile?.savedAddresses ?? [];

  async function addAddress(payload: CreateSavedAddressRequest) {
    setIsMutating(true);
    try {
      const newAddress: SavedAddress = { id: crypto.randomUUID(), ...payload };
      await updateProfile({ savedAddresses: [...addresses, newAddress] });
      toast.success("Address saved.");
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return false;
    } finally {
      setIsMutating(false);
    }
  }

  async function updateAddress({ id, ...payload }: UpdateSavedAddressRequest) {
    setIsMutating(true);
    try {
      const next = addresses.map((a) => (a.id === id ? { ...a, ...payload } : a));
      await updateProfile({ savedAddresses: next });
      toast.success("Address updated.");
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
      const next = addresses.filter((a) => a.id !== id);
      await updateProfile({ savedAddresses: next });
      toast.success("Address removed.");
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
    isMutating,
    addAddress,
    updateAddress,
    deleteAddress,
  };
}