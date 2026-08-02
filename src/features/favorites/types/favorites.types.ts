/**
 * Confirmed against the actual backend (favorite.entity.ts +
 * favorites.service.ts): GET /favorites eager-loads the full nested
 * `business` relation on each row — it is NOT a flat businessName/
 * businessImageUrl on the favorite itself.
 */
export interface Favorite {
  id: string;
  userId: string;
  businessId: string;
  business: {
    id: string;
    businessName: string;
    logoUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}