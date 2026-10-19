import { z } from "zod";
import { publishedServices } from "@/content/services";

/** Shared by the quote form (client) and /api/quote (server). */

export const serviceOptions = [
  ...publishedServices.map((s) => s.title),
  "Not sure yet / multiple services",
] as const;

export const budgetOptions = [
  "Not sure yet",
  "Under R5 000",
  "R5 000 – R15 000",
  "R15 000 – R30 000",
  "R30 000 – R60 000",
  "Over R60 000",
] as const;

export const contactMethods = ["Email", "Phone", "WhatsApp"] as const;

const phoneRegex = /^[+()\d\s-]{9,20}$/;

export const quoteSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name.").max(100, "Name is too long."),
    businessName: z.string().trim().max(120, "Business name is too long.").optional().or(z.literal("")),
    email: z.string().trim().max(160).email("Please enter a valid email address."),
    phone: z
      .string()
      .trim()
      .max(20)
      .optional()
      .or(z.literal(""))
      .refine((v) => !v || phoneRegex.test(v), "Please enter a valid phone number."),
    service: z.enum(serviceOptions, { error: "Please choose the service you need." }),
    budget: z.enum(budgetOptions).optional().or(z.literal("")),
    message: z
      .string()
      .trim()
      .min(20, "Please tell us a little more about your project (at least 20 characters).")
      .max(4000, "Please keep your description under 4000 characters."),
    contactMethod: z.enum(contactMethods, { error: "Please choose how you would like us to contact you." }),
    consent: z.literal(true, { error: "Please confirm that we may use your details to respond to your enquiry." }),
    // Spam protection fields (not shown to people).
    website: z.string().max(0).optional().or(z.literal("")),
    startedAt: z.number().int().positive(),
  })
  .superRefine((data, ctx) => {
    if ((data.contactMethod === "Phone" || data.contactMethod === "WhatsApp") && !data.phone) {
      ctx.addIssue({ code: "custom", path: ["phone"], message: "Please add a phone number so we can contact you that way." });
    }
  });

export type QuoteInput = z.infer<typeof quoteSchema>;

export type FieldErrors = Partial<Record<keyof QuoteInput, string>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof QuoteInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** Minimum time (ms) between rendering the form and submitting it. Bots tend to submit instantly. */
export const MIN_FILL_TIME_MS = 3000;
