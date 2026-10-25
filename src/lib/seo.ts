import type { Metadata } from "next";
import { absoluteUrl, site } from "@/content/site";
import { locations } from "@/content/locations";

/**
 * Search engines may index the site only on the live deployment. That is when
 * NEXT_PUBLIC_SITE_ENV is "production", or, if it is unset, when Vercel reports
 * a production deployment. Previews and local builds stay noindex.
 */
export const allowIndexing =
  process.env.NEXT_PUBLIC_SITE_ENV === "production" ||
  (!process.env.NEXT_PUBLIC_SITE_ENV && process.env.NEXT_PUBLIC_VERCEL_ENV === "production");

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
};

/** Builds consistent per-page metadata: title, description, canonical, Open Graph and Twitter. */
export function pageMetadata({
  title,
  description,
  path,
  image = site.ogImage,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: site.name,
      locale: site.locale,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: absoluteUrl(site.logo.src),
    description: site.description,
    email: site.contact.email,
    telephone: site.contact.phoneE164,
    image: absoluteUrl(site.ogImage),
    priceRange: "$$",
    address: { "@type": "PostalAddress", addressCountry: "ZA" },
    areaServed: [
      { "@type": "Country", name: site.areaServed },
      ...locations.map((l) => ({ "@type": "City", name: l.name, url: absoluteUrl(`/locations/${l.slug}`) })),
    ],
    founder: {
      "@type": "Person",
      name: site.founder.name,
      jobTitle: site.founder.role,
      image: absoluteUrl(site.founder.photo),
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: site.contact.phoneE164,
        email: site.contact.email,
        areaServed: "ZA",
        availableLanguage: ["en"],
      },
    ],
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "en-ZA",
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
