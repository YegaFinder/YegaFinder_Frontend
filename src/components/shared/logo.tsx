import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-poppins font-bold text-yegna-primary tracking-tight",
        className,
      )}
    >
      {siteConfig.name}
    </span>
  );
}
