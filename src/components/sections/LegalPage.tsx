import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "./PageHero";

export function LegalPage({
  title,
  path,
  updated,
  intro,
  children,
}: {
  title: string;
  path: string;
  updated: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero title={title} intro={intro} crumbs={[{ name: title, path }]}>
        <p className="mt-4 text-sm text-slate-400">Last updated: {updated}</p>
      </PageHero>
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="prose-article">{children}</div>
        </Container>
      </section>
    </>
  );
}
