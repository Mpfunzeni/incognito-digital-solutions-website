import { createHash } from "node:crypto";

/**
 * PayFast (https://payfast.io) checkout and Instant Transaction Notification
 * (ITN) handling.
 *
 * PAYFAST_MODE: "live" uses www.payfast.co.za with PAYFAST_MERCHANT_ID,
 * PAYFAST_MERCHANT_KEY and PAYFAST_PASSPHRASE. "sandbox" uses
 * sandbox.payfast.co.za and falls back to PayFast's public test merchant, so
 * the whole flow can be tried without an account. Unset hides the button.
 */

export type PayfastConfig = {
  mode: "live" | "sandbox";
  merchantId: string;
  merchantKey: string;
  passphrase: string;
  host: string;
};

const SANDBOX_DEFAULTS = { merchantId: "10000100", merchantKey: "46f0cd694581a", passphrase: "jt7NOE43FZPn" };

export function payfastConfig(): PayfastConfig | null {
  const mode = process.env.PAYFAST_MODE;
  if (mode === "live") {
    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    if (!merchantId || !merchantKey) return null;
    return { mode, merchantId, merchantKey, passphrase: process.env.PAYFAST_PASSPHRASE || "", host: "www.payfast.co.za" };
  }
  if (mode === "sandbox") {
    return {
      mode,
      merchantId: process.env.PAYFAST_MERCHANT_ID || SANDBOX_DEFAULTS.merchantId,
      merchantKey: process.env.PAYFAST_MERCHANT_KEY || SANDBOX_DEFAULTS.merchantKey,
      passphrase: process.env.PAYFAST_MERCHANT_ID ? process.env.PAYFAST_PASSPHRASE || "" : SANDBOX_DEFAULTS.passphrase,
      host: "sandbox.payfast.co.za",
    };
  }
  return null;
}

/** PHP-style urlencode, which PayFast's signature uses (spaces become "+"). */
export function pfEncode(value: string) {
  return encodeURIComponent(value)
    .replace(/[!'()*~]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/%20/g, "+");
}

/** MD5 signature over the fields in the given order, skipping empty values and "signature". */
export function pfSignature(fields: [string, string][], passphrase: string) {
  const pairs = fields.filter(([k, v]) => k !== "signature" && v !== "").map(([k, v]) => `${k}=${pfEncode(v.trim())}`);
  if (passphrase) pairs.push(`passphrase=${pfEncode(passphrase.trim())}`);
  return createHash("md5").update(pairs.join("&")).digest("hex");
}

export type CheckoutInput = {
  invoiceId: string;
  invoiceNumber: string;
  amountCents: number;
  itemName: string;
  customer: { fullName: string; email: string };
  siteUrl: string;
};

/** Hidden form fields (in PayFast's required order) and the form action URL. */
export function buildCheckout(cfg: PayfastConfig, input: CheckoutInput) {
  // Characters whose encoding PayFast's samples disagree on are left out.
  const clean = (v: string) => v.replace(/[!'()*~]/g, "");
  const [first, ...rest] = clean(input.customer.fullName).trim().split(/\s+/);
  const fields: [string, string][] = [
    ["merchant_id", cfg.merchantId],
    ["merchant_key", cfg.merchantKey],
    ["return_url", `${input.siteUrl}/account/invoices/${input.invoiceId}?payment=return`],
    ["cancel_url", `${input.siteUrl}/account/invoices/${input.invoiceId}?payment=cancelled`],
    ["notify_url", `${input.siteUrl}/api/payments/payfast/notify`],
    ["name_first", first.slice(0, 100)],
    ["name_last", rest.join(" ").slice(0, 100)],
    ["email_address", input.customer.email],
    ["m_payment_id", input.invoiceId],
    ["amount", (input.amountCents / 100).toFixed(2)],
    ["item_name", clean(input.itemName).slice(0, 100)],
    ["item_description", `Invoice ${input.invoiceNumber}`],
  ];
  const signature = pfSignature(fields, cfg.passphrase);
  return {
    action: `https://${cfg.host}/eng/process`,
    fields: [...fields.filter(([, v]) => v !== ""), ["signature", signature]] as [string, string][],
  };
}

/** Parses an ITN body, keeping PayFast's field order (needed for the signature). */
export function parseItn(body: string): [string, string][] {
  return body
    .split("&")
    .filter(Boolean)
    .map((pair) => {
      const i = pair.indexOf("=");
      const key = decodeURIComponent((i < 0 ? pair : pair.slice(0, i)).replace(/\+/g, " "));
      const value = i < 0 ? "" : decodeURIComponent(pair.slice(i + 1).replace(/\+/g, " "));
      return [key, value];
    });
}

export function verifyItnSignature(fields: [string, string][], passphrase: string) {
  const received = fields.find(([k]) => k === "signature")?.[1];
  if (!received) return false;
  // ITN signatures include every field PayFast sent, in order, even empty
  // ones. PayFast's own samples differ on encoding !'()*~, so accept both.
  const plainEncode = (v: string) => encodeURIComponent(v).replace(/%20/g, "+");
  return [pfEncode, plainEncode].some((encode) => {
    const pairs = fields.filter(([k]) => k !== "signature").map(([k, v]) => `${k}=${encode(v.trim())}`);
    if (passphrase) pairs.push(`passphrase=${encode(passphrase.trim())}`);
    return createHash("md5").update(pairs.join("&")).digest("hex") === received;
  });
}

/** Asks PayFast to confirm the ITN really came from them. */
export async function confirmWithPayfast(cfg: PayfastConfig, rawBody: string) {
  const res = await fetch(`https://${cfg.host}/eng/query/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: rawBody,
    signal: AbortSignal.timeout(15_000),
  });
  return res.ok && (await res.text()).trim() === "VALID";
}
