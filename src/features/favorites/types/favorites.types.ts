/**
 * Minimal favorite-business shape for the customer-facing favorites list.
 *
 * IMPORTANT: there is no `businesses` module on the backend yet — it's
 * scoped for Sprint 3+ — and there is currently NO backend favorites
 * endpoint at all (no `src/favorites/` in the NestJS repo). `businessName`
 * and `businessImageUrl` are therefore optional rather than assumed.
 * Reconcile this type against the real DTO once the backend module ships.
 */
export interface Favorite {
  id: string;
  businessId: string;
  businessName?: string;
  businessImageUrl?: string;
  createdAt: string;
}