import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";

/**
 * Runs BEFORE any matching page renders (see `matcher` below). Right now
 * this only checks whether an access-token cookie exists — it does not
 * yet decode the token to check `role`. Wiring in real role-based
 * protection (e.g. only "Merchant" can hit /dashboard/listings) is
 * planned for when the merchant dashboard is built; the shape is left
 * here so that work is a small addition, not a rewrite.
 *
 * Note: this reads a COOKIE, not localStorage — middleware runs on the
 * server, where localStorage doesn't exist. See src/lib/auth-storage.ts
 * for why the access token is mirrored into a cookie on login.
 */
const GUEST_ONLY_ROUTES: string[] = [ROUTES.LOGIN, ROUTES.REGISTER];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.includes(pathname);

  // Already logged in? Keep them off the guest-only auth screens
  // (login/register) instead of letting a stale form render. This
  // covers the back-button case: after logging in, /login can still
  // sit in browser history — this makes sure that even if the browser
  // navigates straight there (bfcache miss, bookmark, typed URL), the
  // server sends them onward instead of showing the login page again.
  if (token && isGuestOnlyRoute) {
    return NextResponse.redirect(new URL(ROUTES.APP_HOME, request.url));
  }

  // Not logged in and hitting a protected route (not login/register
  // themselves — otherwise this would redirect-loop back to itself).
  if (!token && !isGuestOnlyRoute) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // TODO: once role is available (decoded from the JWT, or a mirrored
  // role cookie set alongside the token), add role checks here, e.g.:
  //
  //   if (request.nextUrl.pathname.startsWith(ROUTES.MERCHANT_DASHBOARD)
  //       && role !== "Merchant") {
  //     return NextResponse.redirect(new URL("/unauthorized", request.url));
  //   }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};