"use client";

import { useParams } from "next/navigation";
import { useListingDetail } from "@/features/business-discovery/api/hooks/useListingDetail";
import { BusinessHero } from "@/features/business-discovery/components/BusinessHero";
import { BusinessDetailTabs } from "@/features/business-discovery/components/BusinessDetailTabs";

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useListingDetail(id);

  if (isLoading) return <p className="container mx-auto px-4 py-6">Loading…</p>;
  if (isError || !data) return <p className="container mx-auto px-4 py-6">Business not found.</p>;

  return (
    <main className="container mx-auto px-4 py-6 space-y-4">
      <BusinessHero listing={data} />
      <BusinessDetailTabs listing={data} />
    </main>
  );
}
