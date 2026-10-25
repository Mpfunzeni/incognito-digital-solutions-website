import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Service } from "@/content/services";
import { Icon, accentClasses } from "@/components/ui/Icon";
import { revealDelay } from "@/lib/motion";

export function ServiceCard({
  service,
  headingLevel = "h3",
  revealDelay: step = 0,
}: {
  service: Service;
  headingLevel?: "h2" | "h3";
  revealDelay?: number;
}) {
  const a = accentClasses[service.accent];
  const Heading = headingLevel;
  return (
    <article
      className="glow-card lift reveal group relative flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-7 shadow-[var(--shadow-card)] hover:border-transparent"
      style={revealDelay(step)}
    >
      <span
        className={`grid size-12 place-items-center rounded-xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${a.bg} ${a.text}`}
      >
        <Icon name={service.icon} className="size-6" />
      </span>
      <Heading className="mt-6 text-xl font-bold text-ink-900">{service.title}</Heading>
      <p className="mt-3 leading-relaxed text-text-muted">{service.summary}</p>
      <ul className="mt-5 space-y-2.5 text-[0.95rem] text-ink-700">
        {service.benefits.map((b) => (
          <li key={b} className="flex gap-2.5">
            <Check className={`mt-0.5 size-4.5 shrink-0 ${a.text}`} aria-hidden="true" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-7">
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 font-semibold text-ink-900 after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:content-['']"
        >
          Learn more<span className="sr-only"> about {service.title}</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
        <Link
          href={`/get-a-quote?service=${encodeURIComponent(service.title)}`}
          data-track={`cta_quote_service_card_${service.slug}`}
          className="relative z-10 text-sm font-semibold text-brand-teal-dark underline-offset-4 hover:underline"
        >
          Get a quote<span className="sr-only"> for {service.title}</span>
        </Link>
      </div>
    </article>
  );
}
