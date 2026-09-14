export interface Favorite {
  id: string;
  businessName: string;
  logoUrl?: string;
  averageRating: number;
}

export interface AddFavoriteResponse {
  id: string;
  userId: string;
  businessId: string;
  createdAt: string;
}