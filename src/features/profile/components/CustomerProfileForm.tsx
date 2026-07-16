"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { profileSchema, type ProfileFormValues } from "../schemas/profile.schema";
import { useUpdateProfile } from "../hooks/useCustomerProfile";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, FormError, Spinner } from "@/components/shared/form-feedback";
import type { CustomerProfile } from "../types/profile.types";

interface CustomerProfileFormProps {
  profile: CustomerProfile;
}

/**
 * Name/email/phone live on `User` (features/auth), not on `CustomerProfile`
 * — see profile.schema.ts's docblock — and there's no confirmed endpoint
 * yet for editing them, so they're shown here read-only from the auth
 * store rather than as editable fields. Only dateOfBirth/bio/
 * preferredLanguage are actually submitted.
 */
export function CustomerProfileForm({ profile }: CustomerProfileFormProps) {
  const { updateProfile, isSaving, error } = useUpdateProfile();
  const authUser = useAuthStore((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      dateOfBirth: profile.dateOfBirth ?? "",
      bio: profile.bio ?? "",
      preferredLanguage: (profile.preferredLanguage as "en" | "am") ?? "en",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile({
      dateOfBirth: data.dateOfBirth || null,
      bio: data.bio || null,
      preferredLanguage: data.preferredLanguage,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormError message={error} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" value={authUser?.firstName ?? ""} disabled readOnly />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" value={authUser?.lastName ?? ""} disabled readOnly />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={authUser?.email ?? ""} disabled readOnly />
        <p className="text-xs text-muted-foreground">
          Contact support to change your name or email.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dateOfBirth">Date of birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          aria-invalid={!!errors.dateOfBirth}
          {...register("dateOfBirth")}
        />
        <FieldError message={errors.dateOfBirth?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          rows={3}
          placeholder="Tell us a little about yourself"
          aria-invalid={!!errors.bio}
          className="flex w-full rounded-[14px] border border-yegna-border bg-yegna-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-yegna-primary aria-invalid:border-destructive aria-invalid:ring-destructive/20"
          {...register("bio")}
        />
        <FieldError message={errors.bio?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="preferredLanguage">Preferred language</Label>
        <select
          id="preferredLanguage"
          className="flex h-11 w-full rounded-[14px] border border-yegna-border bg-yegna-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-yegna-primary"
          {...register("preferredLanguage")}
        >
          <option value="en">English</option>
          <option value="am">አማርኛ (Amharic)</option>
        </select>
        <FieldError message={errors.preferredLanguage?.message} />
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving && <Spinner />}
        {isSaving ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
