import Link from "next/link";
import Image from "next/image";
import type { Listing } from "../types/listing.types";
import { RatingBadge } from "./RatingBadge";
import { VerificationBadge } from "./VerificationBadge";

export function BusinessCard({ listing }: { listing: Listing }) {
  const primaryCategory = listing.businessCategories?.[0]?.name ?? "Uncategorized";

  return (
    <Link
      href={`/businesses/${listing.id}`}
      className="block overflow-hidden rounded-xl border hover:shadow-md transition-shadow"
    >
      <div className="relative h-36 w-full bg-muted">
        {listing.bannerUrl && (
          <Image src={listing.bannerUrl} alt={listing.businessName} fill className="object-cover" />
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium truncate">{listing.businessName}</h3>
        <p className="text-xs text-muted-foreground">{primaryCategory}</p>
        {listing.businessAddress && (
          <p className="text-sm text-muted-foreground truncate">{listing.businessAddress}</p>
        )}
        <RatingBadge rating={listing.averageRating} reviewCount={listing.totalReviews} size="sm" />
      <VerificationBadge status={listing.verificationStatus} size="sm" />
      </div>
    </Link>
  );
}
