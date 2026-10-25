import "server-only";
import { randomBytes } from "node:crypto";

/**
 * Creates hosting accounts on the server once an order is paid.
 *
 * HOSTING_PROVISIONING:
 *  - "whm":    creates the cPanel account automatically through the WHM API
 *              of a cPanel/WHM reseller account (HostAfrica, Afrihost, xneelo
 *              and most other South African resellers use cPanel/WHM).
 *              Needs WHM_HOST (e.g. server1.example.co.za), WHM_USERNAME and
 *              WHM_API_TOKEN (WHM > Manage API Tokens).
 *  - "manual" or unset: nothing is created automatically. The order is
 *              marked "Setting up" and the admin is emailed to create the
 *              account, then marks it active in the admin area.
 */

export function provisioningMode() {
  return process.env.HOSTING_PROVISIONING === "whm" ? "whm" : "manual";
}

type WhmResult = { metadata?: { result?: number; reason?: string }; data?: Record<string, unknown> };

async function whm(fn: string, params: Record<string, string>) {
  const host = process.env.WHM_HOST;
  const user = process.env.WHM_USERNAME;
  const token = process.env.WHM_API_TOKEN;
  if (!host || !user || !token) throw new Error("WHM_HOST, WHM_USERNAME and WHM_API_TOKEN must be set");
  const qs = new URLSearchParams({ "api.version": "1", ...params });
  const res = await fetch(`https://${host}:2087/json-api/${fn}?${qs}`, {
    headers: { Authorization: `whm ${user}:${token}` },
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`WHM ${fn} responded ${res.status}`);
  const body = (await res.json()) as WhmResult;
  if (body.metadata?.result !== 1) throw new Error(`WHM ${fn} failed: ${body.metadata?.reason ?? "unknown error"}`);
  return body.data ?? {};
}

/** cPanel usernames: lowercase letters and digits, start with a letter, max 16 characters. */
export function usernameFromDomain(domain: string, suffix = "") {
  let base = domain.split(".")[0].replace(/[^a-z0-9]/g, "");
  if (!/^[a-z]/.test(base)) base = `u${base}`;
  return (base.slice(0, 16 - suffix.length) + suffix).slice(0, 16);
}

export async function createHostingAccount(input: { domain: string; whmPackage: string; contactEmail: string }) {
  // The customer never needs this password: they open cPanel from their
  // dashboard through a single sign-on link, and can reset it in cPanel.
  const password = `${randomBytes(18).toString("base64url")}9a!`;
  let lastError: unknown;
  for (const suffix of ["", "1", "2", randomBytes(2).toString("hex")]) {
    const username = usernameFromDomain(input.domain, suffix);
    try {
      await whm("createacct", {
        username,
        domain: input.domain,
        plan: input.whmPackage,
        contactemail: input.contactEmail,
        password,
      });
      return { username };
    } catch (err) {
      lastError = err;
      if (!/already exists|is taken|reserved/i.test(String(err))) break;
    }
  }
  throw lastError;
}

/** A one-time cPanel login URL for the customer's dashboard button. */
export async function cpanelLoginUrl(username: string) {
  const data = await whm("create_user_session", { user: username, service: "cpaneld" });
  return String(data.url ?? "");
}

export async function setSuspended(username: string, suspended: boolean, reason = "Overdue invoice") {
  if (suspended) await whm("suspendacct", { user: username, reason });
  else await whm("unsuspendacct", { user: username });
}
