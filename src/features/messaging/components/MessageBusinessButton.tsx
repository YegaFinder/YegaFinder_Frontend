"use client";

import { useState } from "react";
import { ChatWindow } from "./ChatWindow";

interface MessageBusinessButtonProps {
  businessId: string;
  businessName?: string;
}

export function MessageBusinessButton({ businessId, businessName }: MessageBusinessButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
      >
        {open ? "Hide chat" : "Message business"}
      </button>
      {open && (
        <ChatWindow
          businessId={businessId}
          businessName={businessName}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}