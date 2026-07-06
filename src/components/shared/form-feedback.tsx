import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small inline spinner — drop inside a Button while a submit is in flight. */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-4 animate-spin", className)} />;
}

/** Consistent styling for a single field's validation error message. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

/** Consistent styling for a top-of-form error banner (e.g. "Invalid credentials"). */
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="rounded-[10px] border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
      {message}
    </div>
  );
}
