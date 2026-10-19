import { Compass, HeartHandshake, Lightbulb, ShieldCheck } from "lucide-react";
import { site } from "@/content/site";
import { processSteps } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CtaBanner } from "@/components/sections/CtaBanner";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Incognito Digital Solutions is a South African digital solutions company helping businesses build a stronger online presence with websites, SEO, hosting, e-commerce and branding.",
  path: "/about",
});

const values = [
  { icon: Compass, title: "Clarity", description: "Plain-language advice and clear quotations, so you can make informed decisions." },
  { icon: Lightbulb, title: "Practicality", description: "Solutions sized for where your business is now, with room to grow." },
  { icon: ShieldCheck, title: "Honesty", description: "No inflated promises or guaranteed rankings. We tell you what is realistic." },
  { icon: HeartHandshake, title: "Partnership", description: "Support that continues after launch, with one team you can call." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A digital partner for growing businesses"
        intro={`${site.name} is a South African digital solutions company. We help businesses establish and grow their online presence through websites, search visibility, e-commerce, hosting and branding.`}
        crumbs={[{ name: "About Us", path: "/about" }]}
      />
      <section aria-labelledby="story" className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading id="story" eyebrow="What we do" title="Integrated digital services, one point of contact" />
          <div className="space-y-5 text-lg leading-relaxed text-text-muted">
            <p>
              Running a business leaves little time to manage designers, developers, hosting companies and marketing
              specialists separately. We bring these services together so your website, domain, search visibility and
              branding are planned as one.
            </p>
            <p>
              Our work covers <AboutLink href="/services/web-design">website design and development</AboutLink>,{" "}
              <AboutLink href="/services/seo">search engine optimisation</AboutLink>,{" "}
              <AboutLink href="/services/web-hosting-domains">hosting and domains</AboutLink>,{" "}
              <AboutLink href="/services/ecommerce-development">e-commerce</AboutLink>,{" "}
              <AboutLink href="/services/branding">branding</AboutLink> and{" "}
              <AboutLink href="/services/maintenance">ongoing technical support</AboutLink>. Whether you are launching a
              new business or improving an existing website, we focus on solutions that help customers find you, trust
              you and get in touch.
            </p>
          </div>
        </Container>
      </section>
      <section aria-labelledby="values" className="bg-surface-muted py-20 sm:py-24">
        <Container>
          <SectionHeading id="values" align="center" eyebrow="Our approach" title="How we work with clients" />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <li key={v.title} className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)]">
                <span className="grid size-11 place-items-center rounded-xl bg-ink-900 text-brand-teal">
                  <v.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink-900">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-text-muted">{v.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section aria-labelledby="about-process" className="on-dark bg-ink-900 py-20 sm:py-24">
        <Container>
          <SectionHeading id="about-process" tone="dark" eyebrow="Process" title="From first conversation to ongoing support" />
          <div className="mt-12">
            <ProcessSteps steps={processSteps} />
          </div>
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}

function AboutLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-ink-900 underline decoration-brand-teal decoration-2 underline-offset-4">
      {children}
    </Link>
  );
}
