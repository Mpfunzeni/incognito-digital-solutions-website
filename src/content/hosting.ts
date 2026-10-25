/**
 * Web hosting plans and domain prices sold through the online hosting system.
 * Amounts are in South African Rand (ZAR), whole rand. Change prices and
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
    tagline: "A single website or landing page for a new business.",
    monthly: 99,
    annually: 990,
    whmPackage: "incognito_starter",
    specs: { storage: "5 GB NVMe SSD", websites: "1 website", email: "5 email accounts", bandwidth: "Unmetered", backups: "Weekly backups" },
    features: ["Free SSL certificate", "cPanel control panel", "1-click WordPress install", "Email support"],
  },
  {
    id: "business",
    name: "Business",
    tagline: "The best fit for most small business websites.",
    monthly: 199,
    annually: 1990,
    highlighted: true,
    freeDomainOnAnnual: true,
    whmPackage: "incognito_business",
    specs: { storage: "20 GB NVMe SSD", websites: "3 websites", email: "25 email accounts", bandwidth: "Unmetered", backups: "Daily backups" },
    features: ["Free SSL certificates", "cPanel control panel", "1-click WordPress install", "Malware scanning", "Email and phone support"],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Busy websites, online stores and growing teams.",
    monthly: 349,
    annually: 3490,
    freeDomainOnAnnual: true,
    whmPackage: "incognito_professional",
    specs: { storage: "50 GB NVMe SSD", websites: "10 websites", email: "Unlimited email accounts", bandwidth: "Unmetered", backups: "Daily backups" },
    features: ["Free SSL certificates", "Staging site", "Malware scanning and removal", "Priority support", "Free website migration"],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    tagline: "Extra resources for WooCommerce and online stores.",
    monthly: 549,
    annually: 5490,
    freeDomainOnAnnual: true,
    whmPackage: "incognito_ecommerce",
    specs: { storage: "100 GB NVMe SSD", websites: "Unlimited websites", email: "Unlimited email accounts", bandwidth: "Unmetered", backups: "Daily backups, 30-day history" },
    features: ["Free SSL certificates", "Staging site", "Extra CPU and memory", "Malware scanning and removal", "Priority support", "Free website migration"],
  },
];

export type DomainAction = "register" | "transfer" | "existing";

export type DomainTld = { tld: string; register: number; transfer: number };

/** Yearly prices per extension. */
export const domainTlds: DomainTld[] = [
  { tld: ".co.za", register: 99, transfer: 99 },
  { tld: ".org.za", register: 99, transfer: 99 },
  { tld: ".com", register: 249, transfer: 249 },
  { tld: ".net", register: 279, transfer: 279 },
  { tld: ".africa", register: 199, transfer: 199 },
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
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
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
