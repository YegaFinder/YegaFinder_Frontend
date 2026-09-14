import Link from "next/link";
import Image from "next/image";
import type { Business } from "@/types/business.types";
import { RatingBadge } from "./RatingBadge";
import { VerificationBadge } from "./VerificationBadge";

interface BusinessCardProps {
  business: Business;
  distanceKm?: number;
}

export function BusinessCard({ business, distanceKm }: BusinessCardProps) {
  const primaryCategory = business.businessCategories?.[0]?.name ?? "Uncategorized";

  return (
    <Link
      href={`/businesses/${business.id}`}
      className="block overflow-hidden rounded-xl border hover:shadow-md transition-shadow"
    >
      <div className="relative h-36 w-full bg-muted">
        {business.bannerUrl && (
          <Image src={business.bannerUrl} alt={business.businessName} fill className="object-cover" />
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium truncate">{business.businessName}</h3>
        <p className="text-xs text-muted-foreground">{primaryCategory}</p>
        {business.businessAddress && (
          <p className="text-sm text-muted-foreground truncate">{business.businessAddress}</p>
        )}
        <div className="flex items-center justify-between gap-2 flex-wrap mt-1">
          <div className="flex items-center gap-2">
            <RatingBadge rating={business.averageRating} reviewCount={business.totalReviews} size="sm" />
            <VerificationBadge status={business.verificationStatus} size="sm" />
          </div>
          {distanceKm != null && (
            <span className="text-xs text-muted-foreground">
              {distanceKm < 1
                ? `${Math.round(distanceKm * 1000)} m away`
                : `${distanceKm.toFixed(1)} km away`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
