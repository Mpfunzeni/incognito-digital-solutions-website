import "server-only";
import type { QuoteInput } from "./quote-schema";

/**
 * Sends quote notifications. Supported delivery modes (QUOTE_DELIVERY):
 *  - "resend": sends through the Resend HTTP API (RESEND_API_KEY required).
 *  - "log":    development only. Prints the enquiry to the server log and
 *              reports success, so the form can be tested locally.
 * If nothing is configured, delivery fails and the visitor is shown the
 * error state with direct contact details. A success message is never shown
 * for an enquiry that was not delivered.
 */

export type DeliveryResult = { ok: true; id?: string } | { ok: false; reason: "not_configured" | "provider_error" };

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function buildQuoteEmail(q: QuoteInput) {
  const rows: [string, string][] = [
    ["Full name", q.fullName],
    ["Business name", q.businessName || "Not provided"],
    ["Email", q.email],
    ["Phone", q.phone || "Not provided"],
    ["Service required", q.service],
    ["Budget range", q.budget || "Not provided"],
    ["Preferred contact method", q.contactMethod],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nProject description:\n${q.message}\n`;
  const html = `<h2>New quote request</h2><table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><h3>Project description</h3><p style="white-space:pre-wrap">${escapeHtml(q.message)}</p>`;
  const subject = `Quote request: ${q.service} from ${q.fullName}`.replace(/[\r\n]+/g, " ").slice(0, 200);
  return { subject, text, html };
}

export async function deliverQuote(q: QuoteInput): Promise<DeliveryResult> {
  const mode = process.env.QUOTE_DELIVERY;
  const { subject, text, html } = buildQuoteEmail(q);

  if (mode === "log" && process.env.NODE_ENV !== "production") {
    console.info(`[quote] (log mode, not emailed)\nSubject: ${subject}\n${text}`);
    return { ok: true };
  }

  if (mode === "resend") {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.QUOTE_TO_EMAIL;
    const from = process.env.QUOTE_FROM_EMAIL;
    if (!apiKey || !to || !from) {
      console.error("[quote] Resend delivery selected but RESEND_API_KEY, QUOTE_TO_EMAIL or QUOTE_FROM_EMAIL is missing.");
      return { ok: false, reason: "not_configured" };
    }
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), reply_to: q.email, subject, text, html }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        console.error(`[quote] Resend responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
        return { ok: false, reason: "provider_error" };
      }
      const data = (await res.json().catch(() => ({}))) as { id?: string };
      return { ok: true, id: data.id };
    } catch (err) {
      console.error("[quote] Resend request failed", err);
      return { ok: false, reason: "provider_error" };
    }
  }

  console.error("[quote] No delivery method configured. Set QUOTE_DELIVERY (see .env.example).");
  return { ok: false, reason: "not_configured" };
}
