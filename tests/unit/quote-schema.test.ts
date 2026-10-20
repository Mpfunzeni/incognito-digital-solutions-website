import { describe, expect, it } from "vitest";
import { quoteSchema, serviceOptions, toFieldErrors } from "@/lib/quote-schema";

const valid = {
  fullName: "Thandi Nkosi",
  businessName: "",
  email: "thandi@example.co.za",
  phone: "",
  service: serviceOptions[0],
  budget: "",
  message: "We need a new five page website for our bakery.",
  contactMethod: "Email",
  consent: true,
  website: "",
  startedAt: Date.now() - 10_000,
};

describe("quoteSchema", () => {
  it("accepts a valid submission", () => {
    expect(quoteSchema.safeParse(valid).success).toBe(true);
  });

  it("reports field errors for missing required fields", () => {
    const r = quoteSchema.safeParse({ ...valid, fullName: "", email: "nope", message: "short", consent: false });
    expect(r.success).toBe(false);
    if (r.success) return;
    const e = toFieldErrors(r.error);
    expect(e.fullName).toBeTruthy();
    expect(e.email).toBeTruthy();
    expect(e.message).toBeTruthy();
    expect(e.consent).toBeTruthy();
  });

  it("requires a phone number when phone contact is preferred", () => {
    const r = quoteSchema.safeParse({ ...valid, contactMethod: "Phone" });
    expect(r.success).toBe(false);
    if (!r.success) expect(toFieldErrors(r.error).phone).toBeTruthy();
    expect(quoteSchema.safeParse({ ...valid, contactMethod: "Phone", phone: "084 803 7471" }).success).toBe(true);
  });

  it("rejects a filled honeypot and unknown services", () => {
    expect(quoteSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
    expect(quoteSchema.safeParse({ ...valid, service: "Hacking" }).success).toBe(false);
  });
});
