"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

/**
 * RETIRED: this page (and the whole business-listings feature it used to
 * render) assumed the backend supported a per-merchant collection of
 * "listings" — POST/GET/PUT/DELETE /merchant/listings/:id, plus a
 * per-listing gallery endpoint. Per YegnaFinder_Backend_Reference.md §6,
 * that API doesn't exist: a merchant has exactly ONE business
 * (`/merchant/profile`), managed end-to-end — details, hours, logo/banner,
 * gallery, submit-for-approval — on the Business Profile page.
 *
 * Redirecting rather than deleting the route outright so any stale link
 * or bookmark to /dashboard/listings lands somewhere useful instead of a
 * dead 404.
 */
export default function MerchantListingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.MERCHANT_PROFILE);
  }, [router]);

  return null;
}