import { formatZar } from "@/lib/money";

/**
 * Web hosting plans and domain prices sold through the online hosting system.
 * Amounts are in South African Rand (ZAR), whole rand, excluding VAT. Monthly
 * prices and domain prices match src/content/service-pricing.ts; the yearly
 * price (two months free) is a proposal to confirm. Change prices and
 * features here; the hosting page, order form, invoices and checkout all read
 * from this file.
 *
 * `whmPackage` is the package name on the cPanel/WHM reseller server. It is
 * only used when automatic set-up is switched on (HOSTING_PROVISIONING=whm).
 */

export type BillingCycle = "monthly" | "annually";

export type HostingPlan = {
  id: string;
  name: string;
  tagline: string;
  monthly: number;
  /** Price for 12 months paid upfront. */
  annually: number;
  highlighted?: boolean;
  whmPackage: string;
  specs: { storage: string; websites: string; email: string; bandwidth: string; backups: string };
  features: string[];
  /** A free domain registration on annual billing (first year). */
  freeDomainOnAnnual?: boolean;
};

export const hostingPlans: HostingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Reliable hosting for a small business website.",
    monthly: 99,
    annually: 990,
    whmPackage: "incognito_starter",
    specs: { storage: "10 GB SSD storage", websites: "1 website", email: "2 email mailboxes", bandwidth: "Unmetered bandwidth", backups: "Weekly backups" },
    features: ["Free SSL certificate", "cPanel control panel", "1-click WordPress install"],
  },
  {
    id: "business",
    name: "Business",
    tagline: "More room and faster performance for growing sites.",
    monthly: 199,
    annually: 1990,
    highlighted: true,
    whmPackage: "incognito_business",
    specs: { storage: "30 GB SSD storage", websites: "Up to 3 websites", email: "10 email mailboxes", bandwidth: "Unmetered bandwidth", backups: "Daily backups" },
    features: ["Free SSL certificate", "Uptime monitoring", "cPanel control panel", "1-click WordPress install"],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "High-performance hosting for online stores and busy sites.",
    monthly: 399,
    annually: 3990,
    whmPackage: "incognito_pro",
    specs: { storage: "75 GB SSD storage", websites: "Up to 10 websites", email: "Unlimited email mailboxes", bandwidth: "Unmetered bandwidth", backups: "Daily backups with one-click restore" },
    features: ["Free SSL certificate", "Uptime monitoring", "Priority support", "cPanel control panel"],
  },
];

export type DomainAction = "register" | "transfer" | "existing";

export type DomainTld = { tld: string; register: number; transfer: number };

/** Yearly prices per extension. */
export const domainTlds: DomainTld[] = [
  { tld: ".co.za", register: 150, transfer: 150 },
  { tld: ".com", register: 250, transfer: 250 },
];

export function getPlan(id: string | null | undefined) {
  return hostingPlans.find((p) => p.id === id);
}

export function findTld(domain: string) {
  const d = domain.toLowerCase();
  // Longest match first so ".co.za" wins over a hypothetical ".za".
  return [...domainTlds].sort((a, b) => b.tld.length - a.tld.length).find((t) => d.endsWith(t.tld));
}

/** Savings of annual billing compared with 12 monthly payments. */
export function annualSaving(plan: HostingPlan) {
  return plan.monthly * 12 - plan.annually;
}

export type OrderLine = { description: string; amount: number };

/**
 * Prices an order. Throws on invalid input so a tampered form can never
 * produce a cheaper order: the server always recalculates from this file.
 */
export function priceOrder(input: { planId: string; cycle: BillingCycle; domainAction: DomainAction; domain: string }) {
  const plan = getPlan(input.planId);
  if (!plan) throw new Error("Unknown plan");
  const lines: OrderLine[] = [
    {
      description: `${plan.name} hosting (${input.cycle === "annually" ? "12 months" : "1 month"})`,
      amount: input.cycle === "annually" ? plan.annually : plan.monthly,
    },
  ];
  if (input.domainAction !== "existing") {
    const tld = findTld(input.domain);
    if (!tld) throw new Error("Unsupported domain extension");
    const yearly = input.domainAction === "register" ? tld.register : tld.transfer;
    const free = input.domainAction === "register" && input.cycle === "annually" && plan.freeDomainOnAnnual;
    lines.push({
      description: `Domain ${input.domainAction === "register" ? "registration" : "transfer"}: ${input.domain} (1 year)`,
      amount: yearly,
    });
    if (free) lines.push({ description: "Free domain with annual hosting", amount: -yearly });
  }
  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return { plan, lines, total };
}

export function formatRand(amount: number, fractionDigits = 0) {
  return formatZar(amount, fractionDigits);
}

/**
 * Banking details shown on unpaid invoices for EFT payment. Leave empty to
 * hide the EFT option (customers are then asked to contact you instead).
 */
export const eftDetails = {
  bank: process.env.NEXT_PUBLIC_EFT_BANK || "",
  accountName: process.env.NEXT_PUBLIC_EFT_ACCOUNT_NAME || "",
  accountNumber: process.env.NEXT_PUBLIC_EFT_ACCOUNT_NUMBER || "",
  branchCode: process.env.NEXT_PUBLIC_EFT_BRANCH_CODE || "",
};
