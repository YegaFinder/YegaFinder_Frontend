import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { Listing } from "../types/listing.types";
import { RatingBadge } from "./RatingBadge";
import { VerificationBadge } from "./VerificationBadge";

/**
 * FIXED: added the "Message this business" entry point. Per sprint5's own
 * CustomerMessagesPage placeholder, chat was built end-to-end (customer
 * composer, merchant read-only combined feed) but nothing on the
 * customer/business-discovery side ever linked to /messages/[businessId]
 * — a customer could never actually reach the feature. This button plus
 * the new src/app/(customer)/messages/[businessId]/page.tsx route (added
 * alongside sprint5's chat feature) closes that loop. Requires sprint5's
 * chat feature to be merged in for the destination route to exist.
 */
export function BusinessHero({ listing }: { listing: Listing }) {
  return (
    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-muted">
      {listing.bannerUrl && (
        <Image src={listing.bannerUrl} alt={listing.businessName} fill className="object-cover" />
      )}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{listing.businessName}</h1>
          {listing.businessAddress && <p className="text-sm text-white/80">{listing.businessAddress}</p>}
          <div className="mt-1"><RatingBadge rating={listing.averageRating} reviewCount={listing.totalReviews} /></div>
          <div className="mt-1"><VerificationBadge status={listing.verificationStatus} /></div>
        </div>
        <Link
          href={`/messages/${listing.id}`}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-yegna-navy shadow-sm hover:bg-white/90"
        >
          <MessageCircle className="size-4" />
          Message
        </Link>
      </div>
    </div>
  );
}
