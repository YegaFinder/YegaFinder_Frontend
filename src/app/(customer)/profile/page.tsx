"use client";

import { useCustomerProfile } from "@/features/profile/hooks/useCustomerProfile";
import { CustomerProfileForm } from "@/features/profile/components/CustomerProfileForm";
import { ProfileAvatar } from "@/features/profile/components/ProfileAvatar";
import { ProfileCompletionBar } from "@/features/profile/components/ProfileCompletionBar";
import { NotificationPreferences } from "@/features/profile/components/NotificationPreferences";
import { Spinner } from "@/components/shared/form-feedback";

export default function ProfilePage() {
  const { profile, isLoading, error, refetch } = useCustomerProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner className="size-6 text-yegna-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-8 text-center">
        <p className="text-sm text-destructive">
          {error ?? "We couldn't load your profile. Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 sm:p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal details, photo, and notification preferences.
        </p>
      </div>

      <ProfileCompletionBar isComplete={profile.isProfileComplete} />

      <section className="space-y-4 rounded-[16px] border border-yegna-border bg-background p-5">
        <h2 className="text-sm font-semibold text-foreground">Photo</h2>
        <ProfileAvatar profile={profile} onProfileUpdated={refetch} />
      </section>

      <section className="space-y-4 rounded-[16px] border border-yegna-border bg-background p-5">
        <h2 className="text-sm font-semibold text-foreground">Personal details</h2>
        <CustomerProfileForm profile={profile} />
      </section>

      <section className="space-y-4 rounded-[16px] border border-yegna-border bg-background p-5">
        <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
        <NotificationPreferences preferences={profile.notificationPreferences} />
      </section>

      <section className="space-y-2 rounded-[16px] border border-yegna-border bg-background p-5">
        <h2 className="text-sm font-semibold text-foreground">Loyalty points</h2>
        <p className="text-3xl font-semibold text-yegna-primary">{profile.loyaltyPoints}</p>
        <p className="text-xs text-muted-foreground">
          Earn points on completed bookings and redeem them for discounts.
        </p>
      </section>
    </div>
  );
}