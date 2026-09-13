"use client";

import { NearbyFeed } from "@/features/nearby/components/NearbyFeed";

export default function NearbyPage() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold text-yegna-navy">Nearby businesses</h1>
      <NearbyFeed />
    </div>
  );
}