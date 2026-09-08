import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type { PaginatedResponse } from "@/types/api.types";
import type { BusinessListingGalleryPhoto } from "@/types/business.types";
import type {
  MerchantListing,
  CreateListingRequest,
  UpdateListingRequest,
  MyListingsQuery,
} from "../types/business-listing.types";

export const businessListingsApi = {
  /** Backend: GET /merchant/listings?page=&pageSize= — only this merchant's own listings. */
  getMyListings: async (query: MyListingsQuery = {}): Promise<PaginatedResponse<MerchantListing>> => {
    const { data } = await apiClient.get<PaginatedResponse<MerchantListing>>("/merchant/listings", {
      params: query,
    });
    return data;
  },

  /** Backend: GET /merchant/listings/:id */
  getListing: async (id: string): Promise<MerchantListing> => {
    const { data } = await apiClient.get<ApiEnvelope<MerchantListing>>(`/merchant/listings/${id}`);
    return data.data;
  },

  /** Backend: POST /merchant/listings — status starts "pending" until an admin approves it. */
  createListing: async (payload: CreateListingRequest): Promise<MerchantListing> => {
    const { data } = await apiClient.post<ApiEnvelope<MerchantListing>>("/merchant/listings", payload);
    return data.data;
  },

  /** Backend: PUT /merchant/listings/:id */
  updateListing: async (id: string, payload: UpdateListingRequest): Promise<MerchantListing> => {
    const { data } = await apiClient.put<ApiEnvelope<MerchantListing>>(`/merchant/listings/${id}`, payload);
    return data.data;
  },

  /** Backend: DELETE /merchant/listings/:id */
  deleteListing: async (id: string): Promise<void> => {
    await apiClient.delete(`/merchant/listings/${id}`);
  },

  /** Backend: GET /merchant/listings/:id/gallery */
  getGallery: async (listingId: string): Promise<BusinessListingGalleryPhoto[]> => {
    const { data } = await apiClient.get<ApiEnvelope<BusinessListingGalleryPhoto[]>>(
      `/merchant/listings/${listingId}/gallery`,
    );
    return data.data;
  },

  /**
   * Backend: POST /merchant/listings/:id/gallery
   *
   * Called AFTER the file is already sitting in S3 via the shared presign
   * flow (useImageUpload) — this just persists the resulting URL as a real
   * gallery row, which is the piece that was stubbed out in Sprint 2
   * (BusinessGallery.tsx's photos never survived a refresh).
   */
  addGalleryPhoto: async (listingId: string, fileUrl: string): Promise<BusinessListingGalleryPhoto> => {
    const { data } = await apiClient.post<ApiEnvelope<BusinessListingGalleryPhoto>>(
      `/merchant/listings/${listingId}/gallery`,
      { url: fileUrl },
    );
    return data.data;
  },

  /** Backend: DELETE /merchant/listings/:id/gallery/:photoId */
  deleteGalleryPhoto: async (listingId: string, photoId: string): Promise<void> => {
    await apiClient.delete(`/merchant/listings/${listingId}/gallery/${photoId}`);
  },
};