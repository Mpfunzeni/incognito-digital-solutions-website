/**
 * Central business information. Every page, the footer and the structured
 * data read from here, so contact details stay consistent everywhere.
 * Only add details that are verified (no invented addresses or profiles).
 */
export const site = {
  name: "Incognito Digital Solutions",
  shortName: "Incognito",
  /**
   * Canonical URL. NEXT_PUBLIC_SITE_URL wins; otherwise Vercel's production
   * domain (the custom domain once connected, the vercel.app address before
   * that), so canonicals and the sitemap always point at a site that works.
   */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://www.incognitodigitalsolutions.co.za")
  ).replace(/\/$/, ""),
  locale: "en_ZA",
  description:
    "Incognito Digital Solutions is a South African digital solutions company offering website design and development, mobile and app development, SEO, web hosting and domains, e-commerce, branding and ongoing technical support.",
  tagline: "Digital Solutions That Move Your Business Forward.",
  country: "South Africa",
  areaServed: "South Africa",
  contact: {
    /** Calls only (no WhatsApp on this number). */
    phoneDisplay: "061 316 8967",
    phoneE164: "+27613168967",
    email: "info@incognitodigitalsolutions.co.za",
    /** WhatsApp chat number (messages only). NEXT_PUBLIC_WHATSAPP_NUMBER (digits with country code) overrides it. */
    whatsappDisplay: "084 803 7471",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "27848037471",
  },
  /** Add verified profile URLs only. Empty entries are not rendered. */
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
    googleBusinessProfile: "",
  } as Record<string, string>,
  founder: {
    name: "Tshepo Ramaele",
    role: "Founder & IT enthusiast",
    photo: "/team/tshepo-ramaele.jpg",
  },
  logo: {
    src: "/brand/incognito-logo.png",
    width: 538,
    height: 570,
    alt: "Incognito Digital Solutions",
  },
  ogImage: "/og/og-default.png",
} as const;

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Hosting", href: "/hosting" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path === "/" ? "" : path}`;
}

/** A WhatsApp chat link, optionally with a message already typed for the customer. */
export function whatsappUrl(message = `Hi ${site.name}, I'd like to ask about your services.`) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
