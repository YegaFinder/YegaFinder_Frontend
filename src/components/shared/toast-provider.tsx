"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster 
      position="top-center" 
      toastOptions={{
        classNames: {
          toast: "bg-background border border-border text-foreground",
          success: "text-green-500",
          error: "text-red-500",
        },
      }}
    />
  );
}
