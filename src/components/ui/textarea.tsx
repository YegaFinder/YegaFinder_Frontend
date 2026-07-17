import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-[14px] border border-yegna-border bg-yegna-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-yegna-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };