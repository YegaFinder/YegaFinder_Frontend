"use client";

import { useMerchantProfile } from "@/features/profile/hooks/useMerchantProfile";
import { BusinessDetailsForm } from "@/features/profile/components/BusinessDetailsForm";
import { ContactInfoForm } from "@/features/profile/components/ContactInfoForm";
import { BusinessHoursEditor } from "@/features/profile/components/BusinessHoursEditor";
import {
  toBusinessHoursPayload,
  type BusinessDetailsFormValues,
  type ContactInfoFormValues,
  type BusinessHoursFormValues,
} from "@/features/profile/schemas/merchant-profile.schema";
import { Button } from "@/components/ui/button";
import { FormError, Spinner } from "@/components/shared/form-feedback";

export default function MerchantProfilePage() {
  const {
    profile,
    isLoading,
    isError,
    profileNotCreatedYet,
    refetch,
    createProfile,
    isCreating,
    updateProfile,
    isUpdating,
    updateBusinessHours,
    isUpdatingHours,
  } = useMerchantProfile();

  async function handleSaveDetails(values: BusinessDetailsFormValues) {
    try {
      if (profileNotCreatedYet) {
        await createProfile(values);
      } else {
        await updateProfile(values);
      }
    } catch {
      // Error toast already shown by the mutation's onError handler.
    }
  }

  async function handleSaveContact(values: ContactInfoFormValues) {
    try {
      await updateProfile({
        // contactEmail is @IsEmail() even though optional — "" fails
        // that check, so an empty field must be sent as undefined.
        contactEmail: values.contactEmail || undefined,
        contactPhone: values.contactPhone,
        businessAddress: values.businessAddress,
        websiteUrl: values.websiteUrl,
      });
    } catch {
      // Error toast already shown by the mutation's onError handler.
    }
  }

  async function handleSaveHours(values: BusinessHoursFormValues) {
    try {
      await updateBusinessHours({ businessHours: toBusinessHoursPayload(values.businessHours) });
    } catch {
      // Error toast already shown by the mutation's onError handler.
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Spinner className="size-5" />
        Loading your business profile...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-16 text-center">
        <FormError message="We couldn't load your business profile." />
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Business profile</h1>
        <p className="text-sm text-muted-foreground">
          This is what customers will see once discovery goes live.
        </p>
      </div>

      {profileNotCreatedYet && (
        <div className="rounded-[10px] border border-yegna-primary/30 bg-yegna-primary/5 px-4 py-2.5 text-sm text-yegna-primary">
          You haven&apos;t set up your business profile yet — fill in your business details below to get started.
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Business details</h2>
        <BusinessDetailsForm profile={profile} onSubmit={handleSaveDetails} isSaving={isCreating || isUpdating} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Contact information</h2>
        <ContactInfoForm
          profile={profile}
          onSubmit={handleSaveContact}
          isSaving={isUpdating}
          disabled={profileNotCreatedYet}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Operating hours</h2>
        <BusinessHoursEditor
          businessHours={profile?.businessHours}
          onSubmit={handleSaveHours}
          isSaving={isUpdatingHours}
          disabled={profileNotCreatedYet}
        />
      </section>
    </div>
  );
}