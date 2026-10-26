"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { site } from "@/content/site";
import { query, queryOne, isDatabaseConfigured } from "@/lib/hosting/db";
import { appUrl, sendMail } from "@/lib/hosting/mailer";
import { DUMMY_HASH, hashPassword, verifyPassword } from "@/lib/hosting/password";
import { cpanelLoginUrl, provisioningMode } from "@/lib/hosting/provisioning";
import {
  createSession,
  destroyAllSessions,
  destroySession,
  hashToken,
  requireAdmin,
  requireCustomer,
  safeNext,
} from "@/lib/hosting/session";
import {
  cancelInvoice,
  createCustomer,
  createRenewalInvoices,
  emailInvoice,
  findCustomerByEmail,
  getService,
  markInvoicePaid,
  placeOrder,
  setPasswordHash,
  setServiceStatus,
  updateProfile,
} from "@/lib/hosting/store";
import {
  changePasswordSchema,
  fieldErrors,
  loginSchema,
  orderSchema,
  profileSchema,
  resetPasswordSchema,
  signUpSchema,
  type FormState,
} from "@/lib/hosting/validation";
import { createRateLimiter } from "@/lib/rate-limit";
import type { ServiceStatus } from "@/lib/hosting/types";

const authLimiter = createRateLimiter({ limit: 10, windowMs: 15 * 60 * 1000 });
const NOT_READY = `Online accounts are not available yet. Please call ${site.contact.phoneDisplay} or email ${site.contact.email}.`;

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

async function rateLimited(scope: string) {
  return !authLimiter(`${scope}:${await clientIp()}`).allowed;
}

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

function echo(formData: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((k) => [k, str(formData, k)]));
}

// --- Sign up, log in, log out -------------------------------------------------

export async function signUpAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = echo(formData, ["fullName", "email", "phone", "company"]);
  if (!isDatabaseConfigured()) return { message: NOT_READY, values };
  if (await rateLimited("signup")) return { message: "Too many attempts. Please try again in a few minutes.", values };

  const parsed = signUpSchema.safeParse({ ...values, password: str(formData, "password"), acceptTerms: formData.get("acceptTerms") ?? undefined });
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const d = parsed.data;

  const customer = await createCustomer({
    email: d.email,
    passwordHash: await hashPassword(d.password),
    fullName: d.fullName,
    phone: d.phone,
    company: d.company,
  });
  if (!customer) {
    return { errors: { email: "An account with this email already exists. Log in or reset your password instead." }, values };
  }
  await createSession(customer.id);
  await sendMail({
    to: customer.email,
    subject: `Welcome to ${site.name}`,
    text: `Hi ${customer.full_name},\n\nYour ${site.name} account is ready. Manage your hosting, invoices and profile at ${appUrl("/account")}.\n\n${site.name}\n${site.contact.phoneDisplay}`,
  });
  redirect(safeNext(str(formData, "next")));
}

export async function logInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = echo(formData, ["email"]);
  if (!isDatabaseConfigured()) return { message: NOT_READY, values };
  if (await rateLimited("login")) return { message: "Too many attempts. Please try again in a few minutes.", values };

  const parsed = loginSchema.safeParse({ email: values.email, password: str(formData, "password") });
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const customer = await findCustomerByEmail(parsed.data.email);
  // Always run a hash comparison so response time does not reveal which emails exist.
  const ok = await verifyPassword(parsed.data.password, customer?.password_hash ?? DUMMY_HASH);
  if (!customer || !ok) return { message: "That email and password do not match an account.", values };

  await createSession(customer.id);
  redirect(safeNext(str(formData, "next")));
}

export async function logOutAction() {
  await destroySession();
  redirect("/account/login?loggedOut=1");
}

// --- Password reset -----------------------------------------------------------------

export async function requestResetAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = echo(formData, ["email"]);
  if (!isDatabaseConfigured()) return { message: NOT_READY, values };
  if (await rateLimited("reset")) return { message: "Too many attempts. Please try again in a few minutes.", values };
  const parsed = loginSchema.pick({ email: true }).safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const customer = await findCustomerByEmail(parsed.data.email);
  if (customer) {
    const token = randomBytes(32).toString("base64url");
    await query("INSERT INTO password_resets (token_hash, customer_id, expires_at) VALUES ($1, $2, now() + interval '1 hour')", [
      hashToken(token),
      customer.id,
    ]);
    await sendMail({
      to: customer.email,
      subject: `Reset your ${site.name} password`,
      text: `Hi ${customer.full_name},\n\nUse this link within one hour to choose a new password:\n${appUrl(`/account/reset-password?token=${token}`)}\n\nIf you did not ask for this, ignore this email; your password stays the same.\n\n${site.name}`,
    });
  }
  return { ok: true, message: "If an account exists for that email, we have sent a link to reset the password. Check your inbox and spam folder." };
}

