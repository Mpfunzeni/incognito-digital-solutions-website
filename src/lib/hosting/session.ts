import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isDatabaseConfigured, query, queryOne } from "./db";
import type { Customer } from "./types";

/**
 * Database-backed sessions. The browser holds a random token in an
 * HttpOnly cookie; the database stores only its SHA-256 hash, so a leaked
 * database cannot be used to log in. Logging out deletes the row.
 */

export const SESSION_COOKIE = "ids_session";
const SESSION_DAYS = 30;

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(customerId: string) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await query("INSERT INTO sessions (token_hash, customer_id, expires_at) VALUES ($1, $2, $3)", [
    hashToken(token),
    customerId,
    expires.toISOString(),
  ]);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(token)]);
  jar.delete(SESSION_COOKIE);
}

/** Logs the customer out everywhere (after a password change or reset). */
export async function destroyAllSessions(customerId: string) {
  await query("DELETE FROM sessions WHERE customer_id = $1", [customerId]);
}

/** The signed-in customer, or null. Cached for the duration of one request. */
export const getCurrentCustomer = cache(async (): Promise<Customer | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !isDatabaseConfigured()) return null;
  return queryOne<Customer>(
    `SELECT c.* FROM sessions s JOIN customers c ON c.id = s.customer_id
     WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [hashToken(token)],
  );
});

/** For pages and actions that need a signed-in customer. */
export async function requireCustomer(next = "/account") {
  const customer = await getCurrentCustomer();
  if (!customer) redirect(`/account/login?next=${encodeURIComponent(next)}`);
  return customer;
}

export function isAdmin(customer: Pick<Customer, "email"> | null) {
  if (!customer) return false;
  const admins = (process.env.HOSTING_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(customer.email.toLowerCase());
}

export async function requireAdmin() {
  const customer = await requireCustomer("/account/admin");
  if (!isAdmin(customer)) redirect("/account");
  return customer;
}

/** Only allow redirects to paths on this site. */
export function safeNext(next: unknown, fallback = "/account") {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
    ? next
    : fallback;
}
