"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/auth-store";
import { FormError, Spinner } from "@/components/shared/form-feedback";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfile } from "../hooks/useCustomerProfile";
import { profileSchema, type ProfileFormValues } from "../schemas/profile.schema";
import type { CustomerProfile } from "../types/profile.types";

interface CustomerProfileFormProps {
  profile: CustomerProfile;
}

export function CustomerProfileForm({ profile }: CustomerProfileFormProps) {
  const authUser = useAuthStore((state) => state.user);
  const { updateProfile, isSaving, error } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      dateOfBirth: profile.dateOfBirth || "",
      bio: profile.bio || "",
      preferredLanguage: profile.preferredLanguage || "en",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    // The backend's dateOfBirth is @IsOptional() @IsDateString() —
    // @IsOptional() only skips validation for `undefined`, not "". Left
    // untouched, this field defaults to "" (see defaultValues above),
    // which @IsDateString() then rejects as an invalid date -> 400 on
    // every save where the user didn't set a birth date. Omit it (and
    // any other empty-string field) entirely instead of sending "".
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== ""),
    ) as ProfileFormValues;

    await updateProfile(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Read-only fields from auth store */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Full name</label>
          <p className="text-sm text-foreground">
            {authUser?.firstName} {authUser?.lastName}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Email</label>
          <p className="text-sm text-foreground">{authUser?.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Phone</label>
          <p className="text-sm text-foreground">{authUser?.phone || "—"}</p>
        </div>
      </div>

      {/* Editable fields */}
      <div>
        <label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground">
          Date of birth
        </label>
        <input
          id="dateOfBirth"
          type="date"
          className="mt-1 w-full rounded-md border border-yegna-border bg-background px-3 py-2 text-sm"
          {...register("dateOfBirth")}
        />
        {errors.dateOfBirth && <FormError message={errors.dateOfBirth.message} />}
      </div>

      <div>
        <label htmlFor="bio" className="text-sm font-medium text-foreground">
          Bio
        </label>
        <Textarea
          id="bio"
          rows={3}
          className="mt-1"
          {...register("bio")}
        />
        {errors.bio && <FormError message={errors.bio.message} />}
      </div>

      <div>
        <label htmlFor="preferredLanguage" className="text-sm font-medium text-foreground">
          Preferred language
        </label>
        <select
          id="preferredLanguage"
          className="mt-1 w-full rounded-md border border-yegna-border bg-background px-3 py-2 text-sm"
          {...register("preferredLanguage")}
        >
          <option value="en">English</option>
          <option value="am">አማርኛ</option>
        </select>
        {errors.preferredLanguage && <FormError message={errors.preferredLanguage.message} />}
      </div>

      {error && <FormError message={error} />}

      <button
        type="submit"
        disabled={isSaving || !isDirty}
        className="inline-flex items-center rounded-md bg-yegna-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yegna-primary/90 disabled:opacity-50"
      >
        {isSaving ? <Spinner className="mr-2 size-4" /> : null}
        Save changes
      </button>
    </form>
  );
}