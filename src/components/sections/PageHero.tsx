import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Hexagon } from "@/components/ui/Hexagon";
import type { Crumb } from "@/lib/seo";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  crumbs: Crumb[];
  children?: ReactNode;
};

/** Dark hero used at the top of inner pages. Contains the page's single H1. */
export function PageHero({ eyebrow, title, intro, crumbs, children }: Props) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-ink-900 pb-16 pt-10 sm:pb-20 sm:pt-14">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_90%_at_90%_0%,rgb(30_221_214/0.22),transparent_60%),radial-gradient(40%_60%_at_0%_100%,rgb(255_56_115/0.14),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="absolute right-[6%] top-10 -z-10 hidden lg:block" aria-hidden="true">
        <Hexagon className="w-24 opacity-80" color="#1eddd6" />
        <Hexagon className="-ml-10 mt-2 w-14 opacity-80" color="#fe6740" />
        <Hexagon className="ml-6 mt-2 w-12 opacity-70" color="#ab78ff" />
      </div>
      <Container>
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 max-w-3xl motion-safe:animate-fade-up">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-teal">{eyebrow}</p>
          )}
          <h1 className="text-4xl font-bold leading-[1.1] text-white sm:text-5xl">{title}</h1>
          {intro && <div className="mt-5 text-lg leading-relaxed text-slate-300">{intro}</div>}
          {children}
        </div>
      </Container>
    </section>
  );
}
