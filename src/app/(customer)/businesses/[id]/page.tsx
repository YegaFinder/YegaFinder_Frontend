"use client";

import { useParams } from "next/navigation";
import { useBusinessDetail } from "@/features/business-discovery/api/hooks/useBusinessDetail";
import { BusinessHero } from "@/features/business-discovery/components/BusinessHero";
import { BusinessDetailTabs } from "@/features/business-discovery/components/BusinessDetailTabs";
import { MessageBusinessButton } from "@/features/messaging/components/MessageBusinessButton";

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useBusinessDetail(id);

  if (isLoading) return <p className="container mx-auto px-4 py-6">Loading…</p>;
  if (isError || !data) return <p className="container mx-auto px-4 py-6">Business not found.</p>;

  return (
    <>
      <main className="container mx-auto px-4 py-6 space-y-4">
        <BusinessHero business={data} />
        <BusinessDetailTabs business={data} />
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <MessageBusinessButton businessId={data.id} businessName={data.businessName} />
      </div>
    </>
  );
}
