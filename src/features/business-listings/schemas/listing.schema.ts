import { z } from "zod";
import type { CreateListingRequest } from "../types/business-listing.types";

export const listingSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Keep it under 120 characters"),
  description: z.string().max(2000, "Keep it under 2000 characters").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Choose a category"),
  subcategoryId: z.string().optional().or(z.literal("")),
});
export type ListingFormValues = z.infer<typeof listingSchema>;

export function toCreateListingPayload(values: ListingFormValues): CreateListingRequest {
  return {
    name: values.name,
    description: values.description || undefined,
    categoryId: values.categoryId,
    subcategoryId: values.subcategoryId || undefined,
  };
}