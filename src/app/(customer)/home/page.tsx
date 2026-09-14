"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/constants/routes";

import { useBusinesses } from "@/features/business-discovery/api/hooks/useBusinesses";
import { useCategories } from "@/features/business-discovery/api/hooks/useCategories";
import { useNearbyBusinesses } from "@/features/business-discovery/api/hooks/useNearbyBusinesses";
import { useGeolocation } from "@/features/business-discovery/api/hooks/useGeolocation";
import { CategoryChip } from "@/features/business-discovery/components/CategoryChip";
import { BusinessCard } from "@/features/business-discovery/components/BusinessCard";
import type { Business } from "@/types/business.types";

function Section({
  title,
  viewAllHref,
  children,
}: {
  title: string;
  viewAllHref?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm text-primary hover:underline">
            View all
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function BusinessGrid({ businesses }: { businesses: Business[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
}

export default function AppHomePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  // §4.1 — first page, most-recent-first, doubles as the "featured" rail
  // until the backend exposes a dedicated isFeatured filter.
  const { data: featured, isLoading: featuredLoading } = useBusinesses({ page: 1, limit: 8 });

  const { coords, permissionDenied } = useGeolocation();
  const { data: nearby, isLoading: nearbyLoading } = useNearbyBusinesses(
    coords ? { lat: coords.lat, lng: coords.lng, page: 1, limit: 8 } : null,
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {user?.firstName ? `Welcome back, ${user.firstName}` : "Discover businesses near you"}
        </h1>
        <p className="text-muted-foreground">Browse by category, or see what's nearby.</p>
      </div>

      {!categoriesLoading && categories && categories.length > 0 && (
        <Section title="Categories" viewAllHref={ROUTES.BUSINESSES}>
          <CategoryChip
            categories={categories}
            activeId={undefined}
            onSelect={(id) => {
              router.push(id ? `${ROUTES.BUSINESSES}?categoryId=${id}` : ROUTES.BUSINESSES);
            }}
          />
        </Section>
      )}

      <Section title="Featured businesses" viewAllHref={ROUTES.BUSINESSES}>
        {featuredLoading && <p className="text-muted-foreground">Loading…</p>}
        {!featuredLoading && (featured?.items?.length ?? 0) === 0 && (
          <p className="text-muted-foreground">No businesses to show yet.</p>
        )}
        {!!featured?.items?.length && <BusinessGrid businesses={featured.items} />}
      </Section>

      <Section title="Nearby">
        {permissionDenied && (
          <p className="text-muted-foreground">
            Turn on location access to see businesses near you, or{" "}
            <Link href={ROUTES.BUSINESSES} className="text-primary hover:underline">
              browse all businesses
            </Link>
            .
          </p>
        )}
        {!permissionDenied && !coords && <p className="text-muted-foreground">Finding your location…</p>}
        {coords && nearbyLoading && <p className="text-muted-foreground">Loading nearby businesses…</p>}
        {coords && !nearbyLoading && (nearby?.items?.length ?? 0) === 0 && (
          <p className="text-muted-foreground">No businesses found nearby yet.</p>
        )}
        {!!nearby?.items?.length && <BusinessGrid businesses={nearby.items} />}
      </Section>
    </div>
  );
}