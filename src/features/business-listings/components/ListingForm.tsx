"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError, Spinner } from "@/components/shared/form-feedback";
import { useCategories } from "@/lib/hooks/useCategories";

import { listingSchema, type ListingFormValues } from "../schemas/listing.schema";
import type { MerchantListing } from "../types/business-listing.types";

interface ListingFormProps {
  /** Omitted on the "new listing" screen; passed on the edit screen. */
  listing?: MerchantListing;
  onSubmit: (values: ListingFormValues) => void | Promise<void>;
  isSaving: boolean;
}

export function ListingForm({ listing, onSubmit, isSaving }: ListingFormProps) {
  const { topLevel, subcategoriesOf, isLoading: categoriesLoading } = useCategories();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: listing?.title ?? "",
      description: listing?.description ?? "",
      categoryId: listing?.category?.id ?? "",
      subcategoryId: listing?.subcategory?.id ?? "",
    },
  });

  // The listing arrives asynchronously on the edit screen — resync once
  // it (or a fresh save) lands, same pattern as BusinessDetailsForm.
  useEffect(() => {
    if (!listing) return;
    reset({
      title: listing.title ?? "",
      description: listing.description ?? "",
      categoryId: listing.category?.id ?? "",
      subcategoryId: listing.subcategory?.id ?? "",
    });
  }, [listing, reset]);

  const selectedCategoryId = watch("categoryId");
  const subcategories = selectedCategoryId ? subcategoriesOf(selectedCategoryId) : [];

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-6" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="title">Listing title</Label>
        <Input
          id="title"
          placeholder="e.g. Weekend Brunch Menu"
          aria-invalid={!!errors.title}
          {...register("title")}
        />
        <FieldError message={errors.title?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="What should customers know about this listing?"
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            aria-invalid={!!errors.categoryId}
            disabled={categoriesLoading}
            className="h-10 w-full rounded-[14px] border border-yegna-border bg-background px-3 text-sm disabled:opacity-50"
            {...register("categoryId")}
          >
            <option value="">Select a category</option>
            {topLevel.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <FieldError message={errors.categoryId?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="subcategoryId">Subcategory (optional)</Label>
          <select
            id="subcategoryId"
            disabled={!selectedCategoryId || subcategories.length === 0}
            className="h-10 w-full rounded-[14px] border border-yegna-border bg-background px-3 text-sm disabled:opacity-50"
            {...register("subcategoryId")}
          >
            <option value="">None</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" disabled={isSaving || !isDirty}>
        {isSaving && <Spinner />}
        {isSaving ? "Saving..." : listing ? "Save changes" : "Create listing"}
      </Button>
    </form>
  );
}