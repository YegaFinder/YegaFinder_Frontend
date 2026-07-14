import { z } from "zod";


const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_TEST_MODE: z.enum(["true", "false"]).optional(),
});

const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

function loadEnv() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_TEST_MODE: process.env.NEXT_PUBLIC_TEST_MODE,
  });

  if (!result.success) {
    if (isDev || isTest) {
      // For development and testing, use defaults
      return {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
        NEXT_PUBLIC_TEST_MODE: process.env.NEXT_PUBLIC_TEST_MODE as "true" | "false" | undefined,
      };
    }

    throw new Error(
      `Invalid or missing environment variables:\n${result.error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n")}\n\nCheck .env.example for the required variables.`,
    );
  }

  return result.data;
}

export const env = loadEnv();