export async function resetPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isDatabaseConfigured()) return { message: NOT_READY };
  const parsed = resetPasswordSchema.safeParse({
    token: str(formData, "token"),
    newPassword: str(formData, "newPassword"),
    confirmPassword: str(formData, "confirmPassword"),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const reset = await queryOne<{ customer_id: string }>(
    `UPDATE password_resets SET used_at = now()
     WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now() RETURNING customer_id`,
    [hashToken(parsed.data.token)],
  );
  if (!reset) return { message: "This reset link has expired or was already used. Please request a new one." };
  await setPasswordHash(reset.customer_id, await hashPassword(parsed.data.newPassword));
  await destroyAllSessions(reset.customer_id);
  await createSession(reset.customer_id);
  redirect("/account?passwordReset=1");
}

// --- Profile -------------------------------------------------------------------------

const profileKeys = ["fullName", "phone", "company", "addressLine1", "addressLine2", "city", "province", "postalCode", "vatNumber"];

export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const customer = await requireCustomer("/account/profile");
  const values = echo(formData, profileKeys);
  const parsed = profileSchema.safeParse({ ...values, marketingOptIn: formData.get("marketingOptIn") === "on" });
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  await updateProfile(customer.id, parsed.data);
  return { ok: true, message: "Your profile has been saved.", values };
}

export async function changePasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const customer = await requireCustomer("/account/profile");
  if (await rateLimited("password")) return { message: "Too many attempts. Please try again in a few minutes." };
  const parsed = changePasswordSchema.safeParse({
    currentPassword: str(formData, "currentPassword"),
    newPassword: str(formData, "newPassword"),
    confirmPassword: str(formData, "confirmPassword"),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  if (!(await verifyPassword(parsed.data.currentPassword, customer.password_hash))) {
    return { errors: { currentPassword: "Your current password is not correct." } };
  }
  await setPasswordHash(customer.id, await hashPassword(parsed.data.newPassword));
  // Sign out other devices, keep this one signed in.
  await destroyAllSessions(customer.id);
  await createSession(customer.id);
  return { ok: true, message: "Your password has been changed. Other devices have been signed out." };
}

// --- Orders --------------------------------------------------------------------------

export async function placeOrderAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = echo(formData, ["planId", "cycle", "domainAction", "domain"]);
  const customer = await requireCustomer(`/hosting/order?plan=${encodeURIComponent(values.planId)}&cycle=${encodeURIComponent(values.cycle)}`);
  const parsed = orderSchema.safeParse({ ...values, acceptTerms: formData.get("acceptTerms") ?? undefined });
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const invoice = await placeOrder(customer, parsed.data);
  redirect(`/account/invoices/${invoice.id}?ordered=1`);
}

export async function openCpanelAction(formData: FormData) {
  const customer = await requireCustomer();
  const service = await getService(customer.id, str(formData, "serviceId"));
  if (!service || service.status !== "active" || !service.username || provisioningMode() !== "whm") redirect("/account/services");
  let url = "";
  try {
    url = await cpanelLoginUrl(service.username);
  } catch (err) {
    console.error("[hosting] cPanel login failed", err);
  }
  redirect(url || "/account/services?cpanel=unavailable");
}

// --- Admin ----------------------------------------------------------------------------

export async function adminMarkPaidAction(formData: FormData) {
  await requireAdmin();
  const reference = str(formData, "reference").trim().slice(0, 120) || "Recorded by admin";
  await markInvoicePaid(str(formData, "invoiceId"), "eft", reference);
  redirect("/account/admin?done=paid");
}

export async function adminCancelInvoiceAction(formData: FormData) {
  await requireAdmin();
  await cancelInvoice(str(formData, "invoiceId"));
  redirect("/account/admin?done=cancelled");
}

const statuses: ServiceStatus[] = ["pending", "provisioning", "active", "suspended", "cancelled"];

export async function adminUpdateServiceAction(formData: FormData) {
  await requireAdmin();
  const status = str(formData, "status") as ServiceStatus;
  if (!statuses.includes(status)) redirect("/account/admin");
  const username = str(formData, "username").trim().toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16);
  await setServiceStatus(str(formData, "serviceId"), status, username);
  redirect("/account/admin?done=service");
}

export async function adminRunRenewalsAction() {
  await requireAdmin();
  const created = await createRenewalInvoices();
  redirect(`/account/admin?done=renewals&count=${created}`);
}

export async function adminEmailInvoiceAction(formData: FormData) {
  await requireAdmin();
  const sent = await emailInvoice(str(formData, "invoiceId"));
  redirect(`/account/admin?done=${sent ? "emailed" : "email-failed"}`);
}
