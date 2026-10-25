/**
 * Per-service price tiers and add-ons shown in the interactive package picker
 * on each /services/[slug] page and on /pricing. Amounts are starting prices
 * in South African Rand (ZAR), excluding VAT. A selection is passed to the
 * quote form as ?service=…&tier=…&addons=a,b so the enquiry arrives with it.
 */

export type Billing = "once-off" | "monthly" | "yearly";

export type Tier = {
  id: string;
  name: string;
  tagline: string;
  /** Starting price in ZAR. */
  from: number;
  billing: Billing;
  timeline?: string;
  features: string[];
  highlighted?: boolean;
};

export type AddOn = {
  id: string;
  name: string;
  from: number;
  billing: Billing;
};

export type ServicePricing = {
  slug: string;
  tiers: Tier[];
  addOns: AddOn[];
};

export const servicePricing: ServicePricing[] = [
  {
    slug: "web-design",
    tiers: [
      {
        id: "web-starter",
        name: "Starter",
        tagline: "A professional online presence for new and small businesses.",
        from: 4500,
        billing: "once-off",
        timeline: "1 to 2 weeks",
        features: [
          "Up to 5 pages",
          "Responsive design for every screen",
          "Contact form to your inbox",
          "On-page SEO foundations",
          "SSL (HTTPS) set-up",
        ],
      },
      {
        id: "web-business",
        name: "Business",
        tagline: "A larger site built to generate enquiries and grow with you.",
        from: 9500,
        billing: "once-off",
        timeline: "2 to 4 weeks",
        highlighted: true,
        features: [
          "Up to 12 pages",
          "Individual service pages",
          "Quote forms with spam protection",
          "Blog or news section",
          "Analytics and structured data",
          "Speed and accessibility optimisation",
        ],
      },
      {
        id: "web-premium",
        name: "Premium",
        tagline: "A fully custom website with integrations and advanced features.",
        from: 18000,
        billing: "once-off",
        timeline: "4 to 8 weeks",
        features: [
          "Custom design and page count",
          "Bookings, portals or integrations",
          "Content management training",
          "Advanced SEO set-up",
          "Priority launch support",
          "30 days of post-launch changes",
        ],
      },
    ],
    addOns: [
      { id: "copywriting", name: "Professional copywriting (5 pages)", from: 1500, billing: "once-off" },
      { id: "logo", name: "Logo design", from: 1500, billing: "once-off" },
      { id: "gbp", name: "Google Business Profile set-up", from: 950, billing: "once-off" },
      { id: "hosting", name: "Hosting, SSL and backups", from: 149, billing: "monthly" },
    ],
  },
  {
    slug: "mobile-app-development",
    tiers: [
      {
        id: "app-mvp",
        name: "MVP App",
        tagline: "A focused first release to test your idea with real users.",
        from: 45000,
        billing: "once-off",
        timeline: "6 to 10 weeks",
        features: [
          "iOS and Android (cross-platform)",
          "Up to 8 core screens",
          "User sign-up and log-in",
          "Push notifications",
          "Basic analytics",
        ],
      },
      {
        id: "app-business",
        name: "Business App",
        tagline: "A full-featured app connected to your business systems.",
        from: 95000,
        billing: "once-off",
        timeline: "10 to 16 weeks",
        highlighted: true,
        features: [
          "iOS, Android and web app",
          "Custom back end and database",
          "Payments or bookings",
          "Integrations with your systems",
          "Clickable prototype before build",
          "App store publishing",
        ],
      },
      {
        id: "app-enterprise",
        name: "Enterprise",
        tagline: "Complex, multi-platform applications built to scale.",
        from: 180000,
        billing: "once-off",
        timeline: "16 weeks or more",
        features: [
          "Mobile, desktop and web",
          "Role-based access and admin tools",
          "Offline mode and data sync",
          "Security review and load testing",
          "Staged releases",
          "Dedicated project manager",
        ],
      },
    ],
    addOns: [
      { id: "admin-dashboard", name: "Admin dashboard", from: 15000, billing: "once-off" },
      { id: "store-publishing", name: "App store publishing", from: 3500, billing: "once-off" },
      { id: "app-support", name: "App maintenance and updates", from: 2500, billing: "monthly" },
    ],
  },
  {
    slug: "seo",
    tiers: [
      {
        id: "seo-local",
        name: "Local SEO",
        tagline: "Get found by customers searching in your town or city.",
        from: 2500,
        billing: "monthly",
        features: [
          "Google Business Profile optimisation",
          "Local keyword research",
          "On-page optimisation of key pages",
          "Local citations and directories",
          "Monthly report",
        ],
      },
      {
        id: "seo-growth",
        name: "Growth",
        tagline: "Grow traffic and enquiries across several cities or services.",
        from: 4500,
        billing: "monthly",
        highlighted: true,
        features: [
          "Everything in Local SEO",
          "Technical SEO fixes",
          "Location and service landing pages",
          "Two optimised blog articles a month",
          "Google Search Console monitoring",
          "Monthly strategy call",
        ],
      },
      {
        id: "seo-premium",
        name: "Premium",
        tagline: "Nationwide visibility for competitive search terms.",
        from: 8500,
        billing: "monthly",
        features: [
          "Everything in Growth",
          "National keyword targeting",
          "Four articles a month",
          "Link-building outreach",
          "Competitor tracking",
          "Conversion rate recommendations",
        ],
      },
    ],
    addOns: [
      { id: "seo-audit", name: "Once-off technical SEO audit", from: 3500, billing: "once-off" },
      { id: "gbp", name: "Google Business Profile set-up", from: 950, billing: "once-off" },
      { id: "extra-content", name: "Two extra blog articles", from: 1800, billing: "monthly" },
    ],
  },
  {
    slug: "web-hosting-domains",
    tiers: [
      {
        id: "host-starter",
        name: "Starter",
        tagline: "Reliable hosting for a small business website.",
        from: 99,
        billing: "monthly",
        features: ["1 website", "10 GB SSD storage", "Free SSL certificate", "Weekly backups", "2 email mailboxes"],
      },
      {
        id: "host-business",
        name: "Business",
        tagline: "More room and faster performance for growing sites.",
        from: 199,
        billing: "monthly",
        highlighted: true,
        features: [
          "Up to 3 websites",
          "30 GB SSD storage",
          "Free SSL certificate",
          "Daily backups",
          "10 email mailboxes",
          "Uptime monitoring",
        ],
      },
      {
        id: "host-pro",
        name: "Pro",
        tagline: "High-performance hosting for online stores and busy sites.",
        from: 399,
        billing: "monthly",
        features: [
          "Up to 10 websites",
          "75 GB SSD storage",
          "Free SSL certificate",
          "Daily backups with one-click restore",
          "Unlimited email mailboxes",
          "Priority support",
        ],
      },
    ],
    addOns: [
      { id: "domain-coza", name: ".co.za domain registration", from: 150, billing: "yearly" },
      { id: "domain-com", name: ".com domain registration", from: 250, billing: "yearly" },
      { id: "migration", name: "Website migration from another host", from: 750, billing: "once-off" },
    ],
  },
  {
    slug: "ecommerce-development",
    tiers: [
      {
        id: "shop-starter",
        name: "Starter Store",
        tagline: "Start selling online with a clean, secure store.",
        from: 12000,
        billing: "once-off",
        timeline: "3 to 4 weeks",
        features: [
          "Up to 50 products",
          "Cart and secure checkout",
          "PayFast or Yoco integration",
          "Shipping and VAT settings",
          "Order email notifications",
        ],
      },
      {
        id: "shop-growth",
        name: "Growth Store",
        tagline: "A larger store with the tools to grow sales.",
        from: 25000,
        billing: "once-off",
        timeline: "4 to 6 weeks",
        highlighted: true,
        features: [
          "Up to 500 products",
          "Product filters and search",
          "Discount codes and promotions",
          "Courier integration",
          "Customer accounts",
          "Sales analytics",
        ],
      },
      {
        id: "shop-advanced",
        name: "Advanced Store",
        tagline: "Custom features for established and high-volume sellers.",
        from: 45000,
        billing: "once-off",
        timeline: "6 to 10 weeks",
        features: [
          "Unlimited products",
          "Wholesale or subscription pricing",
          "Stock and accounting integrations",
          "Multiple payment gateways",
          "Custom checkout flow",
          "Staff training",
        ],
      },
    ],
    addOns: [
      { id: "product-upload", name: "Product upload (per 50 products)", from: 1500, billing: "once-off" },
      { id: "product-photos", name: "Product photo editing (per 20 photos)", from: 800, billing: "once-off" },
      { id: "store-support", name: "Store maintenance and support", from: 950, billing: "monthly" },
    ],
  },
  {
    slug: "branding",
    tiers: [
      {
        id: "brand-logo",
        name: "Logo Essentials",
        tagline: "A professional logo ready for print and screen.",
        from: 1500,
        billing: "once-off",
        timeline: "1 week",
        features: ["2 logo concepts", "2 rounds of changes", "Colour and mono versions", "Web and print files"],
      },
      {
        id: "brand-identity",
        name: "Brand Identity",
        tagline: "A consistent look across everything your business shares.",
        from: 4500,
        billing: "once-off",
        timeline: "2 weeks",
        highlighted: true,
        features: [
          "3 logo concepts",
          "Colour palette and typography",
          "Business card design",
          "Social media profile kit",
          "One-page brand guide",
        ],
      },
      {
        id: "brand-kit",
        name: "Complete Brand Kit",
        tagline: "A full identity system for established or growing brands.",
        from: 9500,
        billing: "once-off",
        timeline: "3 to 4 weeks",
        features: [
          "Everything in Brand Identity",
          "Letterhead, invoice and email signature",
          "Social media post templates",
          "Presentation template",
          "Full brand guidelines document",
        ],
      },
    ],
    addOns: [
      { id: "flyer", name: "Flyer or poster design", from: 650, billing: "once-off" },
      { id: "social-pack", name: "10 social media post designs", from: 1200, billing: "once-off" },
      { id: "signage", name: "Vehicle or shop signage design", from: 1800, billing: "once-off" },
    ],
  },
  {
    slug: "maintenance",
    tiers: [
      {
        id: "care-basic",
        name: "Basic Care",
        tagline: "Keep your site updated, backed up and secure.",
        from: 450,
        billing: "monthly",
        features: ["Monthly software updates", "Weekly backups", "Uptime monitoring", "30 minutes of content changes"],
      },
      {
        id: "care-standard",
        name: "Standard Care",
        tagline: "Regular updates and support for active businesses.",
        from: 950,
        billing: "monthly",
        highlighted: true,
        features: [
          "Weekly software updates",
          "Daily backups",
          "Security monitoring",
          "2 hours of content changes",
          "Monthly performance report",
        ],
      },
      {
        id: "care-premium",
        name: "Premium Care",
        tagline: "Hands-on support for busy sites and online stores.",
        from: 1950,
        billing: "monthly",
        features: [
          "Everything in Standard Care",
          "5 hours of changes or improvements",
          "Same-day priority support",
          "Speed optimisation",
          "Quarterly SEO health check",
        ],
      },
    ],
    addOns: [
      { id: "extra-hours", name: "Extra support hours (pack of 2)", from: 700, billing: "once-off" },
      { id: "malware-cleanup", name: "Malware clean-up and hardening", from: 1500, billing: "once-off" },
    ],
  },
];

