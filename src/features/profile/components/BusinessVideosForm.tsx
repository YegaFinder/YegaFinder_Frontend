"use client";

import { useState } from "react";
import { PlayCircle, Plus, ShieldAlert, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * ⚠️ There is no video/reel field or endpoint anywhere in the backend —
 * not even a stub entity like the gallery has. Real video FILE uploads
 * also aren't possible via /uploads/presign (its content-type whitelist
 * is jpeg/png/webp/pdf only, §6.1) — so the only thing achievable today
 * is linking to videos hosted elsewhere (YouTube, TikTok, Facebook).
 * Kept entirely in local state; flag persistent storage as a backend
 * schema request if this becomes a real requirement.
 */
export function BusinessVideosForm() {
  const [links, setLinks] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  function addLink() {
    const value = draft.trim();
    if (!value) return;
    try {
      new URL(value);
    } catch {
      toast.error("Enter a valid video URL (e.g. a YouTube or TikTok link).");
      return;
    }
    setLinks((prev) => [...prev, value]);
    setDraft("");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
        <span>
          Video hosting isn&apos;t supported by the backend yet — this only links out to videos hosted on
          YouTube/TikTok/Facebook, and isn&apos;t saved after a refresh.
        </span>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="https://youtube.com/watch?v=..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addLink();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addLink}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>

      {links.length > 0 && (
        <ul className="space-y-2">
          {links.map((link) => (
            <li
              key={link}
              className="flex items-center justify-between rounded-[10px] border border-yegna-border bg-background px-3 py-2 text-sm"
            >
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 truncate text-yegna-primary hover:underline"
              >
                <PlayCircle className="size-4 shrink-0" />
                <span className="truncate">{link}</span>
              </a>
              <button
                type="button"
                onClick={() => setLinks((prev) => prev.filter((l) => l !== link))}
                aria-label="Remove video link"
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}