import { Info } from "lucide-react";
import { portfolio, portfolioCategories } from "@/content/portfolio";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Portfolio",
  description:
    "Examples of the website, e-commerce, branding and SEO work Incognito Digital Solutions delivers. Demonstration concepts are clearly labelled.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  const hasDemos = portfolio.some((p) => p.isDemo);
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Our work"
        intro="A look at the websites, online stores, brand identities and search projects we create for businesses."
        crumbs={[{ name: "Portfolio", path: "/portfolio" }]}
      />
      <section aria-label="Projects" className="py-16 sm:py-20">
        <Container>
          {hasDemos && (
            <p className="mb-10 flex gap-3 rounded-2xl border border-line bg-surface-muted p-4 text-[0.95rem] text-ink-700">
              <Info className="mt-0.5 size-5 shrink-0 text-brand-teal-dark" aria-hidden="true" />
              Projects marked &ldquo;Demo concept&rdquo; are demonstrations created to illustrate our services. They
              are not client projects. Client case studies will be published here with their permission.
            </p>
          )}
          <PortfolioGrid items={portfolio} categories={portfolioCategories} />
        </Container>
      </section>
      <CtaBanner title="Could your business be next?" description="Tell us about your project and we will show you what is possible." />
    </>
  );
}
