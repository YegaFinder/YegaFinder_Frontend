import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names (clsx) and then resolves any
 * conflicting Tailwind utility classes so the last one wins
 * (tailwind-merge). Use this instead of template-string concatenation
 * anywhere a component accepts a `className` prop from its caller.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
