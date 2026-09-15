import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";

/**
 * FIXED: previously only listed /login and /register — /forgot-password,
 * /reset-password, and /verify-otp were missing from both this list AND
 * the `matcher` below, so middleware never even ran on them: an
 * already-authenticated user could freely navigate back into the
 * password-reset or OTP flow.
 */
const GUEST_ONLY_ROUTES: string[] = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.VERIFY_OTP,
];

// Reachable by guests AND logged-in users — unlike GUEST_ONLY_ROUTES,
// logged-in users are NOT redirected away from these.
const PUBLIC_ROUTE_PREFIXES: string[] = [ROUTES.BUSINESSES, ROUTES.SEARCH, ROUTES.NEARBY];
const isPublicRoute = (pathname: string) =>
  PUBLIC_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.get("has_session")?.value;
  const role = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.includes(pathname);

  // Already logged in? Keep them off the guest-only auth screens
  if (hasSession && isGuestOnlyRoute) {
    return NextResponse.redirect(new URL(ROUTES.APP_HOME, request.url));
  }

  // Not logged in and hitting a protected route
  if (!hasSession && !isGuestOnlyRoute && !isPublicRoute(pathname)) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role checks — soft, UX-only routing (Edge runtime can't call the
  // backend). The backend remains the actual authority on every API call.
  if (hasSession) {
    const isCustomerRoute =
      pathname === ROUTES.APP_HOME ||
      pathname.startsWith(ROUTES.PROFILE) ||
      pathname.startsWith(ROUTES.SAVED_PLACES) ||
      pathname.startsWith(ROUTES.FAVORITES) ||
      pathname.startsWith(ROUTES.BOOKINGS) ||
      pathname.startsWith(ROUTES.CHECKOUT) ||
      pathname.startsWith(ROUTES.MESSAGES);
    const isMerchantRoute = pathname.startsWith(ROUTES.MERCHANT_DASHBOARD);
    const isAdminRoute = pathname.startsWith(ROUTES.ADMIN_DASHBOARD);

    const homeForRole = (r?: string) => {
      if (r === "Merchant") return ROUTES.MERCHANT_DASHBOARD;
      if (r === "Admin" || r === "Moderator") return ROUTES.ADMIN_DASHBOARD;
      return ROUTES.APP_HOME;
    };

    // FIXED: previously only checked `role === "Merchant"` / `role ===
    // "Customer"` here, so an Admin or Moderator session hitting a
    // customer/merchant-only route fell through with no redirect at all.
    // Generalized to "does this role actually own this route group" so
    // all four roles are covered symmetrically, including the new /admin
    // group added in Sprint 6.
    if (isCustomerRoute && role !== "Customer") {
      return NextResponse.redirect(new URL(homeForRole(role), request.url));
    }
    if (isMerchantRoute && role !== "Merchant") {
      return NextResponse.redirect(new URL(homeForRole(role), request.url));
    }
    if (isAdminRoute && role !== "Admin" && role !== "Moderator") {
      return NextResponse.redirect(new URL(homeForRole(role), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/saved-places/:path*",
    "/favorites/:path*",
    "/bookings/:path*",
    "/businesses",
    "/businesses/:path*",
    "/search",
    "/nearby",
    "/checkout",
    "/checkout/:path*",
    "/messages",
    "/admin",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ],
};