import Link from "next/link";
import { Check, HardDrive, LifeBuoy, Lock, MapPin, RefreshCw, Server } from "lucide-react";
import { domainTlds, formatRand, hostingPlans } from "@/content/hosting";
import { absoluteUrl, site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PlanPicker } from "@/components/hosting/PlanPicker";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { buttonClasses } from "@/components/ui/Button";

export const metadata = pageMetadata({
  title: "Web Hosting Plans in South Africa",
  description:
    "Fast, secure cPanel web hosting for South African businesses from R99 a month. Free SSL, business email, daily backups and local support. Order online in minutes.",
  path: "/hosting",
});

const faqs = [
  {
    question: "How quickly is my hosting set up?",
    answer:
      "As soon as your payment is confirmed. Card and Instant EFT payments through PayFast are confirmed within minutes; manual EFT payments are usually confirmed within one business day.",
  },
  {
    question: "Can I move my existing website to you?",
    answer:
      "Yes. Choose \"I already own this domain\" or \"Transfer my domain\" when you order. Professional and E-commerce plans include free website migration, and we can quote migrations on other plans.",
  },
  {
    question: "Is there a contract?",
    answer:
      "No long-term contract. Monthly plans renew each month and yearly plans each year. You can cancel before your next renewal date.",
  },
  {
    question: "Do I get business email?",
    answer:
      "Yes. Every plan includes email accounts on your own domain (for example info@yourbusiness.co.za), with webmail and support for Outlook and phone mail apps.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "Card, Instant EFT and other PayFast payment options online, or a normal bank EFT using your invoice number as the reference.",
  },
  {
    question: "Can I upgrade later?",
    answer: "Yes. Contact us and we will move you to a bigger plan without downtime and adjust your next invoice.",
  },
];

const highlights = [
  { icon: Lock, title: "Free SSL on every site", text: "HTTPS is set up automatically so browsers trust your website." },
  { icon: HardDrive, title: "NVMe SSD storage", text: "Fast storage for quicker page loads and a better Google score." },
  { icon: RefreshCw, title: "Automatic backups", text: "Regular backups you can restore from cPanel when you need them." },
  { icon: Server, title: "cPanel included", text: "The industry-standard control panel for files, email and databases." },
  { icon: LifeBuoy, title: "Local support", text: `Talk to a real person on ${site.contact.phoneDisplay} or by email.` },
  { icon: MapPin, title: "Built for South Africa", text: "Prices in rand, pay by card or EFT, and .co.za domains." },
];

export default function HostingPage() {
  const offers = hostingPlans.map((p) => ({
    "@type": "Offer",
    name: `${p.name} hosting`,
    price: p.monthly,
    priceCurrency: "ZAR",
    url: absoluteUrl(`/hosting/order?plan=${p.id}`),
  }));
  return (
    <>
      <PageHero
        eyebrow="Web hosting"
        title="Fast, secure web hosting for South African businesses"
        intro="Pick a plan, choose your domain and pay online. Your hosting is set up automatically, and you manage everything from your own client area."
        crumbs={[{ name: "Hosting", path: "/hosting" }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#plans" className={buttonClasses("primary", "lg")}>
            See plans and prices
          </a>
          <Link href="/account/login" className={buttonClasses("outline-light", "lg")}>
            Client login
          </Link>
        </div>
      </PageHero>

      <section id="plans" aria-labelledby="plans-heading" className="bg-surface-muted py-20 sm:py-24">
        <Container>
          <SectionHeading
            id="plans-heading"
            align="center"
            eyebrow="Plans"
            title="Choose your hosting plan"
            description="All prices in South African Rand. Pay yearly and get two months free."
          />
          <div className="mt-10">
            <PlanPicker />
          </div>
        </Container>
      </section>

      <section aria-labelledby="included-heading" className="py-20 sm:py-24">
        <Container>
          <SectionHeading id="included-heading" eyebrow="Included" title="Everything a business website needs" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map(({ icon: I, title, text }) => (
              <div key={title} className="reveal rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)]">
                <span className="grid size-11 place-items-center rounded-lg bg-brand-teal/15 text-brand-teal-dark">
                  <I className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink-900">{title}</h3>
                <p className="mt-1.5 text-text-muted">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="compare-heading" className="bg-surface-muted py-20 sm:py-24">
        <Container>
          <SectionHeading id="compare-heading" eyebrow="Compare" title="Compare plans side by side" />
          <div className="mt-10 overflow-x-auto rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
            <table className="w-full min-w-[44rem] text-left text-[0.95rem]">
              <thead className="border-b border-line bg-surface-muted">
                <tr>
                  <th scope="col" className="px-5 py-4 font-semibold text-text-muted">Feature</th>
                  {hostingPlans.map((p) => (
                    <th key={p.id} scope="col" className="px-5 py-4 font-bold text-ink-900">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {(
                  [
                    ["Monthly price", (p) => formatRand(p.monthly)],
                    ["Yearly price", (p) => formatRand(p.annually)],
                    ["Storage", (p) => p.specs.storage],
                    ["Websites", (p) => p.specs.websites],
                    ["Email accounts", (p) => p.specs.email],
                    ["Bandwidth", (p) => p.specs.bandwidth],
                    ["Backups", (p) => p.specs.backups],
                    ["Free domain (yearly billing)", (p) => (p.freeDomainOnAnnual ? "Yes" : "No")],
                  ] as [string, (p: (typeof hostingPlans)[number]) => string][]
                ).map(([label, get]) => (
                  <tr key={label}>
                    <th scope="row" className="px-5 py-3.5 font-medium text-ink-700">
                      {label}
                    </th>
                    {hostingPlans.map((p) => (
                      <td key={p.id} className="px-5 py-3.5 text-ink-900">
                        {get(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section aria-labelledby="domains-heading" className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            id="domains-heading"
            eyebrow="Domains"
            title="Domain names"
            description="Register a new domain or transfer one you already own when you order hosting. Prices are per year."
          />
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
            <table className="w-full text-left text-[0.95rem]">
              <thead className="border-b border-line bg-surface-muted text-text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Extension</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Register</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Transfer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {domainTlds.map((t) => (
                  <tr key={t.tld}>
                    <th scope="row" className="px-5 py-3 font-bold text-ink-900">{t.tld}</th>
                    <td className="px-5 py-3">{formatRand(t.register)}</td>
                    <td className="px-5 py-3">{formatRand(t.transfer)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="flex gap-2 border-t border-line px-5 py-3 text-sm text-text-muted">
              <Check className="mt-0.5 size-4 shrink-0 text-brand-teal-dark" aria-hidden="true" />
              Domains are registered in your name, so you always own your domain.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="hosting-faq" className="bg-surface-muted py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="hosting-faq" eyebrow="FAQ" title="Hosting questions" />
          <FaqList faqs={faqs} />
        </Container>
      </section>
      <CtaBanner />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Web Hosting",
            serviceType: "Web hosting",
            provider: { "@id": `${site.url}/#organization` },
            areaServed: { "@type": "Country", name: site.areaServed },
            url: absoluteUrl("/hosting"),
            offers,
          },
          faqJsonLd(faqs),
        ]}
      />
    </>
  );
}
