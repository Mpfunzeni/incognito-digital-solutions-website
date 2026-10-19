import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { site } from "@/content/site";
import { publishedServices } from "@/content/services";
import { packages } from "@/content/pricing";
import { portfolio } from "@/content/portfolio";
import { differentiators, homeFaqs, processSteps, valueProps } from "@/content/home";
import { testimonials } from "@/content/testimonials";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { HeroVisual } from "@/components/sections/HeroVisual";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { PricingCard } from "@/components/sections/PricingCard";
import { PortfolioCard } from "@/components/sections/PortfolioCard";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `${site.name} | Websites, SEO, Hosting and Branding`,
  description:
    "South African digital solutions company offering website design and development, SEO, e-commerce, web hosting and domains, branding and ongoing technical support. Request a quote.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* A: Hero */}
      <section className="on-dark relative isolate overflow-hidden bg-ink-900">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(55%_80%_at_85%_20%,rgb(30_221_214/0.22),transparent_60%),radial-gradient(45%_60%_at_5%_90%,rgb(171_120_255/0.18),transparent_60%),radial-gradient(35%_45%_at_40%_0%,rgb(254_103_64/0.12),transparent_60%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(rgb(255_255_255)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          aria-hidden="true"
        />
        <Container className="grid items-center gap-16 py-20 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-slate-200">
              <span className="size-2 rounded-full bg-brand-teal" aria-hidden="true" />
              South African digital solutions company
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl">
              Digital Solutions That{" "}
              <span className="bg-gradient-to-r from-brand-teal via-[#7fe9e4] to-brand-purple bg-clip-text text-transparent">
                Move Your Business
              </span>{" "}
              Forward.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              From high-performing websites and search engine optimisation to e-commerce, hosting and branding,
              Incognito Digital Solutions helps businesses establish a stronger digital presence.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/get-a-quote" size="lg" track="cta_get_quote_hero">
                Get a Quote <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/services" size="lg" variant="outline-light" track="cta_explore_services_hero">
                Explore Our Services
              </ButtonLink>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              {["Websites and e-commerce", "SEO and hosting", "Branding and support"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-brand-teal" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="px-4 motion-safe:animate-fade-up sm:px-8 lg:px-0">
            <HeroVisual />
          </div>
        </Container>
      </section>

      {/* B: Value proposition */}
      <section aria-labelledby="value-heading" className="border-b border-line bg-white py-16 sm:py-20">
        <Container>
          <h2 id="value-heading" className="sr-only">
            What we offer
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {valueProps.map((v) => (
              <li key={v.title}>
                <span className="grid size-11 place-items-center rounded-xl bg-ink-900 text-brand-teal">
                  <Icon name={v.icon} className="size-5" />
                </span>
                <h3 className="mt-4 font-sans text-base font-bold tracking-normal text-ink-900">{v.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-text-muted">{v.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* C: Services */}
      <section id="services" aria-labelledby="services-heading" className="bg-surface-muted py-20 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              id="services-heading"
              eyebrow="Our services"
              title="Everything your business needs to grow online"
              description="Choose a single service or combine them. Every solution is planned around your goals and built to work together."
            />
            <ButtonLink href="/services" variant="ghost" className="self-start md:self-auto">
              View all services <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publishedServices.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </Container>
      </section>

      {/* D: Why choose us */}
      <section aria-labelledby="why-heading" className="py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              id="why-heading"
              eyebrow="Why Incognito"
              title="Why Choose Incognito Digital Solutions?"
              description="We keep things practical: clear advice, honest packages and digital solutions that support real business outcomes."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/about" variant="dark">
                About us
              </ButtonLink>
              <ButtonLink href={`tel:${site.contact.phoneE164}`} variant="ghost">
                <Phone className="size-4" aria-hidden="true" /> {site.contact.phoneDisplay}
              </ButtonLink>
            </div>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {differentiators.map((d, i) => (
              <li key={d.title} className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)]">
                <span
                  className={`block h-1.5 w-10 rounded-full ${["bg-brand-teal", "bg-brand-orange", "bg-brand-pink", "bg-brand-purple"][i % 4]}`}
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-lg font-bold text-ink-900">{d.title}</h3>
                <p className="mt-2 leading-relaxed text-text-muted">{d.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* E: Process */}
      <section aria-labelledby="process-heading" className="on-dark bg-ink-900 py-20 sm:py-28">
        <Container>
          <SectionHeading
            id="process-heading"
            tone="dark"
            align="center"
            eyebrow="How we work"
            title="A clear process from first call to launch"
            description="Four straightforward steps, so you always know what is happening and what comes next."
          />
          <div className="mt-14">
            <ProcessSteps steps={processSteps} />
          </div>
        </Container>
      </section>

      {/* F: Portfolio */}
      <section aria-labelledby="work-heading" className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              id="work-heading"
              eyebrow="Featured work"
              title="The kind of work we deliver"
              description="These are demonstration concepts that illustrate our services. Client case studies will be added here with their permission."
            />
            <ButtonLink href="/portfolio" variant="ghost" className="self-start md:self-auto">
              View portfolio <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {portfolio.slice(0, 3).map((p) => (
              <PortfolioCard key={p.slug} item={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* G: Pricing preview */}
      <section aria-labelledby="pricing-heading" className="bg-surface-muted py-20 sm:py-28">
        <Container>
          <SectionHeading
            id="pricing-heading"
            align="center"
            eyebrow="Packages"
            title="Transparent packages, tailored quotations"
            description="Every business is different, so each package is quoted to your scope. Your quotation lists everything included, plus any recurring fees."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.slice(0, 3).map((p) => (
              <PricingCard key={p.id} pkg={p} />
            ))}
          </div>
          <p className="mt-10 text-center">
            <Link href="/pricing" className="inline-flex items-center gap-1.5 font-semibold text-ink-900 underline-offset-4 hover:underline">
              See all packages, including SEO and hosting <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </p>
        </Container>
      </section>

      {/* H: Testimonials (renders only when approved testimonials exist) */}
      <Testimonials items={testimonials} />

      {/* I: FAQ */}
      <section aria-labelledby="faq-heading" className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            id="faq-heading"
            eyebrow="FAQ"
            title="Frequently asked questions"
            description={
              <>
                Can&apos;t find what you are looking for?{" "}
                <Link href="/contact" className="font-semibold text-brand-teal-dark underline underline-offset-4">
                  Contact us
                </Link>
                .
              </>
            }
          />
          <FaqList faqs={homeFaqs} />
        </Container>
        <JsonLd data={faqJsonLd(homeFaqs)} />
      </section>

      {/* J: Final CTA */}
      <CtaBanner />
    </>
  );
}
