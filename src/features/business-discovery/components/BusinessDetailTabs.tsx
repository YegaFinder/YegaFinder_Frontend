"use client";

import { useState } from "react";
import type { Business } from "@/types/business.types";

const TABS = ["Overview", "Services", "Contact"] as const;
type Tab = (typeof TABS)[number];

export function BusinessDetailTabs({ business }: { business: Business }) {
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
        {tab === "Overview" && <p>{business.description || "No description provided."}</p>}
        {tab === "Services" && (
          <ul className="space-y-2">
            {business.servicesOffered?.length ? (
              business.servicesOffered.map((s) => (
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
            {business.contactPhone && <li>Phone: {business.contactPhone}</li>}
            {business.contactEmail && <li>Email: {business.contactEmail}</li>}
            {business.websiteUrl && <li>Website: {business.websiteUrl}</li>}
            {business.businessAddress && <li>Address: {business.businessAddress}</li>}
          </ul>
        )}
      </div>
    </div>
  );
}