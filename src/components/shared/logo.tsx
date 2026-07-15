import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface LogoProps {
  className?: string;
  /** Rendered height in pixels — width is derived from the source image's
   *  actual aspect ratio, so it can never look stretched or squashed. */
  height?: number;
}

// Source file is 2138x736 (see public/logo/yegnafinder-logo-full.png).
const SOURCE_WIDTH = 2138;
const SOURCE_HEIGHT = 736;

export function Logo({ className, height = 32 }: LogoProps) {
  const width = Math.round((height * SOURCE_WIDTH) / SOURCE_HEIGHT);

  return (
    <Image
      src="/logo/yegnafinder-logo-full.png"
      alt={siteConfig.name}
      width={width}
      height={height}
      priority
      className={cn("object-contain", className)}
    />
  );
}
