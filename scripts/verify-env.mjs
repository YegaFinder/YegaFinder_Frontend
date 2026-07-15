#!/usr/bin/env node

/**
 * Fails loudly if required env vars are missing/invalid for a REAL
 * deploy. Run this as an explicit deploy-pipeline step (Vercel build
 * command, or a pre-deploy CI job) — NOT as part of `npm run build`
 * itself, which also runs for local dev builds and CI sanity checks
 * that were never going to serve real traffic. (src/lib/env.ts used to
 * throw during `next build`'s static prerender for exactly this
 * reason — every plain build failed, even ones with no real deploy
 * behind them. That check now only warns; this script is the real gate.)
 *
 * Usage: node scripts/verify-env.mjs
 */

const required = {
  NEXT_PUBLIC_API_URL: (v) => {
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  },
};

let failed = false;

for (const [key, isValid] of Object.entries(required)) {
  const value = process.env[key];
  if (!value || !isValid(value)) {
    console.error(`✗ ${key} is missing or invalid (got: ${value ?? "undefined"})`);
    failed = true;
  } else {
    console.log(`✓ ${key}`);
  }
}

if (process.env.NEXT_PUBLIC_API_URL?.includes("localhost")) {
  console.error("✗ NEXT_PUBLIC_API_URL points at localhost — refusing to deploy.");
  failed = true;
}

if (failed) {
  console.error("\nEnvironment check failed. See .env.example for required variables.");
  process.exit(1);
}

console.log("\nEnvironment check passed.");
