import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type { SavedAddress, CreateSavedAddressRequest } from "../types/profile.types";

/**
 * Per the Sprint 2 Release Report (July 27, 2026), saved places are a
 * top-level resource now — GET/POST /saved-places, DELETE
 * /saved-places/:id — not a jsonb field on the customer profile PUT
 * anymore. This replaces the earlier PUT-the-whole-profile workaround.
 *
 * Note: the report's endpoint table does NOT list a PUT /saved-places/:id.
 * useSavedAddresses.ts implements "edit" as delete-then-recreate as a
 * bridge until that's confirmed one way or the other on Swagger.
 */
export const savedPlacesApi = {
  getSavedPlaces: async (): Promise<SavedAddress[]> => {
    const { data } = await apiClient.get<ApiEnvelope<SavedAddress[]>>("/saved-places");
    return data.data;
  },
  addSavedPlace: async (payload: CreateSavedAddressRequest): Promise<SavedAddress> => {
    const { data } = await apiClient.post<ApiEnvelope<SavedAddress>>("/saved-places", payload);
    return data.data;
  },
  deleteSavedPlace: async (id: string): Promise<void> => {
    await apiClient.delete(`/saved-places/${id}`);
  },
};