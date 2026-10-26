import "server-only";
import { site } from "@/content/site";

/**
 * Email through any SMTP mailbox (QUOTE_DELIVERY=smtp). Gmail works with no
 * domain or extra service: set SMTP_USER to the Gmail address and SMTP_PASS
 * to a Google "app password". SMTP_HOST and SMTP_PORT default to Gmail
 * (smtp.gmail.com, 465); change them for another provider.
 */

/** QUOTE_DELIVERY, forgiving stray spaces, quotes or capitals typed in Vercel. */
export function deliveryMode(env: Record<string, string | undefined> = process.env) {
  return (env.QUOTE_DELIVERY ?? "").trim().replace(/^["']|["']$/g, "").toLowerCase();
}

export function smtpConfigured(env: Record<string, string | undefined> = process.env) {
  return Boolean(env.SMTP_USER && env.SMTP_PASS);
}

/** The "From" line: SMTP_FROM if set, otherwise the site name and SMTP_USER. */
export function smtpFrom(env: Record<string, string | undefined> = process.env) {
  return env.SMTP_FROM || `${site.name} <${env.SMTP_USER?.trim()}>`;
}

type SmtpMail = {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  from?: string;
  attachments?: { filename: string; content: Uint8Array; contentType?: string }[];
};

async function transport() {
  const { createTransport } = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT || 465);
  return createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER?.trim(), pass: process.env.SMTP_PASS?.replace(/\s+/g, "") },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

export async function sendSmtp(mail: SmtpMail) {
  const info = await (await transport()).sendMail({
    from: mail.from || smtpFrom(),
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    ...(mail.html ? { html: mail.html } : {}),
    ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
    attachments: (mail.attachments ?? []).map((a) => ({
      filename: a.filename,
      content: Buffer.from(a.content),
      contentType: a.contentType ?? "application/pdf",
    })),
  });
  return info.messageId as string | undefined;
}

/** Whether real emails go out (used by the admin page and the health check). */
export function emailDeliveryEnabled(env: Record<string, string | undefined> = process.env) {
  if (deliveryMode(env) === "smtp") return smtpConfigured(env);
  if (deliveryMode(env) === "resend") return Boolean(env.RESEND_API_KEY);
  return false;
}

/** Explains why Gmail would refuse to send, without revealing any settings. */
const hints: Record<string, string> = {
  EAUTH: "Gmail rejected the login. Check SMTP_USER is the full Gmail address and SMTP_PASS is a Google app password (not the normal Gmail password).",
  ETIMEDOUT: "Could not reach the mail server in time.",
  ECONNECTION: "Could not connect to the mail server.",
  EDNS: "The mail server address (SMTP_HOST) could not be found.",
};

/** Logs in to the SMTP server without sending anything. */
export async function checkSmtp(env: Record<string, string | undefined> = process.env) {
  if (deliveryMode(env) !== "smtp") return { ok: false, problem: `QUOTE_DELIVERY is "${env.QUOTE_DELIVERY ?? ""}", it must be "smtp".` };
  if (!env.SMTP_USER) return { ok: false, problem: "SMTP_USER is missing." };
  if (!env.SMTP_PASS) return { ok: false, problem: "SMTP_PASS is missing." };
  try {
    await (await transport()).verify();
    return { ok: true, problem: "" };
  } catch (err) {
    const code = String((err as { code?: string }).code ?? "");
    return { ok: false, problem: hints[code] ?? `The mail server refused the connection (${code || "unknown error"}).` };
  }
}
