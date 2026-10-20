/**
 * Central business information. Every page, the footer and the structured
 * data read from here, so contact details stay consistent everywhere.
 * Only add details that are verified (no invented addresses or profiles).
 */
export const site = {
  name: "Incognito Digital Solutions",
  shortName: "Incognito",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.incognitodigitalsolutions.co.za").replace(/\/$/, ""),
  locale: "en_ZA",
  description:
    "Incognito Digital Solutions is a South African digital solutions company offering website design and development, SEO, web hosting and domains, e-commerce, branding and ongoing technical support.",
  tagline: "Digital Solutions That Move Your Business Forward.",
  country: "South Africa",
  areaServed: "South Africa",
  contact: {
    phoneDisplay: "061 316 8967",
    phoneE164: "+27613168967",
    email: "info@incognitodigitalsolutions.co.za",
    /** Set NEXT_PUBLIC_WHATSAPP_NUMBER (digits only, e.g. 27613168967) once the business WhatsApp number is verified. */
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
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
  { label: "Portfolio", href: "/portfolio" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path === "/" ? "" : path}`;
}
