/**
 * Minimal favorite-business shape for the customer-facing favorites list.
 *
 * IMPORTANT: there is no `businesses` module on the backend yet — it's
 * scoped for Sprint 3+ (see ROUTES.BUSINESSES) — and there is currently
 * NO backend favorites endpoint at all (backend review action item #1:
 * `src/favorites/` doesn't exist in the NestJS repo). `businessName` and
 * `businessImageUrl` are therefore optional rather than assumed, since
 * neither side of this contract is confirmed yet. Reconcile this type
 * against the real DTO the same way profile.types.ts was reconciled
 * against ProfileResponseDto once the backend module ships.
 */
export interface Favorite {
  id: string;
  businessId: string;
  businessName?: string;
  businessImageUrl?: string;
  createdAt: string;
}
