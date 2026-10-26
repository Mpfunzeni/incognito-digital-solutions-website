import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { getLocation, locations } from "@/content/locations";
import { getService, publishedServices } from "@/content/services";
import { formatRand, getServicePricing } from "@/content/service-pricing";
import { site, absoluteUrl, whatsappUrl } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqList } from "@/components/ui/FaqList";
import { Icon, accentClasses } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/locations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};
  return pageMetadata({ title: location.seo.title, description: location.seo.description, path: `/locations/${slug}` });
}

export default async function LocationPage({ params }: PageProps<"/locations/[slug]">) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();

  // Lead with the name people search most (Google Trends), then the other one.
  const lead = location.searchName ?? location.name;
  const other = location.searchName ? location.name : location.alsoKnownAs;
  const name = other ? `${lead} (${other})` : lead;
  const webDesign = getServicePricing("web-design")?.tiers[0];
  const faqs = [
    ...location.faqs,
    ...(webDesign
      ? [
          {
            question: `How much does web design cost in ${lead}?`,
            answer: `Our web design packages start from ${formatRand(webDesign.from)} for a ${webDesign.name} website, and the price is the same wherever you are in South Africa. Choose a package and add-ons on our Web Design page to see an estimate, or request a free tailored quote.`,
          },
        ]
      : []),
  ];
  const quoteHref = "/get-a-quote";
  const focus = location.serviceFocus
    .map((f) => ({ ...f, service: getService(f.service) }))
    .filter((f) => f.service !== undefined);
  const focusSlugs = new Set(focus.map((f) => f.service!.slug));
  const otherServices = publishedServices.filter((s) => !focusSlugs.has(s.slug));
  const nearby = location.nearby.map(getLocation).filter((l) => l !== undefined);
  const url = absoluteUrl(`/locations/${location.slug}`);

  const city = {
    "@type": "City",
    name: location.name,
    ...(location.alsoKnownAs ? { alternateName: location.alsoKnownAs } : {}),
    containedInPlace: { "@type": "AdministrativeArea", name: `${location.province}, South Africa` },
  };
  const localLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}#service-area`,
    name: `${site.name} – ${location.name}`,
    url,
    description: location.seo.description,
    telephone: site.contact.phoneE164,
    email: site.contact.email,
    image: absoluteUrl(site.ogImage),
    logo: absoluteUrl(site.logo.src),
    priceRange: "$$",
    address: { "@type": "PostalAddress", addressCountry: "ZA" },
    areaServed: [city, ...location.areas.map((a) => ({ "@type": "Place", name: `${a}, ${location.name}` }))],
    parentOrganization: { "@id": `${site.url}/#organization` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Digital services in ${location.name}`,
      itemListElement: publishedServices.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, url: absoluteUrl(`/services/${s.slug}`), areaServed: city },
      })),
    },
  };

  return (
    <>
      <PageHero
        eyebrow={location.region}
        title={`Web Design Company in ${name}: Websites, SEO and Digital Marketing`}
        intro={location.intro}
        crumbs={[
          { name: "Areas We Serve", path: "/locations" },
          { name: location.name, path: `/locations/${location.slug}` },
        ]}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={quoteHref} size="lg" track={`cta_quote_location_hero_${location.slug}`}>
            Get a Quote <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href={`tel:${site.contact.phoneE164}`} size="lg" variant="outline-light">
            Call {site.contact.phoneDisplay}
          </ButtonLink>
          <a
            href={whatsappUrl(`Hi ${site.name}, I'm in ${location.name} and I'd like to ask about your services.`)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("outline-light", "lg")}
            data-track={`whatsapp_location_${location.slug}`}
          >
            WhatsApp us
          </a>
        </div>
      </PageHero>

      {/* Local market */}
      <section aria-labelledby="local-market" className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <SectionHeading
              id="local-market"
              eyebrow={`Doing business in ${location.name}`}
              title={`Helping ${location.name} businesses grow online`}
            />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-text-muted">
              {location.market.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="lg:pt-10">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface-muted p-6">
              <h2 className="flex items-center gap-2 font-sans text-base font-bold tracking-normal text-ink-900">
                <MapPin className="size-5 text-[#0a7c78]" aria-hidden="true" /> Areas we cover in and around {location.name}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {location.areas.map((a) => (
                  <li key={a} className="rounded-full border border-line bg-white px-3 py-1 text-sm text-ink-700">
                    {a}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-text-muted">
                We work remotely by phone, email and video call, so businesses anywhere in {location.province} get the
                same service.
              </p>
            </div>
          </aside>
        </Container>
      </section>

      {/* Industries */}
      <section aria-labelledby="industries" className="bg-surface-muted py-20 sm:py-24">
        <Container>
          <SectionHeading
            id="industries"
            eyebrow="Who we help"
            title={`Built for ${location.name}'s key industries`}
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2">
            {location.industries.map((ind) => (
              <li key={ind.title} className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)]">
                <h3 className="flex items-start gap-2.5 text-lg font-bold text-ink-900">
                  <Check className="mt-1 size-5 shrink-0 text-[#0a7c78]" aria-hidden="true" />
                  {ind.title}
                </h3>
                <p className="mt-2 leading-relaxed text-text-muted">{ind.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Services */}
      <section aria-labelledby="local-services" className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            id="local-services"
            eyebrow="Services"
            title={`Web design and digital marketing services in ${lead}`}
            description="The services local businesses ask us for most, plus everything else you need to grow online."
          />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {focus.map(({ service: s, text }) => {
              const a = accentClasses[s!.accent];
              return (
                <li key={s!.slug}>
                  <Link
                    href={`/services/${s!.slug}`}
                    className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <span className={`grid size-11 place-items-center rounded-xl ${a.bg} ${a.text}`}>
                      <Icon name={s!.icon} className="size-5" />
                    </span>
                    <span className="mt-4 flex items-center gap-1.5 text-lg font-bold text-ink-900">
                      {s!.shortTitle} in {lead}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                    <span className="mt-2 leading-relaxed text-text-muted">{text}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="mt-8 flex flex-wrap gap-3">
            {otherServices.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-700 hover:border-ink-500 hover:text-ink-900"
                >
                  <Icon name={s.icon} className="size-4" />
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* FAQs */}
      <section aria-labelledby="location-faq" className="border-t border-line py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="location-faq" eyebrow="FAQ" title={`Questions from ${location.name} businesses`} />
          <FaqList faqs={faqs} />
        </Container>
      </section>

      {/* Nearby */}
      {nearby.length > 0 && (
        <section aria-labelledby="nearby" className="border-t border-line bg-surface-muted py-16">
          <Container>
            <h2 id="nearby" className="text-2xl font-bold text-ink-900">
              We also work with businesses in
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {nearby.map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/locations/${l.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-medium text-ink-700 hover:border-ink-500 hover:text-ink-900"
                  >
                    <MapPin className="size-4" aria-hidden="true" /> {l.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/locations" className="inline-flex items-center gap-1.5 px-2 py-2 font-semibold text-brand-teal-dark hover:underline">
                  All areas <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </Container>
        </section>
      )}

      <CtaBanner
        title={`Ready to grow your ${location.name} business online?`}
        description="Tell us about your business and goals, and we will recommend the right approach with a clear quotation."
        primary={{ label: "Get a Quote", href: quoteHref }}
      />
      <JsonLd data={[localLd, faqJsonLd(faqs)]} />
    </>
  );
}
