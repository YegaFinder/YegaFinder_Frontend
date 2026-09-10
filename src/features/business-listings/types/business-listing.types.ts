import type { Category } from "@/types/business.types";

/** Mirrors the backend's approval workflow (Sprint 3: admin must approve before a listing goes public). */
export type BusinessListingStatus = "pending" | "approved" | "rejected";

/**
 * UNCONFIRMED: assumes /merchant/listings/:id/gallery returns objects with
 * an id (needed to delete a specific photo). The public BusinessDetail.gallery
 * is just string[] — if the merchant-only gallery endpoint turns out to be
 * the same flat string[], useListingGallery/ListingGalleryUploader need to
 * switch from delete-by-id to delete-by-url. Confirm with backend.
 */
export interface BusinessListingGalleryPhoto {
  id: string;
  url: string;
  createdAt: string;
}

/**
 * Merchant-only view of a listing — returned by /merchant/listings*.
 * Deliberately NOT aliased to BusinessListItem/BusinessDetail (the public
 * discovery shapes in @/types/business.types): those don't carry approval
 * status, and their category/gallery shapes differ from what merchant
 * management needs. `category` is the one primary category; `subcategories`
 * are that category's children, fetched via categoriesApi.getSubcategories
 * once a primary category is picked (see ListingForm).
 */
export interface MerchantListing {
  id: string;
  title: string;
  description?: string;
  category: Category;
  subcategories: Category[];
  gallery: BusinessListingGalleryPhoto[];
  status: BusinessListingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingRequest {
  title: string;
  description?: string;
  categoryId: string;
  subcategoryIds?: string[];
}

/** Every field optional — PUT only sends what changed. */
export type UpdateListingRequest = Partial<CreateListingRequest>;

export interface MyListingsQuery {
  page?: number;
  pageSize?: number;
}