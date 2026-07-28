import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type { Favorite } from "../types/favorites.types";

export const favoritesApi = {
  /** Backend: GET /favorites */
  getFavorites: async (): Promise<Favorite[]> => {
    const { data } = await apiClient.get<ApiEnvelope<Favorite[]>>("/favorites");
    return data.data;
  },

  /**
   * Backend: POST /favorites
   * businessId goes in the REQUEST BODY, not the URL path.
   */
  addFavorite: async (businessId: string): Promise<Favorite> => {
    const { data } = await apiClient.post<ApiEnvelope<Favorite>>("/favorites", { businessId });
    return data.data;
  },

  /** Backend: DELETE /favorites/:businessId */
  removeFavorite: async (businessId: string): Promise<void> => {
    await apiClient.delete(`/favorites/${businessId}`);
  },
};