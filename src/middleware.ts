import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";

const GUEST_ONLY_ROUTES: string[] = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.VERIFY_OTP,
];

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
  if (!hasSession && !isGuestOnlyRoute) {
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
      pathname.startsWith(ROUTES.FAVORITES);
    const isMerchantRoute = pathname.startsWith(ROUTES.MERCHANT_DASHBOARD);

    if (isCustomerRoute && role === "Merchant") {
      return NextResponse.redirect(new URL(ROUTES.MERCHANT_DASHBOARD, request.url));
    }

    if (isMerchantRoute && role === "Customer") {
      return NextResponse.redirect(new URL(ROUTES.APP_HOME, request.url));
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
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ],
};
