"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError, Spinner } from "@/components/shared/form-feedback";
import { useCategories } from "@/features/business-discovery/api/hooks/useCategories";

import { merchantProfileApi } from "../api/merchant-profile.api";
import { MERCHANT_PROFILE_QUERY_KEY } from "../hooks/useMerchantProfile";
import { businessDetailsSchema, type BusinessDetailsFormValues } from "../schemas/merchant-profile.schema";
import type { MerchantProfile } from "../types/profile.types";

interface BusinessDetailsFormProps {
  profile?: MerchantProfile;
  onSubmit: (values: BusinessDetailsFormValues) => void | Promise<void>;
  isSaving: boolean;
}

/**
 * Logo/banner are NOT part of BusinessDetailsFormValues / PUT
 * /merchant/profile anymore (see the FIXED note on UpdateMerchantProfileRequest
 * in profile.types.ts — the backend DTO has no logoUrl/bannerUrl field, and
 * forbidNonWhitelisted:true 400s the whole save if you send it). Each field
 * uploads straight to its dedicated endpoint (POST /merchant/logo or
 * POST /merchant/banner) the moment a file is picked, and writes the
 * resulting profile straight into the shared react-query cache so the rest
 * of the page (header banner/logo, this field's preview) updates instantly
 * — completely independent of the "Save business details" button below.
 */
function MerchantImageUploadField({
  label,
  kind,
  currentUrl,
  aspectRatio,
}: {
  label: string;
  kind: "logo" | "banner";
  currentUrl?: string;
  aspectRatio: "square" | "video";
}) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputId = `merchant-${kind}-upload`;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const mutation = useMutation({
    mutationFn: (file: File) => (kind === "logo" ? merchantProfileApi.uploadLogo(file) : merchantProfileApi.uploadBanner(file)),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(MERCHANT_PROFILE_QUERY_KEY, updatedProfile);
      toast.success(`${label} uploaded successfully!`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : `Failed to upload ${label.toLowerCase()}. Please try again.`);
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Max size is 10MB.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Unsupported file type. Allowed: image/jpeg, image/png, image/webp");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return localPreview;
    });

    mutation.mutate(file);
  }

  const displaySrc = preview ?? currentUrl ?? null;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <div
        className={`relative flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20 ${
          aspectRatio === "square" ? "aspect-square w-32" : "aspect-video w-full"
        }`}
      >
        {displaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displaySrc} alt={`${label} preview`} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="text-center p-4">
            <span className="text-sm text-muted-foreground">Click to upload</span>
          </div>
        )}
        <input
          id={inputId}
          type="file"
          ref={fileInputRef}
          accept="image/jpeg, image/png, image/webp"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={mutation.isPending}
          aria-label={label}
        />
      </div>
      {mutation.isPending && <p className="text-xs text-muted-foreground">Uploading…</p>}
    </div>
  );
}

export function BusinessDetailsForm({ profile, onSubmit, isSaving }: BusinessDetailsFormProps) {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const availableCategories = categoriesData?.data ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<BusinessDetailsFormValues>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      businessName: profile?.businessName ?? "",
      description: profile?.description ?? "",
      businessCategories: profile?.businessCategories?.map((c) => c.id) ?? [],
      taxId: profile?.taxId ?? "",
    },
  });

  // Profile arrives asynchronously after mount — resync once it (or a
  // fresh save) lands, so fields don't stay stuck on empty defaults.
  useEffect(() => {
    if (!profile) return;
    reset({
      businessName: profile.businessName ?? "",
      description: profile.description ?? "",
      businessCategories: profile.businessCategories?.map((c) => c.id) ?? [],
      taxId: profile.taxId ?? "",
    });
  }, [profile, reset]);

  const selectedCategoryIds = watch("businessCategories") ?? [];

  function toggleCategory(categoryId: string, checked: boolean) {
    if (checked) {
      setValue("businessCategories", [...selectedCategoryIds, categoryId], { shouldDirty: true });
    } else {
      setValue(
        "businessCategories",
        selectedCategoryIds.filter((id) => id !== categoryId),
        { shouldDirty: true },
      );
    }
  }

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <MerchantImageUploadField label="Business logo" kind="logo" currentUrl={profile?.logoUrl} aspectRatio="square" />
        <MerchantImageUploadField label="Business banner" kind="banner" currentUrl={profile?.bannerUrl} aspectRatio="video" />
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
        <Label>Business categories</Label>
        {categoriesLoading ? (
          <p className="text-sm text-muted-foreground">Loading categories…</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {availableCategories.map((cat) => {
              const checked = selectedCategoryIds.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm has-[:checked]:bg-secondary has-[:checked]:text-secondary-foreground"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => toggleCategory(cat.id, e.target.checked)}
                    className="size-3.5 accent-primary"
                  />
                  {cat.name}
                </label>
              );
            })}
          </div>
        )}
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          Selecting categories doesn&apos;t affect where your listing shows up yet — category browsing is still
          rolling out on our end. Your selections are saved and will start working automatically once it launches.
        </p>
        <FieldError message={errors.businessCategories?.message} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="taxId">Tax Identification Number (optional)</Label>
        </div>
        <Input
          id="taxId"
          placeholder="e.g. TIN-0012345678"
          aria-invalid={!!errors.taxId}
          {...register("taxId")}
        />
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          Used for invoicing and compliance. This is stored on your business profile and is never shown
          publicly to customers.
        </p>
        <FieldError message={errors.taxId?.message} />
      </div>

      <Button type="submit" disabled={isSaving || !isDirty}>
        {isSaving && <Spinner />}
        {isSaving ? "Saving..." : "Save business details"}
      </Button>
    </form>
  );
}
