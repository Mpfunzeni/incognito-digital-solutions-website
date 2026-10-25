import "server-only";

/**
 * Transactional email for the hosting system (welcome, password reset,
 * invoices, payment receipts and admin alerts). Uses the same delivery set-up
 * as the quote form: QUOTE_DELIVERY=resend with RESEND_API_KEY, or "log" in
 * development. Sending never throws; a failed email is logged and the
 * customer's action still completes.
 */

type Mail = { to: string | string[]; subject: string; text: string };

export async function sendMail({ to, subject, text }: Mail) {
  const mode = process.env.QUOTE_DELIVERY;
  const recipients = (Array.isArray(to) ? to : to.split(",")).map((s) => s.trim()).filter(Boolean);
  if (recipients.length === 0) return false;
  const cleanSubject = subject.replace(/[\r\n]+/g, " ").slice(0, 200);

  if (mode === "resend" && process.env.RESEND_API_KEY) {
    const from = process.env.HOSTING_FROM_EMAIL || process.env.QUOTE_FROM_EMAIL;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: recipients, subject: cleanSubject, text }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) console.error(`[hosting-mail] Resend responded ${res.status}`);
      return res.ok;
    } catch (err) {
      console.error("[hosting-mail] send failed", err);
      return false;
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[hosting-mail] (not emailed) To: ${recipients.join(", ")}\nSubject: ${cleanSubject}\n${text}`);
    return true;
  }
  console.error("[hosting-mail] Email is not configured; message not sent:", cleanSubject);
  return false;
}

/** Where order and payment alerts go. */
export function adminEmail() {
  return process.env.HOSTING_ADMIN_EMAILS || process.env.QUOTE_TO_EMAIL || "";
}
