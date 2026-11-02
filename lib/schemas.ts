// Zod schemas are the single source of truth for every API request and response.
// Relative imports only, so `node --test` can load modules that depend on this file.
import { z } from "zod";
import { categories, ENGINES } from "../content/check.ts";

const categoryValues = categories.map((c) => c.value) as [string, ...string[]];

/** "https://www.Example.com/path" or "example.com" -> "example.com". Null if not a domain. */
export function normalizeDomain(input: string): string | null {
  const text = input.trim().toLowerCase();
  if (!text || /\s/.test(text)) return null;
  try {
    const host = new URL(/^https?:\/\//.test(text) ? text : `https://${text}`).hostname;
    const domain = host.replace(/^www\./, "");
    return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain) ? domain : null;
  } catch {
    return null;
  }
}

/** Indian mobile: 10 digits starting 6-9, with or without +91 / 0. Returns the 10 digits. */
export function normalizeMobile(input: string): string | null {
  const digits = input.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

// ---------- requests ----------

const utmSchema = z.record(z.string(), z.string().max(200)).optional();

export const checkInputSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Enter your website")
    .max(200)
    .refine((v) => normalizeDomain(v) !== null, "Enter a website like yourbusiness.com"),
  category: z.enum(categoryValues, { message: "Choose a category" }),
  city: z
    .string()
    .trim()
    .min(2, "Enter your city")
    .max(60)
    .regex(/^[\p{L}\p{M}\s.'-]+$/u, "Use letters only"),
});
export type CheckInput = z.infer<typeof checkInputSchema>;

export const createCheckSchema = checkInputSchema.extend({
  turnstileToken: z.string().max(2048).nullish(),
  utm: utmSchema,
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  mobile: z
    .string()
    .trim()
    .refine((v) => normalizeMobile(v) !== null, "Enter a 10-digit Indian mobile number"),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(120),
  consent: z.literal(true, { message: "Please tick the box to continue" }),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const leadSchema = contactSchema.extend({ utm: utmSchema });

export const otpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

// ---------- responses ----------

export const resultSchema = z.object({
  score: z.number().int().min(0).max(100),
  band: z.enum(["Low", "Fair", "Good", "Strong"]),
  mentionedCount: z.number().int().min(0),
  totalAnswers: z.number().int().min(0),
  competitors: z.array(z.object({ name: z.string(), mentions: z.number().int() })).max(3),
  topSources: z.array(z.object({ domain: z.string(), count: z.number().int() })).max(5),
  sourceCount: z.number().int().min(0),
  quickFix: z.string(),
  quickFixCount: z.number().int().min(0),
});
export type CheckResult = z.infer<typeof resultSchema>;

export const engineStatusSchema = z.enum(["waiting", "running", "done", "failed"]);
export type EngineStatus = z.infer<typeof engineStatusSchema>;

export const progressSchema = z.object({
  status: z.enum(["running", "done", "failed"]),
  answersDone: z.number().int().min(0),
  totalAnswers: z.number().int(),
  etaSeconds: z.number().int().min(0),
  engines: z.array(z.object({ engine: z.enum(ENGINES), status: engineStatusSchema, answersDone: z.number().int() })),
  business: z.object({ domain: z.string(), category: z.string(), city: z.string() }),
  lead: z.enum(["none", "otp_sent", "verified"]),
  canRetry: z.boolean(),
  /** Present only when the check is done AND the lead's mobile is verified. Never sent before. */
  result: resultSchema.optional(),
});
export type Progress = z.infer<typeof progressSchema>;
