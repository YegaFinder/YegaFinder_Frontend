import { NearbyMap } from "@/features/business-discovery/components/NearbyMap";

export default function NearbyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Nearby businesses</h1>
        <p className="text-sm text-muted-foreground">
          Businesses within your selected radius, sorted by distance.
        </p>
      </header>
      <NearbyMap />
    </main>
  );
}
