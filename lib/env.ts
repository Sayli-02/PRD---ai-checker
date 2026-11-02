import "server-only";
import { z } from "zod";

// Server-side environment, validated once. Empty strings count as "not set".
// In production the keys the check cannot run without are required; the server refuses to start without them.
const text = z
  .string()
  .optional()
  .transform((v) => v?.trim() || undefined);

const schema = z
  .object({
    NEXT_PUBLIC_SITE_URL: text,
    NEXT_PUBLIC_META_PIXEL_ID: text,
    SUPABASE_URL: text,
    SUPABASE_SERVICE_ROLE_KEY: text,
    OPENAI_API_KEY: text,
    GEMINI_API_KEY: text,
    PERPLEXITY_API_KEY: text,
    OPENAI_MODEL: text,
    GEMINI_MODEL: text,
    PERPLEXITY_MODEL: text,
    TURNSTILE_SECRET_KEY: text,
    OTP_PROVIDER_KEY: text,
    OTP_SENDER_ID: text,
    OTP_DLT_TEMPLATE_ID: text,
    META_CAPI_TOKEN: text,
    META_GRAPH_VERSION: text,
    WEBHOOK_URL: text.pipe(z.url().optional()),
    IP_HASH_SALT: text,
  })
  .superRefine((env, ctx) => {
    // Preview/dev can boot without every vendor key. Only the live Production URL is strict.
    if (process.env.VERCEL_ENV ? process.env.VERCEL_ENV !== "production" : process.env.NODE_ENV !== "production") return;
    const required = [
      "SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "IP_HASH_SALT",
      "TURNSTILE_SECRET_KEY",
      "OTP_PROVIDER_KEY",
      "OTP_DLT_TEMPLATE_ID",
    ] as const;
    for (const key of required) {
      if (!env[key]) ctx.addIssue({ code: "custom", path: [key], message: `${key} is required in production` });
    }
    if (!env.OPENAI_API_KEY && !env.GEMINI_API_KEY && !env.PERPLEXITY_API_KEY) {
      ctx.addIssue({ code: "custom", path: ["OPENAI_API_KEY"], message: "At least one AI engine key is required in production" });
    }
    if (env.IP_HASH_SALT && env.IP_HASH_SALT.length < 16) {
      ctx.addIssue({ code: "custom", path: ["IP_HASH_SALT"], message: "IP_HASH_SALT must be at least 16 characters" });
    }
  });

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

export function getEnv(): Env {
  if (!cached) {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
      const lines = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
      throw new Error(`Invalid environment:\n${lines.join("\n")}`);
    }
    cached = parsed.data;
  }
  return cached;
}
