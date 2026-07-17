import type { Metadata, Viewport } from "next";
import { Poppins, Inter, Noto_Sans_Ethiopic } from "next/font/google";
import { siteConfig } from "@/config/site";
import InstallPrompt from "@/components/shared/InstallPrompt";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/shared/toast-provider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  // Only weight 700 (font-bold) is applied anywhere in the codebase right now.
  // Add weights here as new designs introduce font-medium (500), font-semibold (600), etc.
  // Keeping the list tight prevents Next.js generating unused preload <link> tags.
  weight: ["700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  // Inter is a variable font — it covers all weights in one file, but Next.js
  // still generates preload tags for multiple subsets. Setting preload:false
  // avoids the "preloaded but not used" warning on pages that load quickly.
  preload: false,
});

const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-ethiopic",
  display: "swap",
  // Don't eagerly preload on every page — only pages that actually render
  // Ethiopic text will trigger the download. Auth pages use Poppins/Inter only.
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteConfig.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B5C8E",
  width: "device-width",
  initialScale: 1,
  // Lets the page draw under the notch/home-indicator so env(safe-area-inset-*)
  // resolves to real pixel values instead of 0 — needed for the fixed
  // bottom nav (mobile-bottom-nav.tsx) to sit above the home-indicator
  // instead of behind it on iOS PWAs.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} ${notoSansEthiopic.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <QueryProvider>
          {children}
          <InstallPrompt />
          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  );
}