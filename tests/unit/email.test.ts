import { describe, expect, it } from "vitest";
import { buildQuoteEmail, deliverQuote } from "@/lib/email";

const q = {
  fullName: "A <b>User</b>",
  businessName: "",
  email: "a@example.com",
  phone: "",
  service: "SEO",
  budget: "",
  message: "Line one\r\nBcc: injected@example.com <script>",
  contactMethod: "Email",
  consent: true,
  website: "",
  startedAt: 1,
} as never;

describe("quote email", () => {
  it("escapes HTML and keeps the subject on one line", () => {
    const { html, subject } = buildQuoteEmail(q);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;b&gt;User&lt;/b&gt;");
    expect(subject).not.toMatch(/[\r\n]/);
  });

  it("fails (never reports success) when delivery is not configured", async () => {
    delete process.env.QUOTE_DELIVERY;
    const r = await deliverQuote(q);
    expect(r.ok).toBe(false);
  });
});
