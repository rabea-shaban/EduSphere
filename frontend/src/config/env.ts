import { z } from "zod";

const PRODUCTION_API_URL = "https://edu-api.al-aiitihad.com/api/v1";
const PRODUCTION_APP_URL = "https://education-spheree.vercel.app";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:5000/api/v1"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const getEnv = () => {
  const isProduction = process.env.NODE_ENV === "production";

  // In production, always fall back to the hard-coded production URLs
  // if env vars are missing or invalid (e.g. during SSG prerendering)
  const rawValues = {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      (isProduction ? PRODUCTION_API_URL : undefined),
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ||
      (isProduction ? PRODUCTION_APP_URL : undefined),
    NODE_ENV: process.env.NODE_ENV,
  };

  const parsed = envSchema.safeParse(rawValues);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.format());

    if (isProduction) {
      // Fallback to hard-coded production values instead of crashing the build
      console.warn("⚠️ Falling back to default production environment variables.");
      return envSchema.parse({
        NEXT_PUBLIC_API_URL: PRODUCTION_API_URL,
        NEXT_PUBLIC_APP_URL: PRODUCTION_APP_URL,
        NODE_ENV: "production",
      });
    }

    return envSchema.parse({}); // fallback to defaults in dev/test
  }

  return parsed.data;
};

export const env = getEnv();
export type EnvConfig = z.infer<typeof envSchema>;
