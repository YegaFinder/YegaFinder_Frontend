"use client";

import { useState } from "react";
import type { Listing } from "../types/listing.types";

const TABS = ["Overview", "Services", "Contact"] as const;
type Tab = (typeof TABS)[number];

export function BusinessDetailTabs({ listing }: { listing: Listing }) {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <div>
      <div className="flex gap-4 border-b">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 text-sm ${tab === t ? "border-b-2 border-primary font-medium" : "text-muted-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="py-4">
        {tab === "Overview" && <p>{listing.description || "No description provided."}</p>}
        {tab === "Services" && (
          <ul className="space-y-2">
            {listing.servicesOffered?.length ? (
              listing.servicesOffered.map((s) => (
                <li key={s.id} className="flex justify-between border-b pb-2">
                  <span>{s.name}</span>
                  {s.price != null && <span>{s.price} {s.currency ?? "ETB"}</span>}
                </li>
              ))
            ) : (
              <p className="text-muted-foreground">No services listed yet.</p>
            )}
          </ul>
        )}
        {tab === "Contact" && (
          <ul className="space-y-2 text-sm">
            {listing.contactPhone && <li>Phone: {listing.contactPhone}</li>}
            {listing.contactEmail && <li>Email: {listing.contactEmail}</li>}
            {listing.websiteUrl && <li>Website: {listing.websiteUrl}</li>}
            {listing.businessAddress && <li>Address: {listing.businessAddress}</li>}
          </ul>
        )}
      </div>
    </div>
  );
}
