"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError, Spinner } from "@/components/shared/form-feedback";
import { useCategories } from "@/features/business-discovery/api/hooks/useCategories";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/business.types";

import { useSubcategories } from "../hooks/useSubcategories";
import { normalizeCategoriesResponse } from "../utils/normalize-categories";
import { listingSchema, type ListingFormValues } from "../schemas/listing.schema";
import type { MerchantListing } from "../types/business-listing.types";

interface ListingFormProps {
  /** Omitted on the "new listing" screen; passed on the edit screen. */
  listing?: MerchantListing;
  onSubmit: (values: ListingFormValues) => void | Promise<void>;
  isSaving: boolean;
}

/**
 * Merges the live category list with whatever category/subcategories are
 * already saved on the listing being edited.
 *
 * WHY: without this, if a category gets renamed or deleted on the backend
 * while a merchant has it open in the edit form, it silently disappears
 * from the dropdown the instant the live list refetches — the merchant
 * sees an empty selection with no explanation. Merging the saved value
 * back in keeps it visible (still clearly assigned to this listing) even
 * once it's no longer offered as a choice for new listings.
 */
function withSavedFallback(liveList: Category[], saved: Category | Category[] | null | undefined): Category[] {
  const savedList = Array.isArray(saved) ? saved : saved ? [saved] : [];
  const missingFromLiveList = savedList.filter((s) => !liveList.some((c) => c.id === s.id));
  return [...liveList, ...missingFromLiveList];
}

export function ListingForm({ listing, onSubmit, isSaving }: ListingFormProps) {
  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const liveCategories = normalizeCategoriesResponse(categoriesResponse);
  // useMemo: this list is rebuilt on every render otherwise, which would
  // change reference identity and make React treat the <select>'s options
  // as "new" each time — memoizing keeps it stable across re-renders that
  // don't actually change the underlying data.
  const categories = useMemo(
    () => withSavedFallback(liveCategories, listing?.category),
    [liveCategories, listing?.category],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: listing?.title ?? "",
      description: listing?.description ?? "",
      categoryId: listing?.category?.id ?? "",
      subcategoryIds: listing?.subcategories?.map((s) => s.id) ?? [],
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
      subcategoryIds: listing.subcategories?.map((s) => s.id) ?? [],
    });
  }, [listing, reset]);

  const selectedCategoryId = watch("categoryId");
  const selectedSubcategoryIds = watch("subcategoryIds");

  const {
    subcategories: liveSubcategories,
    isLoading: subcategoriesLoading,
    isError: subcategoriesError,
  } = useSubcategories(selectedCategoryId || undefined);

  // Same fallback reasoning as `categories` above, but scoped: only
  // relevant while we're still looking at the category the listing was
  // originally saved under. If the merchant switches to a different
  // category, there's nothing saved under that one to preserve, and
  // showing the old listing's subcategories there would be actively wrong.
  const subcategories = useMemo(() => {
    if (listing?.category?.id !== selectedCategoryId) return liveSubcategories;
    return withSavedFallback(liveSubcategories, listing?.subcategories);
  }, [liveSubcategories, listing, selectedCategoryId]);

  function toggleSubcategory(id: string) {
    const next = selectedSubcategoryIds.includes(id)
      ? selectedSubcategoryIds.filter((s) => s !== id)
      : [...selectedSubcategoryIds, id];
    setValue("subcategoryIds", next, { shouldDirty: true });
  }

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

      <div className="space-y-1.5">
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          aria-invalid={!!errors.categoryId}
          disabled={categoriesLoading}
          className="h-10 w-full rounded-[14px] border border-yegna-border bg-background px-3 text-sm disabled:opacity-50"
          {...register("categoryId", {
            // Changing the primary category invalidates whichever
            // subcategories were picked under the old one — they belong
            // to a category that's no longer selected.
            onChange: () => setValue("subcategoryIds", [], { shouldDirty: true }),
          })}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.categoryId?.message} />
        {categoriesError && (
          <p className="text-xs text-destructive">
            Couldn&apos;t refresh the category list — showing the last known categories.
          </p>
        )}
      </div>

      {selectedCategoryId && (
        <div className="space-y-1.5">
          <Label>Subcategories (optional)</Label>
          {subcategoriesLoading ? (
            <p className="text-sm text-muted-foreground">Loading subcategories...</p>
          ) : subcategoriesError ? (
            <p className="text-sm text-destructive">Couldn&apos;t load subcategories. Try again shortly.</p>
          ) : subcategories.length === 0 ? (
            <p className="text-sm text-muted-foreground">This category has no subcategories.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => {
                const active = selectedSubcategoryIds.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => toggleSubcategory(sub.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "border-yegna-primary bg-yegna-primary text-white"
                        : "border-yegna-border bg-background text-muted-foreground hover:border-yegna-primary/40",
                    )}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <Button type="submit" disabled={isSaving || !isDirty}>
        {isSaving && <Spinner />}
        {isSaving ? "Saving..." : listing ? "Save changes" : "Create listing"}
      </Button>
    </form>
  );
}