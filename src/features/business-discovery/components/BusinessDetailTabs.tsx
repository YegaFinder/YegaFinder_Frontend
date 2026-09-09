"use client";

import { useState } from "react";
import type { BusinessDetail } from "@/types/business.types";

const TABS = ["Overview", "Contact", "Photos"] as const;
type Tab = (typeof TABS)[number];

export function BusinessDetailTabs({ business }: { business: BusinessDetail }) {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <div>
      <div className="flex gap-4 border-b">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 text-sm ${
              tab === t ? "border-b-2 border-primary font-medium" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="py-4">
        {tab === "Overview" && <p>{business.description}</p>}
        {tab === "Contact" && (
          <ul className="space-y-2 text-sm">
            <li>Phone: {business.contactInfo.phone}</li>
            <li>Email: {business.contactInfo.email}</li>
            {business.contactInfo.website && <li>Website: {business.contactInfo.website}</li>}
            <li>Address: {business.contactInfo.address}</li>
          </ul>
        )}
        {tab === "Photos" && (
          <div className="grid grid-cols-3 gap-2">
            {business.gallery.map((url: string, i: number) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={url} alt="" className="rounded-md aspect-square object-cover" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
