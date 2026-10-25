import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Globe } from "lucide-react";
import { mainNav, site } from "@/content/site";
import { publishedServices } from "@/content/services";
import { locations } from "@/content/locations";
import { Container } from "@/components/ui/Container";
import { ConsentSettingsButton } from "@/components/layout/ConsentBanner";

const socialLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  googleBusinessProfile: "Google Business Profile",
};

export function Footer() {
  const socials = Object.entries(site.social).filter(([, url]) => Boolean(url));
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-surface-muted text-text-muted" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <Container className="py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Link
              href="/"
              className="inline-flex rounded-md"
              aria-label="Incognito Digital Solutions home"
            >
              <Image
                src={site.logo.src}
                alt={site.logo.alt}
                width={site.logo.width}
                height={site.logo.height}
                sizes="96px"
                className="h-24 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-sm leading-relaxed">
              A South African digital solutions company helping businesses build a stronger online presence through
              websites, SEO, e-commerce, hosting, branding and ongoing support.
            </p>
            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-3">
                {socials.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-ink-500 hover:text-ink-900"
                    >
                      {socialLabels[key] ?? key}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-900">Services</h3>
            <ul className="mt-5 space-y-3">
              {publishedServices.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-ink-900">
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-900">Company</h3>
            <ul className="mt-5 space-y-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-ink-900">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/get-a-quote" className="hover:text-ink-900">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-900">Contact</h3>
            <ul className="mt-5 space-y-4">
              <li>
                <a href={`tel:${site.contact.phoneE164}`} className="group flex items-center gap-3 hover:text-ink-900">
                  <span className="grid size-9 place-items-center rounded-full bg-white text-brand-teal-dark ring-1 ring-line">
                    <Phone className="size-4" aria-hidden="true" />
                  </span>
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="group flex items-center gap-3 break-all hover:text-ink-900">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-brand-teal-dark ring-1 ring-line">
                    <Mail className="size-4" aria-hidden="true" />
                  </span>
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-white text-brand-teal-dark ring-1 ring-line">
                  <Globe className="size-4" aria-hidden="true" />
                </span>
                <Link href="/locations" className="hover:text-ink-900">
                  Serving businesses across South Africa
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <nav aria-labelledby="footer-areas" className="mt-14 border-t border-line pt-8">
          <h3 id="footer-areas" className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-900">
            <Link href="/locations" className="hover:text-brand-teal-dark">
              Areas we serve
            </Link>
          </h3>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {locations.map((l) => (
              <li key={l.slug}>
                <Link href={`/locations/${l.slug}`} className="hover:text-ink-900">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/privacy-policy" className="hover:text-ink-900">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:text-ink-900">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <ConsentSettingsButton />
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
