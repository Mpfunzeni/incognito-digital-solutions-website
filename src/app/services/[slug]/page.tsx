import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check, CircleDollarSign, Users } from "lucide-react";
import { getService, publishedServices } from "@/content/services";
import { site, absoluteUrl } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqList } from "@/components/ui/FaqList";
import { Icon, accentClasses } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({ title: service.seo.title, description: service.seo.description, path: `/services/${slug}` });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const a = accentClasses[service.accent];
  const related = service.related.map(getService).filter((s) => s !== undefined);
  const quoteHref = `/get-a-quote?service=${encodeURIComponent(service.title)}`;

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.shortTitle,
    description: service.seo.description,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": `${site.url}/#organization` },
    areaServed: { "@type": "Country", name: site.areaServed },
  };

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.hero.heading}
        intro={service.hero.intro}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.shortTitle, path: `/services/${service.slug}` },
        ]}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={quoteHref} size="lg" track={`cta_quote_service_hero_${service.slug}`}>
            Get a Quote <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="outline-light">
            Talk to us
          </ButtonLink>
        </div>
      </PageHero>

      {/* Overview */}
      <section aria-labelledby="overview" className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <SectionHeading id="overview" eyebrow="Overview" title={`How our ${service.shortTitle} service helps`} />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-text-muted">
              {service.overview.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="space-y-5 lg:pt-10">
            <div className="rounded-[var(--radius-card)] border border-line bg-surface-muted p-6">
              <h2 className="flex items-center gap-2 font-sans text-base font-bold tracking-normal text-ink-900">
                <Users className={`size-5 ${a.text}`} aria-hidden="true" /> Who this is for
              </h2>
              <ul className="mt-4 space-y-3">
                {service.idealFor.map((t) => (
                  <li key={t} className="flex gap-2.5 text-ink-700">
                    <Check className={`mt-0.5 size-4.5 shrink-0 ${a.text}`} aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
              <h2 className="flex items-center gap-2 font-sans text-base font-bold tracking-normal text-ink-900">
                <CircleDollarSign className={`size-5 ${a.text}`} aria-hidden="true" /> What affects the price
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-700 marker:text-text-muted">
                {service.pricingFactors.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <Link
                href={quoteHref}
                data-track={`cta_quote_service_pricing_${service.slug}`}
                className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand-teal-dark hover:underline"
              >
                Request a tailored quote <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </Container>
      </section>

      {/* Deliverables */}
      <section aria-labelledby="deliverables" className="bg-surface-muted py-20 sm:py-24">
        <Container>
          <SectionHeading
            id="deliverables"
            eyebrow="What's included"
            title="Benefits and deliverables"
            description="The exact scope is confirmed in your quotation. These are the core elements of the service."
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.deliverables.map((d) => (
              <li key={d.title} className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)]">
                <span className={`grid size-10 place-items-center rounded-lg ${a.bg} ${a.text}`}>
                  <Icon name={service.icon} className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink-900">{d.title}</h3>
                <p className="mt-2 leading-relaxed text-text-muted">{d.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Process */}
      <section aria-labelledby="process" className="on-dark bg-ink-900 py-20 sm:py-24">
        <Container>
          <SectionHeading id="process" tone="dark" eyebrow="Process" title="How the work is done" />
          <div className="mt-12">
            <ProcessSteps steps={service.process} />
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <section aria-labelledby="service-faq" className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="service-faq" eyebrow="FAQ" title={`${service.shortTitle} questions`} />
          <FaqList faqs={service.faqs} />
        </Container>
      </section>

      {/* Related */}
      <section aria-labelledby="related" className="border-t border-line bg-surface-muted py-20">
        <Container>
          <SectionHeading id="related" eyebrow="Related services" title="Services that work well together" />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/services/${r.slug}`}
                  className="group flex h-full items-start gap-4 rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
                >
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${accentClasses[r.accent].bg} ${accentClasses[r.accent].text}`}>
                    <Icon name={r.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="flex items-center gap-1.5 font-bold text-ink-900">
                      {r.title}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                    <span className="mt-1.5 block text-[0.95rem] leading-relaxed text-text-muted">{r.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBanner
        title={`Ready to get started with ${service.shortTitle}?`}
        description="Tell us about your business and goals, and we will recommend the right approach with a clear quotation."
        primary={{ label: "Get a Quote", href: quoteHref }}
      />
      <JsonLd data={[serviceLd, faqJsonLd(service.faqs)]} />
    </>
  );
}
