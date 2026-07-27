"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook, Instagram, Twitter, Music2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, Spinner } from "@/components/shared/form-feedback";

import { businessReachSchema, type BusinessReachFormValues } from "../schemas/merchant-profile.schema";
import type { MerchantProfile } from "../types/profile.types";

interface BusinessReachFormProps {
  profile?: MerchantProfile;
  onSubmit: (values: BusinessReachFormValues) => void | Promise<void>;
  isSaving: boolean;
  disabled?: boolean;
}

export function BusinessReachForm({ profile, onSubmit, isSaving, disabled }: BusinessReachFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<BusinessReachFormValues>({
    resolver: zodResolver(businessReachSchema),
    defaultValues: {
      deliveryRadius: profile?.deliveryRadius,
      serviceAreas: profile?.serviceAreas ?? [],
      socialMedia: {
        facebook: profile?.socialMedia?.facebook ?? "",
        instagram: profile?.socialMedia?.instagram ?? "",
        twitter: profile?.socialMedia?.twitter ?? "",
        tiktok: profile?.socialMedia?.tiktok ?? "",
      },
    },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      deliveryRadius: profile.deliveryRadius,
      serviceAreas: profile.serviceAreas ?? [],
      socialMedia: {
        facebook: profile.socialMedia?.facebook ?? "",
        instagram: profile.socialMedia?.instagram ?? "",
        twitter: profile.socialMedia?.twitter ?? "",
        tiktok: profile.socialMedia?.tiktok ?? "",
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const [areaDraft, setAreaDraft] = useState("");
  const areas = watch("serviceAreas") ?? [];

  function addArea() {
    const value = areaDraft.trim();
    if (!value || areas.includes(value)) {
      setAreaDraft("");
      return;
    }
    setValue("serviceAreas", [...areas, value], { shouldDirty: true });
    setAreaDraft("");
  }

  function removeArea(value: string) {
    setValue(
      "serviceAreas",
      areas.filter((a) => a !== value),
      { shouldDirty: true },
    );
  }

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-6" noValidate>
      {disabled && (
        <p className="text-sm text-muted-foreground">Save your business details first to set this up.</p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="deliveryRadius">Delivery radius (km)</Label>
        <Input
          id="deliveryRadius"
          type="number"
          min={0}
          max={500}
          step="0.5"
          placeholder="e.g. 10"
          disabled={disabled}
          aria-invalid={!!errors.deliveryRadius}
          {...register("deliveryRadius")}
        />
        <FieldError message={errors.deliveryRadius?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="area-draft">Service areas</Label>
        <div className="flex gap-2">
          <Input
            id="area-draft"
            placeholder="e.g. Bole, Kazanchis"
            value={areaDraft}
            disabled={disabled}
            onChange={(e) => setAreaDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addArea();
              }
            }}
          />
          <Button type="button" variant="outline" disabled={disabled} onClick={addArea}>
            Add
          </Button>
        </div>
        {areas.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {areas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {area}
                <button
                  type="button"
                  onClick={() => removeArea(area)}
                  aria-label={`Remove ${area}`}
                  className="hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label>Social media links</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Facebook className="size-4 text-muted-foreground" />
              <Controller
                control={control}
                name="socialMedia.facebook"
                render={({ field }) => (
                  <Input {...field} placeholder="https://facebook.com/yourbusiness" disabled={disabled} />
                )}
              />
            </div>
            <FieldError message={errors.socialMedia?.facebook?.message} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Instagram className="size-4 text-muted-foreground" />
              <Controller
                control={control}
                name="socialMedia.instagram"
                render={({ field }) => (
                  <Input {...field} placeholder="https://instagram.com/yourbusiness" disabled={disabled} />
                )}
              />
            </div>
            <FieldError message={errors.socialMedia?.instagram?.message} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Twitter className="size-4 text-muted-foreground" />
              <Controller
                control={control}
                name="socialMedia.twitter"
                render={({ field }) => (
                  <Input {...field} placeholder="https://x.com/yourbusiness" disabled={disabled} />
                )}
              />
            </div>
            <FieldError message={errors.socialMedia?.twitter?.message} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Music2 className="size-4 text-muted-foreground" />
              <Controller
                control={control}
                name="socialMedia.tiktok"
                render={({ field }) => (
                  <Input {...field} placeholder="https://tiktok.com/@yourbusiness" disabled={disabled} />
                )}
              />
            </div>
            <FieldError message={errors.socialMedia?.tiktok?.message} />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={disabled || isSaving || !isDirty}>
        {isSaving && <Spinner />}
        {isSaving ? "Saving..." : "Save reach settings"}
      </Button>
    </form>
  );
}