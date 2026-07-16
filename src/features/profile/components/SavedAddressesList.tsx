"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Pencil, Trash2 } from "lucide-react";

import { savedAddressSchema, type SavedAddressFormValues } from "../schemas/profile.schema";
import { useSavedAddresses } from "../hooks/useSavedAddresses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, Spinner } from "@/components/shared/form-feedback";
import type { SavedAddress } from "../types/profile.types";

const EMPTY_FORM: SavedAddressFormValues = {
  label: "",
  address: "",
};

/**
 * `SavedAddress` on main is `{ id, label, address, latitude, longitude }`
 * — a single free-text address line, no addressLine1/2/city/region, and
 * no `isDefault` flag (so the "Default" badge/selection this list had
 * before is dropped for now — there's nowhere to persist it). latitude/
 * longitude are required, non-null numbers on the response type, but
 * there's no map picker here to collect real coordinates from a typed
 * address, so new addresses are submitted with 0/0 placeholders until
 * there's either a map picker or the backend geocodes the address
 * server-side. Flag this for the backend/product conversation before
 * relying on saved-address coordinates anywhere (e.g. "nearest to me"
 * sorting).
 */
export function SavedAddressesList() {
  const { addresses, isLoading, isMutating, addAddress, updateAddress, deleteAddress } =
    useSavedAddresses();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading saved places…</p>;
  }

  return (
    <div className="space-y-4">
      {addresses.length === 0 && !isAdding && (
        <p className="text-sm text-muted-foreground">You haven&apos;t saved any places yet.</p>
      )}

      {addresses.map((address) =>
        editingId === address.id ? (
          <AddressForm
            key={address.id}
            initialValues={toFormValues(address)}
            isSaving={isMutating}
            onCancel={() => setEditingId(null)}
            onSubmit={async (values) => {
              const ok = await updateAddress(address.id, toRequest(values, address));
              if (ok) setEditingId(null);
            }}
          />
        ) : (
          <div
            key={address.id}
            className="flex items-start justify-between gap-4 rounded-[14px] border border-yegna-border bg-yegna-background px-4 py-3"
          >
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-yegna-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">{address.label}</p>
                <p className="text-sm text-muted-foreground">{address.address}</p>
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Edit ${address.label}`}
                onClick={() => setEditingId(address.id)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Delete ${address.label}`}
                onClick={() => deleteAddress(address.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ),
      )}

      {isAdding ? (
        <AddressForm
          initialValues={EMPTY_FORM}
          isSaving={isMutating}
          onCancel={() => setIsAdding(false)}
          onSubmit={async (values) => {
            const ok = await addAddress(toRequest(values));
            if (ok) setIsAdding(false);
          }}
        />
      ) : (
        <Button type="button" variant="outline" onClick={() => setIsAdding(true)}>
          Add a new address
        </Button>
      )}
    </div>
  );
}

function toFormValues(address: SavedAddress): SavedAddressFormValues {
  return {
    label: address.label,
    address: address.address,
  };
}

/** Preserves existing lat/lng on edit; defaults to 0/0 for a brand-new address — see this file's top docblock. */
function toRequest(values: SavedAddressFormValues, existing?: SavedAddress) {
  return {
    label: values.label,
    address: values.address,
    latitude: existing?.latitude ?? 0,
    longitude: existing?.longitude ?? 0,
  };
}

interface AddressFormProps {
  initialValues: SavedAddressFormValues;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (values: SavedAddressFormValues) => Promise<void>;
}

function AddressForm({ initialValues, isSaving, onCancel, onSubmit }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SavedAddressFormValues>({
    resolver: zodResolver(savedAddressSchema),
    defaultValues: initialValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-[14px] border border-yegna-border bg-yegna-background p-4"
      noValidate
    >
      <div className="space-y-1.5">
        <Label htmlFor="label">Label</Label>
        <Input id="label" placeholder="Home, Work…" aria-invalid={!!errors.label} {...register("label")} />
        <FieldError message={errors.label?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">Address</Label>
        <Input id="address" aria-invalid={!!errors.address} {...register("address")} />
        <FieldError message={errors.address?.message} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving && <Spinner />}
          {isSaving ? "Saving..." : "Save address"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
