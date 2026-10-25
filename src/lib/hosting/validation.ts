import * as z from "zod";
import { domainTlds, findTld, hostingPlans } from "@/content/hosting";
import { provinces } from "./types";

/** Validation shared by the account forms and their server actions. */

const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Email address is too long.")
  .pipe(z.email("Enter a valid email address."));

export const passwordSchema = z
  .string()
  .min(10, "Use at least 10 characters.")
  .max(200, "Password is too long.")
  .regex(/[a-zA-Z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

const phone = z
  .string()
  .trim()
  .max(30)
  .refine((v) => v === "" || /^[+0-9 ()-]{9,20}$/.test(v), "Enter a valid phone number.");

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  email,
  phone,
  company: z.string().trim().max(160).default(""),
  password: passwordSchema,
  acceptTerms: z.literal("on", { error: "Please accept the terms to create an account." }),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password.").max(200),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  phone,
  company: z.string().trim().max(160),
  addressLine1: z.string().trim().max(160),
  addressLine2: z.string().trim().max(160),
  city: z.string().trim().max(80),
  province: z.union([z.literal(""), z.enum(provinces)], { error: "Choose a province." }),
  postalCode: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{4}$/.test(v), "Postal codes have 4 digits."),
  vatNumber: z
    .string()
    .trim()
    .refine((v) => v === "" || /^4\d{9}$/.test(v), "South African VAT numbers have 10 digits and start with 4."),
  marketingOptIn: z.boolean(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(20),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

/** A registrable domain name like example.co.za (no www, no protocol). */
export function normaliseDomain(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

const domainPattern = /^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;

export const orderSchema = z
  .object({
    planId: z.enum(hostingPlans.map((p) => p.id) as [string, ...string[]], { error: "Choose a hosting plan." }),
    cycle: z.enum(["monthly", "annually"]),
    domainAction: z.enum(["register", "transfer", "existing"]),
    domain: z.string().transform(normaliseDomain).pipe(z.string().regex(domainPattern, "Enter a domain like yourbusiness.co.za.")),
    acceptTerms: z.literal("on", { error: "Please accept the hosting terms." }),
  })
  .refine((v) => v.domainAction === "existing" || Boolean(findTld(v.domain)), {
    path: ["domain"],
    message: `We can register or transfer ${domainTlds.map((t) => t.tld).join(", ")} domains. Choose "I already own this domain" for others.`,
  });

export type FieldErrors = Record<string, string | undefined>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export type FormState = { ok?: boolean; message?: string; errors?: FieldErrors; values?: Record<string, string> } | undefined;
