import Image from "next/image";
import type { Business } from "@/types/business.types";
import { RatingBadge } from "./RatingBadge";
import { VerificationBadge } from "./VerificationBadge";

export function BusinessHero({ business }: { business: Business }) {
  return (
    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-muted">
      {business.bannerUrl && (
        <Image src={business.bannerUrl} alt={business.businessName} fill className="object-cover" />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h1 className="text-2xl font-semibold text-white">{business.businessName}</h1>
        {business.businessAddress && <p className="text-sm text-white/80">{business.businessAddress}</p>}
        <div className="mt-1"><RatingBadge rating={business.averageRating} reviewCount={business.totalReviews} /></div>
        <div className="mt-1"><VerificationBadge status={business.verificationStatus} /></div>
      </div>
    </div>
  );
}