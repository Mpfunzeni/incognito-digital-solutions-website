import { formatZar } from "@/lib/money";

/**
 * Summary packages shown on the homepage. Starting prices mirror the tiers in
 * service-pricing.ts; keep the two in step. A null price renders as
 * "Request a Quote". Amounts are in South African Rand (ZAR), excluding VAT.
 */

export type Price = {
  amount: number;
  prefix?: string;
  suffix?: string;
};

export type Package = {
  id: string;
  name: string;
  description: string;
  price: Price | null;
  recurring?: string;
  features: string[];
  notIncluded?: string[];
  serviceSlug: string;
  highlighted?: boolean;
};

export const packages: Package[] = [
  {
    id: "starter-website",
    name: "Starter Website",
    description: "A professional online presence for new and small businesses.",
    price: { amount: 4500, prefix: "From", suffix: "once-off" },
    features: [
      "Up to 5 pages (e.g. Home, About, Services, Contact)",
      "Responsive design for mobile, tablet and desktop",
      "Contact form delivered to your email",
      "On-page SEO foundations and XML sitemap",
      "SSL (HTTPS) set-up",
      "Launch support",
    ],
    notIncluded: ["Domain and hosting are billed separately", "Copywriting is quoted separately"],
    recurring: "Hosting and domain renewals are recurring.",
    serviceSlug: "web-design",
  },
  {
    id: "business-website",
    name: "Business Website",
    description: "A larger website built to generate enquiries and grow with you.",
    price: { amount: 9500, prefix: "From", suffix: "once-off" },
    highlighted: true,
    features: [
      "Custom page structure for your services",
      "Individual service pages",
      "Quote or enquiry forms with spam protection",
      "Blog or news section",
      "Structured data and analytics set-up",
      "Performance and accessibility optimisation",
    ],
    notIncluded: ["Domain and hosting are billed separately"],
    recurring: "Hosting, domain and optional maintenance are recurring.",
    serviceSlug: "web-design",
  },
  {
    id: "ecommerce-website",
    name: "E-commerce Website",
    description: "An online store with secure checkout and payment integration.",
    price: { amount: 12000, prefix: "From", suffix: "once-off" },
    features: [
      "Product and category pages",
      "Cart and checkout",
      "Payment gateway integration",
      "Shipping and VAT settings",
      "Order email notifications",
      "Training on managing products and orders",
    ],
    notIncluded: ["Payment provider transaction fees are charged by the provider"],
    recurring: "Platform or hosting fees and payment provider fees are recurring.",
    serviceSlug: "ecommerce-development",
  },
  {
    id: "seo-services",
    name: "SEO Services",
    description: "Technical and on-page work to improve search visibility.",
    price: { amount: 2500, prefix: "From", suffix: "/month" },
    features: [
      "Technical SEO audit",
      "Keyword and search intent research",
      "On-page optimisation",
      "Google Search Console set-up",
      "Local SEO guidance",
      "Progress reporting",
    ],
    notIncluded: ["Rankings cannot be guaranteed by any provider"],
    recurring: "Available as a once-off audit or ongoing monthly service.",
    serviceSlug: "seo",
  },
  {
    id: "hosting-maintenance",
    name: "Hosting and Maintenance",
    description: "Reliable hosting with ongoing updates, backups and support.",
    price: { amount: 99, prefix: "From", suffix: "/month" },
    features: [
      "Managed hosting set-up",
      "Domain and SSL management",
      "Software updates and backups",
      "Security and uptime monitoring",
      "Content updates within plan allowance",
      "Technical support",
    ],
    recurring: "Billed on a recurring basis.",
    serviceSlug: "maintenance",
  },
];

export function formatPrice(price: Price) {
  const amount = formatZar(price.amount);
  return [price.prefix, amount].filter(Boolean).join(" ");
}
