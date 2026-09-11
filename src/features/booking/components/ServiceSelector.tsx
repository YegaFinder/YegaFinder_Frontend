"use client";

import { useState } from "react";
import type { ListingService } from "../types/booking.types";

interface ServiceSelectorProps {
  services: ListingService[];
  onSelect?: (service: ListingService) => void;
}

// UI-only: real availability/booking submission needs backend endpoints
// that don't exist yet. This is safe to build now since servicesOffered
// is already real, confirmed backend data.
export function ServiceSelector({ services, onSelect }: ServiceSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (services.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No services listed for this business yet.
      </p>
    );
  }

  const handleSelect = (service: ListingService) => {
    setSelectedId(service.id);
    onSelect?.(service);
  };

  return (
    <div className="space-y-2" role="radiogroup" aria-label="Select a service">
      {services.map((service) => {
        const isSelected = service.id === selectedId;
        return (
          <button
            key={service.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleSelect(service)}
            className={`w-full text-left rounded-md border px-4 py-3 transition-colors ${
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{service.name}</span>
              {service.price !== undefined && (
                <span className="text-sm font-medium">
                  {service.currency ?? ""} {service.price}
                </span>
              )}
            </div>
            {service.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {service.description}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
