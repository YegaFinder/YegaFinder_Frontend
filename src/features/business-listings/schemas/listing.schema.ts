import { z } from "zod";
import type { CreateListingRequest } from "../types/business-listing.types";

export const listingSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Keep it under 120 characters"),
  description: z.string().max(2000, "Keep it under 2000 characters").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Choose a category"),
  subcategoryId: z.string().optional().or(z.literal("")),
});
export type ListingFormValues = z.infer<typeof listingSchema>;

/**
 * Converts form values to the wire payload — empty-string subcategoryId
 * becomes `undefined` rather than `""`, same reasoning as
 * toBusinessHoursPayload in the profile feature (an empty string is not
 * the same as "field omitted" to the backend's validation).
 */
export function toCreateListingPayload(values: ListingFormValues): CreateListingRequest {
  return {
    title: values.title,
    description: values.description || undefined,
    categoryId: values.categoryId,
    subcategoryId: values.subcategoryId || undefined,
  };
}