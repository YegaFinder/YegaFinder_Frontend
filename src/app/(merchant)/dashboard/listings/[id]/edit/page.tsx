"use client";

import { useParams } from "next/navigation";

import { ListingForm } from "@/features/business-listings/components/ListingForm";
import { ListingGalleryUploader } from "@/features/business-listings/components/ListingGalleryUploader";
import { useBusinessListing } from "@/features/business-listings/hooks/useBusinessListing";
import { toCreateListingPayload, type ListingFormValues } from "@/features/business-listings/schemas/listing.schema";
import { Spinner } from "@/components/shared/form-feedback";

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const { listing, isLoading, updateListing, isUpdating } = useBusinessListing(id);

  async function handleSubmit(values: ListingFormValues) {
    try {
      await updateListing(toCreateListingPayload(values));
    } catch {
      /* toast already shown */
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Spinner className="size-5" /> Loading listing...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-xl font-semibold text-yegna-navy">Edit listing</h1>

      <section className="rounded-[20px] border border-yegna-border bg-background p-6 shadow-sm">
        <ListingForm listing={listing} onSubmit={handleSubmit} isSaving={isUpdating} />
      </section>

      <section className="rounded-[20px] border border-yegna-border bg-background p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-yegna-navy">Photos</h2>
        {id && <ListingGalleryUploader listingId={id} />}
      </section>
    </div>
  );
}