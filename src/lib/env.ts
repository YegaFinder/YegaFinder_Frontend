import { z } from "zod";

/**
 * Best-effort shape-check for NEXT_PUBLIC_* env vars, with a safe
 * fallback everywhere. Deliberately does NOT throw: Next.js statically
 * prerenders pages at `next build` time, in a process where NODE_ENV is
 * "production" and no .env file is present on a fresh checkout (.env is
 * gitignored). A throw here fires on every plain `npm run build`,
 * including CI runs that were never going to serve real traffic.
 *
 * Real protection against "a live deploy shipped pointing at
 * localhost" belongs in the deploy pipeline, not in code every page's
 * import chain executes — see scripts/verify-env.mjs, wired to
 * `predeploy` in package.json.
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_TEST_MODE: z.enum(["true", "false"]).optional(),
});

function loadEnv() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_TEST_MODE: process.env.NEXT_PUBLIC_TEST_MODE,
  });

  if (!result.success) {
    console.warn(
      "[env] NEXT_PUBLIC_API_URL is missing or invalid — falling back to " +
        "http://localhost:8000/api/v1. Fine for a local build/dev run; " +
        "should never happen for a real deploy — see scripts/verify-env.mjs, " +
        "which does fail a deploy over this.",
    );

    return {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
      NEXT_PUBLIC_TEST_MODE: process.env.NEXT_PUBLIC_TEST_MODE as "true" | "false" | undefined,
    };
  }

  return result.data;
}

export const env = loadEnv();
