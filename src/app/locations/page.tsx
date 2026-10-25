import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { locationsByProvince, locations } from "@/content/locations";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { absoluteUrl } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Areas We Serve: Web Design and SEO Across South Africa",
  description:
    "Incognito Digital Solutions works with businesses in Johannesburg, Sandton, Pretoria, Cape Town, Durban, Umhlanga, Gqeberha, Bloemfontein, Polokwane, Mbombela and more.",
  path: "/locations",
});

export default function LocationsPage() {
  const groups = locationsByProvince();
  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Areas we serve",
    itemListElement: locations.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Digital services in ${l.name}`,
      url: absoluteUrl(`/locations/${l.slug}`),
    })),
  };

  return (
    <>
      <PageHero
        eyebrow="Areas we serve"
        title="Digital solutions for businesses across South Africa"
        intro="We work remotely with businesses in every province. Choose your city to see how we help local businesses get found online and win more customers."
        crumbs={[{ name: "Areas We Serve", path: "/locations" }]}
      />
      <section aria-labelledby="cities" className="bg-surface-muted py-20 sm:py-24">
        <Container>
          <SectionHeading
            id="cities"
            eyebrow="Cities"
            title="Find your city"
            description="Website design, SEO, hosting, apps, e-commerce and branding, tailored to your local market."
          />
          <div className="mt-12 space-y-12">
            {groups.map((g) => (
              <div key={g.province}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-700">{g.province}</h3>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={`/locations/${l.slug}`}
                        className="group flex h-full items-start gap-4 rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-teal/15 text-[#0a7c78]">
                          <MapPin className="size-5" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="flex items-center gap-1.5 font-bold text-ink-900">
                            {l.name}
                            {l.alsoKnownAs && <span className="font-normal text-text-muted">({l.alsoKnownAs})</span>}
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                          </span>
                          <span className="mt-1 block text-sm text-text-muted">{l.region}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <CtaBanner
        title="Not in one of these cities?"
        description="We work with businesses anywhere in South Africa. Tell us where you are and what you need."
      />
      <JsonLd data={listLd} />
    </>
  );
}
