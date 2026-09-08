import Link from "next/link";
import Image from "next/image";
import type { BusinessListItem } from "@/types/business.types";

export function BusinessCard({ business }: { business: BusinessListItem }) {
  return (
    <Link
      href={`/businesses/${business.id}`}
      className="block overflow-hidden rounded-xl border hover:shadow-md transition-shadow"
    >
      <div className="relative h-36 w-full bg-muted">
        {business.bannerUrl && (
          <Image src={business.bannerUrl} alt={business.name} fill className="object-cover" />
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium truncate">{business.name}</h3>
        <p className="text-xs text-muted-foreground">{business.category}</p>
        <p className="text-sm text-muted-foreground truncate">{business.address}</p>
        <span className="text-sm">⭐ {business.rating.toFixed(1)}</span>
      </div>
    </Link>
  );
}
