import { SearchFeed } from "@/features/business-discovery/components/SearchFeed";

export default function SearchPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Search</h1>
      <SearchFeed />
    </main>
  );
}
