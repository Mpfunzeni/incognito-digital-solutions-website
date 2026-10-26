import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { annualSaving, findTld, getPlan, hostingPlans, priceOrder } from "@/content/hosting";
import { hashPassword, verifyPassword, DUMMY_HASH } from "@/lib/hosting/password";
import { buildCheckout, parseItn, pfEncode, pfSignature, verifyItnSignature } from "@/lib/hosting/payfast";
import { usernameFromDomain } from "@/lib/hosting/provisioning";
import { normaliseDomain, orderSchema, profileSchema, signUpSchema } from "@/lib/hosting/validation";

describe("hosting prices", () => {
  it("prices hosting with an existing domain", () => {
    const { total, lines } = priceOrder({ planId: "starter", cycle: "monthly", domainAction: "existing", domain: "example.com" });
    expect(lines).toHaveLength(1);
    expect(total).toBe(getPlan("starter")!.monthly);
  });

  it("adds a domain registration", () => {
    const monthly = priceOrder({ planId: "business", cycle: "monthly", domainAction: "register", domain: "shop.co.za" });
    expect(monthly.total).toBe(getPlan("business")!.monthly + findTld("shop.co.za")!.register);
    const yearly = priceOrder({ planId: "starter", cycle: "annually", domainAction: "register", domain: "shop.co.za" });
    expect(yearly.total).toBe(getPlan("starter")!.annually + 150);
  });

  it("gives the domain free on yearly billing only for plans that offer it", () => {
    const plan = { ...getPlan("business")!, freeDomainOnAnnual: true };
    hostingPlans.push({ ...plan, id: "promo" });
    try {
      expect(priceOrder({ planId: "promo", cycle: "annually", domainAction: "register", domain: "shop.co.za" }).total).toBe(plan.annually);
      expect(priceOrder({ planId: "promo", cycle: "annually", domainAction: "transfer", domain: "shop.co.za" }).total).toBe(plan.annually + 150);
    } finally {
      hostingPlans.pop();
    }
  });

  it("rejects unknown plans and unsupported extensions", () => {
    expect(() => priceOrder({ planId: "free", cycle: "monthly", domainAction: "existing", domain: "a.com" })).toThrow();
    expect(() => priceOrder({ planId: "starter", cycle: "monthly", domainAction: "register", domain: "a.xyz" })).toThrow();
  });

  it("matches supported extensions and gives a saving for yearly billing", () => {
    expect(findTld("shop.co.za")?.tld).toBe(".co.za");
    expect(findTld("shop.org.za")).toBeUndefined();
    for (const p of hostingPlans) expect(annualSaving(p)).toBeGreaterThan(0);
  });
});

describe("validation", () => {
  it("normalises pasted domains", () => {
    expect(normaliseDomain(" https://www.Example.CO.ZA/about ")).toBe("example.co.za");
  });

  it("validates orders", () => {
    const ok = orderSchema.safeParse({ planId: "starter", cycle: "monthly", domainAction: "register", domain: "www.mybiz.co.za", acceptTerms: "on" });
    expect(ok.success && ok.data.domain).toBe("mybiz.co.za");
    expect(orderSchema.safeParse({ planId: "starter", cycle: "monthly", domainAction: "register", domain: "mybiz.xyz", acceptTerms: "on" }).success).toBe(false);
    expect(orderSchema.safeParse({ planId: "starter", cycle: "monthly", domainAction: "existing", domain: "mybiz.xyz", acceptTerms: "on" }).success).toBe(true);
    expect(orderSchema.safeParse({ planId: "starter", cycle: "monthly", domainAction: "existing", domain: "not a domain", acceptTerms: "on" }).success).toBe(false);
    expect(orderSchema.safeParse({ planId: "starter", cycle: "monthly", domainAction: "existing", domain: "a.com" }).success).toBe(false);
  });

  it("requires a strong enough password and accepted terms on sign up", () => {
    const base = { fullName: "Thandi Mokoena", email: "THANDI@example.com", phone: "", company: "" };
    expect(signUpSchema.safeParse({ ...base, password: "short1", acceptTerms: "on" }).success).toBe(false);
    expect(signUpSchema.safeParse({ ...base, password: "longenough1" }).success).toBe(false);
    const ok = signUpSchema.safeParse({ ...base, password: "longenough1", acceptTerms: "on" });
    expect(ok.success && ok.data.email).toBe("thandi@example.com");
  });

  it("checks SA postal codes and VAT numbers", () => {
    const base = { fullName: "A B", phone: "", company: "", addressLine1: "", addressLine2: "", city: "", province: "", marketingOptIn: false };
    expect(profileSchema.safeParse({ ...base, postalCode: "1911", vatNumber: "4123456789" }).success).toBe(true);
    expect(profileSchema.safeParse({ ...base, postalCode: "191", vatNumber: "" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...base, postalCode: "", vatNumber: "5123456789" }).success).toBe(false);
  });
});

