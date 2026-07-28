export const ROUTES = {
  HOME: "/",
  APP_HOME:"/home",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_OTP: "/verify-otp",

  // Legal (public, unauthenticated)
  TERMS: "/terms",
  PRIVACY: "/privacy",

  PROFILE: "/profile",
  SAVED_PLACES: "/saved-places",
  FAVORITES: "/favorites",

  BUSINESSES: "/businesses",
  BUSINESS_DETAIL: (id: string) => `/businesses/${id}`,

  MERCHANT_DASHBOARD: "/dashboard",
  MERCHANT_PROFILE: "/dashboard/profile",
  MERCHANT_BOOKINGS: "/dashboard/bookings",
  MERCHANT_LISTINGS: "/dashboard/listings",

  ADMIN_DASHBOARD: "/admin",
} as const;