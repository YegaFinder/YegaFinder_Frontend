"use client";

import { useMerchantProfile } from "@/features/profile/hooks/useMerchantProfile";
import { useTeamMembers } from "@/features/profile/hooks/useTeamMembers";
import { usePromotions } from "@/features/profile/hooks/usePromotions";

import { BusinessDetailsForm } from "@/features/profile/components/BusinessDetailsForm";
import { ContactInfoForm } from "@/features/profile/components/ContactInfoForm";
import { BusinessHoursEditor } from "@/features/profile/components/BusinessHoursEditor";
import { BusinessLocationForm } from "@/features/profile/components/BusinessLocationForm";
import { BusinessReachForm } from "@/features/profile/components/BusinessReachForm";
import { BusinessComplianceForm } from "@/features/profile/components/BusinessComplianceForm";
import { BusinessGallery } from "@/features/profile/components/BusinessGallery";
import { BusinessVideosForm } from "@/features/profile/components/BusinessVideosForm";
import { TeamMembersManager } from "@/features/profile/components/TeamMembersManager";
import { PromotionsManager } from "@/features/profile/components/PromotionsManager";
import { SubscriptionPlanSection } from "@/features/profile/components/SubscriptionPlanSection";
import { AnalyticsDashboard } from "@/features/profile/components/AnalyticsDashboard";
import { VerificationBadge } from "@/features/profile/components/VerificationBadge";

import {
  toBusinessHoursPayload,
  type BusinessDetailsFormValues,
  type ContactInfoFormValues,
  type BusinessHoursFormValues,
  type BusinessLocationFormValues,
  type BusinessReachFormValues,
} from "@/features/profile/schemas/merchant-profile.schema";

import { Button } from "@/components/ui/button";
import { FormError, Spinner } from "@/components/shared/form-feedback";
import { MapPin, Star } from "lucide-react";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-yegna-border bg-background p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-yegna-navy">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

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

 const { staff } = useTeamMembers({ enabled: !profileNotCreatedYet });
const { promotions } = usePromotions({ enabled: !profileNotCreatedYet });

  async function handleSaveDetails(values: BusinessDetailsFormValues) {
    try {
      if (profileNotCreatedYet) {
        await createProfile(values);
      } else {
        await updateProfile(values);
      }
    } catch {
      /* toast already shown */
    }
  }

  async function handleSaveContact(values: ContactInfoFormValues) {
    if (!profile) return;
    try {
      await updateProfile({
        businessName: profile.businessName, // required on every PUT
        contactEmail: values.contactEmail || undefined,
        contactPhone: values.contactPhone,
        businessAddress: values.businessAddress,
        websiteUrl: values.websiteUrl,
      });
    } catch {
      /* toast already shown */
    }
  }

  async function handleSaveLocation(values: BusinessLocationFormValues) {
    if (!profile) return;
    try {
      await updateProfile({
        businessName: profile.businessName,
        businessAddress: values.businessAddress,
        latitude: values.latitude,
        longitude: values.longitude,
      });
    } catch {
      /* toast already shown */
    }
  }

async function handleSaveReach(values: BusinessReachFormValues) {
  if (!profile) return;
  const cleanedSocial = Object.fromEntries(
    Object.entries(values.socialMedia ?? {}).filter(([, v]) => !!v),
  );
  try {
    await updateProfile({
      businessName: profile.businessName,
      deliveryRadius: values.deliveryRadius,
      serviceAreas: values.serviceAreas,
      socialMedia: Object.keys(cleanedSocial).length > 0 ? cleanedSocial : undefined,
    });
  } catch {
    /* toast already shown */
  }
}

  async function handleSaveHours(values: BusinessHoursFormValues) {
    try {
      await updateBusinessHours({ businessHours: toBusinessHoursPayload(values.businessHours) });
    } catch {
      /* toast already shown */
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
    <div className="space-y-8">
      {/* ---- Header: banner + logo + name + verification badge ---- */}
      <div className="overflow-hidden rounded-[24px] border border-yegna-border bg-background shadow-sm">
        <div
          className="h-32 w-full bg-gradient-to-br from-yegna-primary to-yegna-secondary sm:h-44"
          style={profile?.bannerUrl ? { backgroundImage: `url(${profile.bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        />
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:gap-5">
          <div className="-mt-10 size-20 shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-md sm:-mt-12 sm:size-24">
            {profile?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.logoUrl} alt="Business logo" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
                {profile?.businessName?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>
          <div className="flex-1 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-yegna-navy">{profile?.businessName || "Your business"}</h1>
              {profile && <VerificationBadge status={profile.verificationStatus} />}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {profile?.businessAddress && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> {profile.businessAddress}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star className="size-3.5 fill-amber-400 Number(profile?.averageRating ?? 0).toFixed(1)}text-amber-400" />
                 {Number(profile?.averageRating ?? 0).toFixed(1)} ({profile?.totalReviews ?? 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {profileNotCreatedYet && (
        <div className="rounded-[10px] border border-yegna-primary/30 bg-yegna-primary/5 px-4 py-2.5 text-sm text-yegna-primary">
          You haven&apos;t set up your business profile yet — fill in your business details below to get started.
        </div>
      )}

      <SectionCard title="Analytics" description="A snapshot of how complete and active your profile is.">
        <AnalyticsDashboard profile={profile} staffCount={staff.length} activePromotionsCount={promotions.filter((p) => p.isActive).length} />
      </SectionCard>

      <SectionCard title="Business details" description="Name, description, logo, banner, and categories.">
        <BusinessDetailsForm profile={profile} onSubmit={handleSaveDetails} isSaving={isCreating || isUpdating} />
      </SectionCard>

      <SectionCard title="Contact information">
        <ContactInfoForm profile={profile} onSubmit={handleSaveContact} isSaving={isUpdating} disabled={profileNotCreatedYet} />
      </SectionCard>

      <SectionCard title="Map location" description="Help customers find you on the map.">
        <BusinessLocationForm profile={profile} onSubmit={handleSaveLocation} isSaving={isUpdating} disabled={profileNotCreatedYet} />
      </SectionCard>

      <SectionCard title="Reach" description="Delivery radius, service areas, and social media.">
        <BusinessReachForm profile={profile} onSubmit={handleSaveReach} isSaving={isUpdating} disabled={profileNotCreatedYet} />
      </SectionCard>

      <SectionCard title="Operating hours">
        <BusinessHoursEditor businessHours={profile?.businessHours} onSubmit={handleSaveHours} isSaving={isUpdatingHours} disabled={profileNotCreatedYet} />
      </SectionCard>

      <SectionCard title="Compliance" description="Tax ID and business license verification.">
        <BusinessComplianceForm />
      </SectionCard>

      <SectionCard title="Business gallery" description="Show off your business with photos.">
        <BusinessGallery />
      </SectionCard>

      <SectionCard title="Videos & reels" description="Link out to videos you've posted elsewhere.">
        <BusinessVideosForm />
      </SectionCard>

      <SectionCard title="Team members" description="Manage staff labels on your business.">
        <TeamMembersManager />
      </SectionCard>

      <SectionCard title="Promotions & coupons">
        <PromotionsManager />
      </SectionCard>

      <SectionCard title="Subscription plan">
        <SubscriptionPlanSection />
      </SectionCard>
    </div>
  );
}