import Image from "next/image";
import type { Listing } from "../types/listing.types";
import { RatingBadge } from "./RatingBadge";
import { VerificationBadge } from "./VerificationBadge";

export function BusinessHero({ listing }: { listing: Listing }) {
  return (
    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-muted">
      {listing.bannerUrl && (
        <Image src={listing.bannerUrl} alt={listing.businessName} fill className="object-cover" />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h1 className="text-2xl font-semibold text-white">{listing.businessName}</h1>
        {listing.businessAddress && <p className="text-sm text-white/80">{listing.businessAddress}</p>}
        <div className="mt-1"><RatingBadge rating={listing.averageRating} reviewCount={listing.totalReviews} /></div>
        <div className="mt-1"><VerificationBadge status={listing.verificationStatus} /></div>
      </div>
    </div>
  );
}
