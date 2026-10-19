/**
 * Portfolio entries.
 *
 * IMPORTANT: The entries below are DEMONSTRATION CONCEPTS created to show the
 * kind of work offered. They are not real clients and are labelled as such on
 * the site. Replace them with real projects (with the client's permission) and
 * set `isDemo: false`, a real `client` name and an optional `url`.
 */

export type PortfolioCategory = "Websites" | "E-commerce" | "Branding" | "SEO";

export type PortfolioItem = {
  slug: string;
  title: string;
  client: string;
  isDemo: boolean;
  category: PortfolioCategory;
  services: string[];
  summary: string;
  url?: string;
  /** Visual theme for the generated thumbnail. */
  theme: { from: string; to: string; accent: string; layout: "site" | "store" | "brand" | "chart" };
};

export const portfolio: PortfolioItem[] = [
  {
    slug: "demo-professional-services-site",
    title: "Professional services website",
    client: "Demonstration concept",
    isDemo: true,
    category: "Websites",
    services: ["Web Design", "SEO"],
    summary:
      "A concept site for a consulting practice, with individual service pages, a clear enquiry path and structured data for search.",
    theme: { from: "#0f1f2e", to: "#16293b", accent: "#1eddd6", layout: "site" },
  },
  {
    slug: "demo-boutique-online-store",
    title: "Boutique online store",
    client: "Demonstration concept",
    isDemo: true,
    category: "E-commerce",
    services: ["E-commerce", "Hosting and Domains"],
    summary:
      "A concept store layout with filterable product categories, a mobile-friendly cart and a streamlined checkout flow.",
    theme: { from: "#2a1030", to: "#46163f", accent: "#ff3873", layout: "store" },
  },
  {
    slug: "demo-restaurant-brand-identity",
    title: "Restaurant brand identity",
    client: "Demonstration concept",
    isDemo: true,
    category: "Branding",
    services: ["Branding"],
    summary:
      "A concept identity system covering a logo, colour palette, menu layout and social media templates for a neighbourhood restaurant.",
    theme: { from: "#2e1a10", to: "#4a2614", accent: "#fe6740", layout: "brand" },
  },
  {
    slug: "demo-local-trades-seo",
    title: "Local trades visibility plan",
    client: "Demonstration concept",
    isDemo: true,
    category: "SEO",
    services: ["SEO", "Maintenance"],
    summary:
      "A concept SEO plan for a home-services business: technical fixes, location-aware service pages and Search Console reporting.",
    theme: { from: "#1a1435", to: "#2a2052", accent: "#ab78ff", layout: "chart" },
  },
  {
    slug: "demo-nonprofit-website",
    title: "Non-profit organisation website",
    client: "Demonstration concept",
    isDemo: true,
    category: "Websites",
    services: ["Web Design", "Maintenance"],
    summary:
      "A concept website focused on accessibility, clear programme information, news updates and a simple volunteer enquiry form.",
    theme: { from: "#0d2626", to: "#123a3a", accent: "#1eddd6", layout: "site" },
  },
  {
    slug: "demo-product-launch-store",
    title: "Product launch microstore",
    client: "Demonstration concept",
    isDemo: true,
    category: "E-commerce",
    services: ["E-commerce", "Branding"],
    summary:
      "A concept single-product store with a focused landing page, launch branding and integrated online payments.",
    theme: { from: "#10202e", to: "#1d3247", accent: "#fe6740", layout: "store" },
  },
];

export const portfolioCategories: PortfolioCategory[] = ["Websites", "E-commerce", "Branding", "SEO"];
