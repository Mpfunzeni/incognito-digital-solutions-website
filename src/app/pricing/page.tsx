import Link from "next/link";
import { packages } from "@/content/pricing";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqList } from "@/components/ui/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { PricingCard } from "@/components/sections/PricingCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Website, SEO and Hosting Packages",
  description:
    "Website, e-commerce, SEO and hosting packages from Incognito Digital Solutions. See what each package includes, any recurring fees, and request a tailored quotation.",
  path: "/pricing",
});

const pricingFaqs = [
  {
    question: "Why don't you list fixed prices?",
    answer:
      "Projects vary widely in scope. Rather than a one-size price that may not fit, we quote each project based on what you actually need, and list every once-off and recurring cost clearly.",
  },
  {
    question: "Which costs are recurring?",
    answer:
      "Domain registration, hosting, platform subscriptions, payment provider fees and maintenance plans are recurring. Design and development work is normally a once-off cost. Your quotation separates the two.",
  },
  {
    question: "Can I combine packages?",
    answer:
      "Yes. Many clients combine a website with hosting and maintenance, or add SEO after launch. We can quote a combined solution.",
  },
  {
    question: "Is a deposit required?",
    answer:
      "Payment terms are set out in your quotation and agreement before any work begins.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Packages built around your business"
        intro="Every package is quoted to your requirements. Here is what each one includes, what it does not, and which costs recur, so you can compare options with confidence."
        crumbs={[{ name: "Pricing", path: "/pricing" }]}
      />
      <section aria-label="Packages" className="bg-surface-muted py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((p) => (
              <PricingCard key={p.id} pkg={p} />
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-text-muted">
            All quotations are in South African Rand. Third-party fees, such as domain registry, platform and payment
            provider fees, are charged by those providers and are listed separately. Not sure which package fits?{" "}
            <Link href="/contact" className="font-semibold text-brand-teal-dark underline underline-offset-2">
              Ask us
            </Link>
            .
          </p>
        </Container>
      </section>
      <section aria-labelledby="pricing-faq" className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="pricing-faq" eyebrow="FAQ" title="Pricing and quotations" />
          <FaqList faqs={pricingFaqs} />
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
