import type { BusinessListing } from "@/types/business.types";

/**
 * A merchant sees their own listing in exactly the same shape the public
 * will once it's approved — no separate "merchant view" type needed.
 */
export type MerchantListing = BusinessListing;

export interface CreateListingRequest {
  title: string;
  description?: string;
  categoryId: string;
  subcategoryId?: string;
}

/** Every field optional — PUT only sends what changed. */
export type UpdateListingRequest = Partial<CreateListingRequest>;

export interface MyListingsQuery {
  page?: number;
  pageSize?: number;
}