import Link from "next/link";
import { publishedServices } from "@/content/services";
import { getServicePricing } from "@/content/service-pricing";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqList } from "@/components/ui/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { PricingExplorer } from "@/components/sections/PricingExplorer";
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
    question: "Are these the final prices?",
    answer:
      "The prices shown are starting prices in South African Rand, excluding VAT. Projects vary in scope, so once you send us your selection we confirm the exact price in a written quotation that lists every once-off and recurring cost.",
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
        title="Packages and prices"
        intro="Choose a service, compare packages, add any extras and see an instant estimate. Send your selection to us and we will confirm a tailored quotation."
        crumbs={[{ name: "Pricing", path: "/pricing" }]}
      />
      <section aria-label="Packages" className="bg-surface-muted py-20 sm:py-24">
        <Container>
          <PricingExplorer
            items={publishedServices
              .filter((svc) => getServicePricing(svc.slug))
              .map(({ slug, title, shortTitle }) => ({ slug, title, shortTitle }))}
          />
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-text-muted">
            All prices are starting prices in South African Rand, excluding VAT. Third-party fees, such as domain registry, platform and payment
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
