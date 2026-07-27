"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, Spinner } from "@/components/shared/form-feedback";
import { geocodeAddress } from "@/lib/geocode";

import { businessLocationSchema, type BusinessLocationFormValues } from "../schemas/merchant-profile.schema";
import type { MerchantProfile } from "../types/profile.types";

interface BusinessLocationFormProps {
  profile?: MerchantProfile;
  onSubmit: (values: BusinessLocationFormValues) => void | Promise<void>;
  isSaving: boolean;
  disabled?: boolean;
}

export function BusinessLocationForm({ profile, onSubmit, isSaving, disabled }: BusinessLocationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<BusinessLocationFormValues>({
    resolver: zodResolver(businessLocationSchema),
    defaultValues: {
      businessAddress: profile?.businessAddress ?? "",
      latitude: profile?.latitude,
      longitude: profile?.longitude,
    },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      businessAddress: profile.businessAddress ?? "",
      latitude: profile.latitude,
      longitude: profile.longitude,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const [isLocating, setIsLocating] = useState(false);
  const address = watch("businessAddress");
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  async function handleFindOnMap() {
    if (!address?.trim()) {
      toast.error("Enter an address first.");
      return;
    }
    setIsLocating(true);
    try {
      const result = await geocodeAddress(address);
      if (!result) {
        toast.error("Couldn't find that address. Try adding more detail (city, region).");
        return;
      }
      setValue("latitude", result.latitude, { shouldDirty: true });
      setValue("longitude", result.longitude, { shouldDirty: true });
      toast.success("Location found — check the map preview below.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Location lookup failed.");
    } finally {
      setIsLocating(false);
    }
  }

  const hasCoordinates = typeof latitude === "number" && typeof longitude === "number";
  // Free, no-API-key map preview via OpenStreetMap. If your team later adds
  // a Google Maps API key (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY), swap this src
  // for: `https://www.google.com/maps/embed/v1/place?key=${key}&q=${latitude},${longitude}`
  const mapSrc = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude! - 0.01}%2C${latitude! - 0.01}%2C${longitude! + 0.01}%2C${latitude! + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`
    : null;

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-4" noValidate>
      {disabled && (
        <p className="text-sm text-muted-foreground">Save your business details first to set a map location.</p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="location-address">Business address</Label>
        <div className="flex gap-2">
          <Input
            id="location-address"
            placeholder="Bole Road, Addis Ababa"
            disabled={disabled}
            aria-invalid={!!errors.businessAddress}
            {...register("businessAddress")}
          />
          <Button type="button" variant="outline" onClick={handleFindOnMap} disabled={disabled || isLocating}>
            {isLocating ? <Spinner /> : <Search className="size-4" />}
            Find on map
          </Button>
        </div>
        <FieldError message={errors.businessAddress?.message} />
      </div>

      <div className="rounded-[14px] border border-yegna-border bg-yegna-background overflow-hidden aspect-video">
        {mapSrc ? (
          <iframe
            title="Business location preview"
            src={mapSrc}
            className="h-full w-full border-0"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            Search an address to preview it on the map
          </div>
        )}
      </div>

      {hasCoordinates && (
        <p className="text-xs text-muted-foreground">
          Coordinates: {latitude!.toFixed(5)}, {longitude!.toFixed(5)}
        </p>
      )}

      <Button type="submit" disabled={disabled || isSaving || !isDirty}>
        {isSaving && <Spinner />}
        {isSaving ? "Saving..." : "Save location"}
      </Button>
    </form>
  );
}