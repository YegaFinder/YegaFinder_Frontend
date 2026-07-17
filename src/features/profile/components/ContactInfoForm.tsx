"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, Spinner } from "@/components/shared/form-feedback";

import { contactInfoSchema, type ContactInfoFormValues } from "../schemas/merchant-profile.schema";
import type { MerchantProfile } from "../types/profile.types";

interface ContactInfoFormProps {
  profile?: MerchantProfile;
  onSubmit: (values: ContactInfoFormValues) => void | Promise<void>;
  isSaving: boolean;
  disabled?: boolean;
}

export function ContactInfoForm({ profile, onSubmit, isSaving, disabled }: ContactInfoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      contactEmail: profile?.contactEmail ?? "",
      contactPhone: profile?.contactPhone ?? "",
      businessAddress: profile?.businessAddress ?? "",
      websiteUrl: profile?.websiteUrl ?? "",
    },
  });

 useEffect(() => {
  if (!profile || isDirty) return;
  reset({
    contactEmail: profile.contactEmail ?? "",
    contactPhone: profile.contactPhone ?? "",
    businessAddress: profile.businessAddress ?? "",
    websiteUrl: profile.websiteUrl ?? "",
  });
}, [profile, reset, isDirty]);

  return (
            <form
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values);
            reset(values);
          })}
          className="space-y-5"
          noValidate
        >
      {disabled && (
        <p className="text-sm text-muted-foreground">
          Save your business details first — contact info can be added once your profile exists.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contactEmail">Contact email</Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="hello@business.com"
            disabled={disabled}
            aria-invalid={!!errors.contactEmail}
            {...register("contactEmail")}
          />
          <FieldError message={errors.contactEmail?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contactPhone">Contact phone</Label>
          <Input
            id="contactPhone"
            type="tel"
            placeholder="+251 9XX XXX XXX"
            disabled={disabled}
            aria-invalid={!!errors.contactPhone}
            {...register("contactPhone")}
          />
          <FieldError message={errors.contactPhone?.message} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="businessAddress">Business address</Label>
        <Input
          id="businessAddress"
          placeholder="Bole Road, Addis Ababa"
          disabled={disabled}
          aria-invalid={!!errors.businessAddress}
          {...register("businessAddress")}
        />
        <FieldError message={errors.businessAddress?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="websiteUrl">Website</Label>
        <Input
          id="websiteUrl"
          type="url"
          placeholder="https://yourbusiness.com"
          disabled={disabled}
          aria-invalid={!!errors.websiteUrl}
          {...register("websiteUrl")}
        />
        <FieldError message={errors.websiteUrl?.message} />
      </div>

      <Button type="submit" disabled={disabled || isSaving || !isDirty}>
        {isSaving && <Spinner />}
        {isSaving ? "Saving..." : "Save contact info"}
      </Button>
    </form>
  );
}