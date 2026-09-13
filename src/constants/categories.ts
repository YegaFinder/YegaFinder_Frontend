import type { BusinessCategory } from "@/types/business.types";

/**
 * Hardcoded fallback for the 5 seed categories, per
 * YegnaFinder_Backend_Reference.md §7.7's explicit workaround
 * recommendation: "Hardcode the current 5 seed categories client-side as
 * a fallback for logged-out users... and swap to the live API once a
 * user is authenticated."
 *
 * These ids are NOT real category UUIDs — GET /categories requires a
 * JWT (B3, missing @Public()), so a guest can't fetch the real ones at
 * all. They exist purely so filter chips have something to render for
 * logged-out visitors instead of crashing or vanishing. Never send one
 * of these ids to the backend as a real categoryId (e.g. in
 * businessCategories on a merchant profile save) — it isn't one.
 *
 * FRAGILE ON PURPOSE (matches the doc's own caveat): this silently goes
 * stale the moment backend adds a 6th category. If GET /categories ever
 * gets @Public() (or these results start looking wrong), delete this
 * fallback and the try/catch in useCategories that reaches for it.
 */
export const FALLBACK_SEED_CATEGORIES: BusinessCategory[] = [
  { id: "seed-food-dining", name: "Food & Dining", description: "Restaurants, cafes, and bakeries", subCategories: [] },
  { id: "seed-health-wellness", name: "Health & Wellness", description: "Hospitals, clinics, gyms, and spas", subCategories: [] },
  { id: "seed-retail-shopping", name: "Retail & Shopping", description: "Supermarkets, boutiques, and electronics", subCategories: [] },
  { id: "seed-home-services", name: "Home Services", description: "Plumbing, cleaning, and electrical services", subCategories: [] },
  { id: "seed-professional-services", name: "Professional Services", description: "Legal, accounting, and consulting", subCategories: [] },
];
