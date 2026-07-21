"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Pencil, Trash2, LocateFixed, CircleCheck } from "lucide-react";

import { savedAddressSchema, type SavedAddressFormValues } from "../schemas/profile.schema";
import { useSavedAddresses } from "../hooks/useSavedAddresses";
import { geocodeAddress, type GeocodeResult } from "@/lib/geocode";
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
 * before is dropped for now — there's nowhere to persist it).
 *
 * latitude/longitude are required, non-null numbers on the response
 * type. Previously this form submitted `0/0` placeholders since there
 * was no way to collect real coordinates from a typed address. That's
 * fixed here: `AddressForm` now runs the typed address through
 * `geocodeAddress` (OpenStreetMap Nominatim, see src/lib/geocode.ts)
 * before allowing a save, and re-requires a fresh lookup if the address
 * text changes after coordinates were found — so stale/mismatched
 * coordinates never get silently submitted.
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
            initialCoords={{
              latitude: address.latitude,
              longitude: address.longitude,
              displayName: address.address,
            }}
            isSaving={isMutating}
            onCancel={() => setEditingId(null)}
            onSubmit={async (values, coords) => {
              const ok = await updateAddress({ id: address.id, ...toRequest(values, coords) });
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
          initialCoords={null}
          isSaving={isMutating}
          onCancel={() => setIsAdding(false)}
          onSubmit={async (values, coords) => {
            const ok = await addAddress(toRequest(values, coords));
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

/** Coordinates now always come from a confirmed geocode lookup — see AddressForm below. */
function toRequest(values: SavedAddressFormValues, coords: GeocodeResult) {
  return {
    label: values.label,
    address: values.address,
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
}

interface AddressFormProps {
  initialValues: SavedAddressFormValues;
  /** Existing coordinates when editing an unchanged address; null for a brand-new one. */
  initialCoords: GeocodeResult | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (values: SavedAddressFormValues, coords: GeocodeResult) => Promise<void>;
}

function AddressForm({ initialValues, initialCoords, isSaving, onCancel, onSubmit }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SavedAddressFormValues>({
    resolver: zodResolver(savedAddressSchema),
    defaultValues: initialValues,
  });

  const [coords, setCoords] = useState<GeocodeResult | null>(initialCoords);
  // Tracks the exact address text the current `coords` were resolved for,
  // so we can tell when the user has edited the address since the last
  // successful lookup (or since loading an existing saved address).
  const [coordsAddress, setCoordsAddress] = useState<string | null>(
    initialCoords ? initialValues.address : null,
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const currentAddress = watch("address");
  const coordsAreStale = coords !== null && currentAddress !== coordsAddress;
  const hasConfirmedCoords = coords !== null && !coordsAreStale;

  async function handleFindLocation() {
    setLocateError(null);
    if (!currentAddress?.trim()) {
      setLocateError("Enter an address first.");
      return;
    }
    setIsLocating(true);
    try {
      const result = await geocodeAddress(currentAddress);
      if (!result) {
        setLocateError("Couldn't find that address. Try adding more detail (city, area).");
        setCoords(null);
        setCoordsAddress(null);
        return;
      }
      setCoords(result);
      setCoordsAddress(currentAddress);
    } catch {
      setLocateError("Location lookup failed. Please try again.");
    } finally {
      setIsLocating(false);
    }
  }

  async function handleFormSubmit(values: SavedAddressFormValues) {
    if (!hasConfirmedCoords || !coords) {
      setLocateError("Find the location before saving, so we can pin this address correctly.");
      return;
    }
    await onSubmit(values, coords);
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
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
        <div className="flex gap-2">
          <Input id="address" aria-invalid={!!errors.address} {...register("address")} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            disabled={isLocating}
            onClick={handleFindLocation}
          >
            {isLocating ? <Spinner /> : <LocateFixed className="size-4" />}
            Find location
          </Button>
        </div>
        <FieldError message={errors.address?.message} />

        {hasConfirmedCoords && (
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <CircleCheck className="mt-0.5 size-3.5 shrink-0 text-yegna-primary" />
            Location confirmed: {coords!.displayName}
          </p>
        )}
        {coordsAreStale && (
          <p className="text-xs text-muted-foreground">
            Address changed — find the location again before saving.
          </p>
        )}
        {locateError && <p className="text-xs text-destructive">{locateError}</p>}
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
