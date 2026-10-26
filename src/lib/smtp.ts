import "server-only";
import { site } from "@/content/site";

/**
 * Email through any SMTP mailbox (QUOTE_DELIVERY=smtp). Gmail works with no
 * domain or extra service: set SMTP_USER to the Gmail address and SMTP_PASS
 * to a Google "app password". SMTP_HOST and SMTP_PORT default to Gmail
 * (smtp.gmail.com, 465); change them for another provider.
 */

export function smtpConfigured(env: Record<string, string | undefined> = process.env) {
  return Boolean(env.SMTP_USER && env.SMTP_PASS);
}

/** The "From" line: SMTP_FROM if set, otherwise the site name and SMTP_USER. */
export function smtpFrom(env: Record<string, string | undefined> = process.env) {
  return env.SMTP_FROM || `${site.name} <${env.SMTP_USER}>`;
}

type SmtpMail = { to: string[]; subject: string; text: string; html?: string; replyTo?: string; from?: string };

export async function sendSmtp(mail: SmtpMail) {
  const { createTransport } = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS?.replace(/\s+/g, "") },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  const info = await transport.sendMail({
    from: mail.from || smtpFrom(),
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    ...(mail.html ? { html: mail.html } : {}),
    ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
  });
  return info.messageId as string | undefined;
}

/** Whether real emails go out (used by the admin page and the health check). */
export function emailDeliveryEnabled(env: Record<string, string | undefined> = process.env) {
  if (env.QUOTE_DELIVERY === "smtp") return smtpConfigured(env);
  if (env.QUOTE_DELIVERY === "resend") return Boolean(env.RESEND_API_KEY);
  return false;
}
