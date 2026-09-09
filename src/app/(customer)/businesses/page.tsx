import { DiscoveryFeed } from "@/features/business-discovery/components/DiscoveryFeed";

export default function BusinessesPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Browse Businesses</h1>
      <DiscoveryFeed />
    </main>
  );
}