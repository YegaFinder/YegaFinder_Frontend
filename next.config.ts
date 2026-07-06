import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

// PWA setup (Serwist generates the service worker from src/app/sw.ts
// and writes it to public/sw.js at build time).
const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Disable in dev so hot-reload isn't fighting a cached service worker.
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /**
   * Add image domains here as soon as the backend/CDN serving
   * business photos, logos, and banners is known, e.g.:
   * images: { remotePatterns: [{ protocol: "https", hostname: "cdn.yegnafinder.com" }] }
   */
};

export default withSerwist(nextConfig);
