import { z } from "zod";
import { categories } from "@/content/site";

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

/** Indian mobile: 10 digits starting 6-9, with or without +91 / 0. Returns the 10 digits. */
export function normalizeMobile(input: string): string | null {
  const digits = input.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

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

export const otpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});
