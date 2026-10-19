import { Quote } from "lucide-react";
import type { Testimonial } from "@/content/testimonials";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Renders nothing unless approved testimonials are supplied. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-heading" className="py-20 sm:py-28">
      <Container>
        <SectionHeading id="testimonials-heading" align="center" eyebrow="Testimonials" title="What our clients say" />
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <li key={t.name + t.quote.slice(0, 20)}>
              <figure className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-7 shadow-[var(--shadow-card)]">
                <Quote className="size-7 text-brand-teal-dark" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 leading-relaxed text-ink-800">“{t.quote}”</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="block font-semibold text-ink-900">{t.name}</span>
                  {(t.role || t.company) && (
                    <span className="text-text-muted">{[t.role, t.company].filter(Boolean).join(", ")}</span>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