export function getServicePricing(slug: string) {
  return servicePricing.find((p) => p.slug === slug);
}

export const billingLabel: Record<Billing, string> = {
  "once-off": "once-off",
  monthly: "/month",
  yearly: "/year",
};

export function formatRand(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(amount);
}

export type Selection = { pricing: ServicePricing; tier: Tier; addOns: AddOn[] };

/** Sums a selection into separate once-off, monthly and yearly amounts. */
export function selectionTotals(sel: Pick<Selection, "tier" | "addOns">) {
  const totals: Record<Billing, number> = { "once-off": 0, monthly: 0, yearly: 0 };
  for (const item of [sel.tier, ...sel.addOns]) totals[item.billing] += item.from;
  return totals;
}

export function formatTotals(totals: Record<Billing, number>) {
  return (Object.keys(totals) as Billing[])
    .filter((b) => totals[b] > 0)
    .map((b) => `${formatRand(totals[b])}${b === "once-off" ? " once-off" : billingLabel[b]}`)
    .join(" + ");
}

/** Resolves ?tier=…&addons=… from a quote link back into a selection. */
export function resolveSelection(tierId: string | null, addOnIds: string | null): Selection | undefined {
  if (!tierId) return undefined;
  const pricing = servicePricing.find((p) => p.tiers.some((t) => t.id === tierId));
  if (!pricing) return undefined;
  const tier = pricing.tiers.find((t) => t.id === tierId)!;
  const ids = new Set((addOnIds ?? "").split(",").filter(Boolean));
  return { pricing, tier, addOns: pricing.addOns.filter((a) => ids.has(a.id)) };
}

export function describeSelection(sel: Selection) {
  const addOns = sel.addOns.length ? ` + ${sel.addOns.map((a) => a.name).join(", ")}` : "";
  return `${sel.tier.name}${addOns} (estimated from ${formatTotals(selectionTotals(sel))}, excl. VAT)`;
}
