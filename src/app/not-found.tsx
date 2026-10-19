import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Home } from "lucide-react";
import { publishedServices } from "@/content/services";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Hexagon } from "@/components/ui/Hexagon";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-ink-900 py-24 sm:py-32">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_70%_at_80%_20%,rgb(30_221_214/0.22),transparent_60%)]"
        aria-hidden="true"
      />
      <Container className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-teal">Error 404</p>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-6xl">This page could not be found</h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            The page may have moved or the link may be incorrect. Try one of these instead.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" size="lg">
              <Home className="size-4" aria-hidden="true" /> Back to home
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="outline-light">
              Contact us
            </ButtonLink>
          </div>
          <h2 className="mt-12 text-sm font-semibold uppercase tracking-[0.14em] text-white">Popular pages</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {publishedServices.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white">
                  <ArrowRight className="size-3.5 text-brand-teal" aria-hidden="true" /> {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto hidden h-72 w-72 lg:block" aria-hidden="true">
          <Hexagon className="absolute right-0 top-0 w-40 drop-shadow-[0_0_30px_rgb(30_221_214/0.6)]" color="#1eddd6" />
          <Hexagon className="absolute left-10 top-28 w-28 drop-shadow-[0_0_30px_rgb(254_103_64/0.6)]" color="#fe6740" />
          <Hexagon className="absolute bottom-0 right-16 w-24 drop-shadow-[0_0_30px_rgb(171_120_255/0.6)]" color="#ab78ff" />
          <Hexagon className="absolute left-0 top-56 w-16 drop-shadow-[0_0_30px_rgb(255_56_115/0.6)]" color="#ff3873" />
        </div>
      </Container>
    </section>
  );
}
