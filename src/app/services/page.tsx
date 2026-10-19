import { publishedServices } from "@/content/services";
import { processSteps } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Digital Services for South African Businesses",
  description:
    "Website design and development, SEO, web hosting and domains, e-commerce, branding and website maintenance from Incognito Digital Solutions.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Digital services that work together"
        intro="From your domain name and website to search visibility, online sales and ongoing support, we provide the services businesses need to grow online, under one roof."
        crumbs={[{ name: "Services", path: "/services" }]}
      />
      <section aria-label="All services" className="bg-surface-muted py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publishedServices.map((s) => (
              <ServiceCard key={s.slug} service={s} headingLevel="h2" />
            ))}
          </div>
        </Container>
      </section>
      <section aria-labelledby="services-process" className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            id="services-process"
            align="center"
            eyebrow="How we work"
            title="One process for every project"
            description="Whether it is a new website or a hosting migration, we follow the same clear steps."
          />
          <div className="mt-12">
            <ProcessSteps steps={processSteps} tone="light" />
          </div>
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
