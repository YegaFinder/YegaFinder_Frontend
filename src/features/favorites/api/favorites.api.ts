import { apiClient } from "@/lib/api-client";
import type { Favorite, AddFavoriteResponse } from "../types/favorites.types";

export const favoritesApi = {
  // §9.4 — Pattern C, direct array
  getFavorites: async (): Promise<Favorite[]> => {
    const { data } = await apiClient.get<Favorite[]>("/favorites");
    return data;
  },

  // §9.4 — Pattern C, direct object
  addFavorite: async (businessId: string): Promise<AddFavoriteResponse> => {
    const { data } = await apiClient.post<AddFavoriteResponse>("/favorites", { businessId });
    return data;
  },

  removeFavorite: async (businessId: string): Promise<void> => {
    await apiClient.delete(`/favorites/${businessId}`);
  },
};