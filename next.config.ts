import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";


const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Disable in dev so hot-reload isn't fighting a cached service worker.
  disable: process.env.NODE_ENV === "development",
});

const isDev = process.env.NODE_ENV === "development";


const scriptSrc = isDev ? "'self' 'unsafe-eval' 'unsafe-inline'" : "'self' 'unsafe-inline'";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.yegnafinder.com" },
      { protocol: "https", hostname: "yegnafinder-uploads.s3.amazonaws.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src ${scriptSrc} https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://cdn.yegnafinder.com https://yegnafinder-storage.s3.amazonaws.com; font-src 'self' data:; connect-src 'self' http://localhost:8000 https://api.yegnafinder.com https://*.onrender.com https://*.vercel.live wss://*.vercel.live; frame-src 'self' https://vercel.live;`,
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);