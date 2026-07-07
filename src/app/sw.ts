import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";


// This declares the type of `self.__SW_MANIFEST` (injected by Serwist at build time).
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope & SerwistGlobalConfig;

const runtimeCaching = defaultCache.filter((entry) => {
  const cacheName = (entry.handler as { cacheName?: string }).cacheName;

  return ![
    "pages-rsc-prefetch",
    "pages-rsc",
    "pages",
    "next-data",
    "apis",
    "others",
  ].includes(cacheName ?? "");
});

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  // `defaultCache` is a sensible stale-while-revalidate-ish strategy set for
  // static assets, fonts, and pages. Fine-tune per-route caching (e.g. an
  // explicit "network-first" for anything hitting live availability/booking
  // data) here as those features get built — see the PWA section of the
  // team README for the reasoning behind each strategy choice.
  runtimeCaching,
});

serwist.addEventListeners();
