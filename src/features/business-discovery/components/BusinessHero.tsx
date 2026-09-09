import type { BusinessDetail } from "@/types/business.types";

// NOTE: BusinessDetail has no image field per the current backend
// contract (Sprint 3 API doc). Revisit this once confirmed with backend.
export function BusinessHero({ business }: { business: BusinessDetail }) {
  return (
    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-muted flex items-end">
      <div className="p-4">
        <h1 className="text-2xl font-semibold">{business.name}</h1>
        <p className="text-sm text-muted-foreground">{business.contactInfo.address}</p>
      </div>
    </div>
  );
}
