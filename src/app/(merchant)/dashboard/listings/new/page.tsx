"use client";

import { useRouter } from "next/navigation";

import { ListingForm } from "@/features/business-listings/components/ListingForm";
import { useBusinessListing } from "@/features/business-listings/hooks/useBusinessListing";
import { toCreateListingPayload, type ListingFormValues } from "@/features/business-listings/schemas/listing.schema";
import { ROUTES } from "@/constants/routes";

export default function NewListingPage() {
  const router = useRouter();
  const { createListing, isCreating } = useBusinessListing();

  async function handleSubmit(values: ListingFormValues) {
    try {
      const listing = await createListing(toCreateListingPayload(values));
      router.push(`${ROUTES.MERCHANT_LISTINGS}/${listing.id}/edit`);
    } catch {
      /* toast already shown */
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-yegna-navy">New listing</h1>
      <ListingForm onSubmit={handleSubmit} isSaving={isCreating} />
    </div>
  );
}