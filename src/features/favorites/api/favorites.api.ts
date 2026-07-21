import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type { Favorite } from "../types/favorites.types";

/**
 * These endpoints do not exist on the backend yet — see backend review
 * action item #1 (`src/favorites/` is missing entirely). Paths below
 * match what that review proposes (`GET /favorites`, `POST /favorites/:businessId`,
 * `DELETE /favorites/:businessId`). Confirm against the real controller
 * once it ships, the same way profile.api.ts was reconciled against
 * profiles.controller.ts — don't assume this is final.
 */
export const favoritesApi = {
  getFavorites: async (): Promise<Favorite[]> => {
    const { data } = await apiClient.get<ApiEnvelope<Favorite[]>>("/favorites");
    return data.data;
  },

  addFavorite: async (businessId: string): Promise<Favorite> => {
    const { data } = await apiClient.post<ApiEnvelope<Favorite>>(`/favorites/${businessId}`);
    return data.data;
  },

  removeFavorite: async (businessId: string): Promise<void> => {
    await apiClient.delete(`/favorites/${businessId}`);
  },
};
