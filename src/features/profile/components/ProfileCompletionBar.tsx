import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileCompletionBarProps {
  isComplete: boolean;
}

/**
 * `CustomerProfile` on main exposes `isProfileComplete` as a plain
 * boolean, not a percentage — there's no weighted-completion number to
 * show a progress bar for. This renders as a simple complete/incomplete
 * status banner instead. If the backend later adds a percentage field,
 * swap this back for a real progress bar.
 */
export function ProfileCompletionBar({ isComplete }: ProfileCompletionBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-[14px] border px-4 py-3 text-sm",
        isComplete
          ? "border-yegna-border bg-yegna-background text-foreground"
          : "border-yegna-primary/30 bg-yegna-primary/5 text-foreground",
      )}
    >
      {isComplete ? (
        <CheckCircle2 className="size-4 shrink-0 text-yegna-primary" />
      ) : (
        <Circle className="size-4 shrink-0 text-muted-foreground" />
      )}
      <span>
        {isComplete
          ? "Your profile is complete."
          : "Your profile is incomplete — add a bit more info to get the most out of YegnaFinder."}
      </span>
    </div>
  );
}
