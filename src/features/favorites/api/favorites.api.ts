import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type { Favorite } from "../types/favorites.types";

/**
 * These endpoints do not exist on the backend yet (no `src/favorites/`
 * module in the NestJS repo). Paths below are proposed
 * (`GET /favorites`, `POST /favorites/:businessId`, `DELETE /favorites/:businessId`).
 * Confirm against the real controller once it ships.
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