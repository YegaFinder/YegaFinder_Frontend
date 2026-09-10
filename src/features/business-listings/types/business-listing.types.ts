import type { BusinessListing } from "@/types/business.types";

export type MerchantListing = BusinessListing;

export interface CreateListingRequest {
  name: string;              // was: title
  description?: string;
  categoryId: string;
  subcategoryId?: string;
}

export type UpdateListingRequest = Partial<CreateListingRequest>;

export interface MyListingsQuery {
  page?: number;
  pageSize?: number;
}