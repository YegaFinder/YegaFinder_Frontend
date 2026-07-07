/**
 * Single source of truth for every route path in the app.
 *
 * Why this exists: once the app has 130+ screens across customer,
 * merchant, and admin roles (per the SRS), hardcoding path strings like
 * "/login" or "/dashboard/bookings" all over the codebase makes renaming
 * a route a find-and-replace nightmare. Import ROUTES.LOGIN instead of
 * typing "/login" directly, everywhere — including in middleware.ts.
 */
export const ROUTES = {
  HOME: "/",

  // Auth (Sprint 1)
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_OTP: "/verify-otp",

  // Customer (Sprint 2+)
  PROFILE: "/profile",
  SAVED_PLACES: "/saved-places",

  // Business discovery (Sprint 3+)
  BUSINESSES: "/businesses",
  BUSINESS_DETAIL: (id: string) => `/businesses/${id}`,

  // Merchant (later phase)
  MERCHANT_DASHBOARD: "/dashboard",
  MERCHANT_BOOKINGS: "/dashboard/bookings",
  MERCHANT_LISTINGS: "/dashboard/listings",

  // Admin (later phase)
  ADMIN_DASHBOARD: "/admin",
} as const;
