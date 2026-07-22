"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError, Spinner } from "@/components/shared/form-feedback";
import { ImageUploadField } from "@/components/shared/image-upload-field";

import { businessDetailsSchema, type BusinessDetailsFormValues } from "../schemas/merchant-profile.schema";
import type { MerchantProfile } from "../types/profile.types";

interface BusinessDetailsFormProps {
  profile?: MerchantProfile;
  onSubmit: (values: BusinessDetailsFormValues) => void | Promise<void>;
  isSaving: boolean;
}

export function BusinessDetailsForm({ profile, onSubmit, isSaving }: BusinessDetailsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<BusinessDetailsFormValues>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      businessName: profile?.businessName ?? "",
      description: profile?.description ?? "",
      businessCategories: profile?.businessCategories ?? [],
      logoUrl: profile?.logoUrl ?? "",
      bannerUrl: profile?.bannerUrl ?? "",
    },
  });

  // Profile arrives asynchronously after mount — resync once it (or a
  // fresh save) lands, so fields don't stay stuck on empty defaults.
  useEffect(() => {
    if (!profile) return;
    reset({
      businessName: profile.businessName ?? "",
      description: profile.description ?? "",
      businessCategories: profile.businessCategories ?? [],
      logoUrl: profile.logoUrl ?? "",
      bannerUrl: profile.bannerUrl ?? "",
    });
  }, [profile, reset]);

  const [categoryDraft, setCategoryDraft] = useState("");
  const categories = watch("businessCategories") ?? [];

  function addCategory() {
    const value = categoryDraft.trim();
    if (!value || categories.includes(value)) {
      setCategoryDraft("");
      return;
    }
    setValue("businessCategories", [...categories, value], { shouldDirty: true });
    setCategoryDraft("");
  }

  function removeCategory(value: string) {
    setValue(
      "businessCategories",
      categories.filter((c) => c !== value),
      { shouldDirty: true },
    );
  }

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Controller
          control={control}
          name="logoUrl"
          render={({ field }) => (
            <ImageUploadField
              label="Business logo"
              uploadType="logo"
              aspectRatio="square"
              value={field.value}
              onUploadSuccess={(url) => field.onChange(url)}
              onRemove={() => field.onChange("")}
            />
          )}
        />
        <Controller
          control={control}
          name="bannerUrl"
          render={({ field }) => (
            <ImageUploadField
              label="Business banner"
              uploadType="banner"
              aspectRatio="video"
              value={field.value}
              onUploadSuccess={(url) => field.onChange(url)}
              onRemove={() => field.onChange("")}
            />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="businessName">Business name</Label>
        <Input
          id="businessName"
          placeholder="e.g. Blue Nile Coffee House"
          aria-invalid={!!errors.businessName}
          {...register("businessName")}
        />
        <FieldError message={errors.businessName?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Tell customers what makes your business worth visiting."
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category-draft">Business categories</Label>
        <div className="flex gap-2">
          <Input
            id="category-draft"
            placeholder="e.g. Restaurant"
            value={categoryDraft}
            onChange={(e) => setCategoryDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCategory();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addCategory}>
            Add
          </Button>
        </div>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => removeCategory(cat)}
                  aria-label={`Remove ${cat}`}
                  className="hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={isSaving || !isDirty}>
        {isSaving && <Spinner />}
        {isSaving ? "Saving..." : "Save business details"}
      </Button>
    </form>
  );
}