describe("passwords", () => {
  it("hashes and verifies", async () => {
    const hash = await hashPassword("correct horse 1");
    expect(hash).not.toContain("correct");
    expect(await verifyPassword("correct horse 1", hash)).toBe(true);
    expect(await verifyPassword("wrong horse 1", hash)).toBe(false);
    expect(await verifyPassword("anything", DUMMY_HASH)).toBe(false);
    expect(await verifyPassword("anything", "garbage")).toBe(false);
  });
});

describe("PayFast", () => {
  it("encodes like PHP urlencode", () => {
    expect(pfEncode("a b&c/d'e~")).toBe("a+b%26c%2Fd%27e%7E");
  });

  it("signs fields in order, skipping empty values, with the passphrase", () => {
    const sig = pfSignature(
      [
        ["merchant_id", "10000100"],
        ["merchant_key", "46f0cd694581a"],
        ["name_last", ""],
        ["amount", "100.00"],
        ["item_name", "Test Item"],
      ],
      "jt7NOE43FZPn",
    );
    // md5("merchant_id=10000100&merchant_key=46f0cd694581a&amount=100.00&item_name=Test+Item&passphrase=jt7NOE43FZPn")
    expect(sig).toBe(createHash("md5").update("merchant_id=10000100&merchant_key=46f0cd694581a&amount=100.00&item_name=Test+Item&passphrase=jt7NOE43FZPn").digest("hex"));
  });

  it("builds a checkout with a valid signature", () => {
    const cfg = { mode: "sandbox" as const, merchantId: "10000100", merchantKey: "46f0cd694581a", passphrase: "jt7NOE43FZPn", host: "sandbox.payfast.co.za" };
    const { action, fields } = buildCheckout(cfg, {
      invoiceId: "abc",
      invoiceNumber: "INV-1001",
      amountCents: 19900,
      itemName: "Business hosting (1 month)",
      customer: { fullName: "Sipho O'Neil Dube", email: "sipho@example.com" },
      siteUrl: "https://example.co.za",
    });
    expect(action).toBe("https://sandbox.payfast.co.za/eng/process");
    const map = Object.fromEntries(fields);
    expect(map.amount).toBe("199.00");
    expect(map.name_first).toBe("Sipho");
    expect(map.name_last).toBe("ONeil Dube");
    expect(map.notify_url).toBe("https://example.co.za/api/payments/payfast/notify");
    expect(map.signature).toBe(pfSignature(fields, cfg.passphrase));
  });

  it("verifies ITN signatures and rejects tampering", () => {
    const fields: [string, string][] = [
      ["m_payment_id", "abc"],
      ["pf_payment_id", "1089250"],
      ["payment_status", "COMPLETE"],
      ["item_name", "Business hosting"],
      ["item_description", ""],
      ["amount_gross", "199.00"],
      ["merchant_id", "10000100"],
    ];
    const pairs = fields.map(([k, v]) => `${k}=${pfEncode(v)}`);
    const sig = createHash("md5").update(`${pairs.join("&")}&passphrase=secret`).digest("hex");
    const body = `${pairs.join("&")}&signature=${sig}`;
    expect(verifyItnSignature(parseItn(body), "secret")).toBe(true);
    expect(verifyItnSignature(parseItn(body.replace("199.00", "1.00")), "secret")).toBe(false);
    expect(verifyItnSignature(parseItn(body), "other")).toBe(false);
  });
});

describe("provisioning", () => {
  it("makes valid cPanel usernames", () => {
    expect(usernameFromDomain("my-great-business.co.za")).toBe("mygreatbusiness");
    expect(usernameFromDomain("123shop.com")).toBe("u123shop");
    expect(usernameFromDomain("averyveryverylongdomainname.com", "1")).toHaveLength(16);
    expect(usernameFromDomain("averyveryverylongdomainname.com", "1").endsWith("1")).toBe(true);
  });
});

describe("database URL", () => {
  it("finds the connection string under the names Vercel integrations use", async () => {
    const { databaseUrl } = await import("@/lib/hosting/db");
    expect(databaseUrl({ DATABASE_URL: "postgres://a", POSTGRES_URL: "postgres://b" })).toBe("postgres://a");
    expect(databaseUrl({ POSTGRES_URL: "postgres://b" })).toBe("postgres://b");
    expect(
      databaseUrl({ STORAGE_DATABASE_URL_UNPOOLED: "postgres://u", STORAGE_DATABASE_URL: "postgresql://p", OTHER_URL: "https://x" }),
    ).toBe("postgresql://p");
    expect(databaseUrl({ SOME_DATABASE_URL: "mysql://x" })).toBe("");
    expect(databaseUrl({})).toBe("");
  });
});
