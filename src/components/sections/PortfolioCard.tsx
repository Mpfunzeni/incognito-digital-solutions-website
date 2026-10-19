import { ExternalLink } from "lucide-react";
import type { PortfolioItem } from "@/content/portfolio";
import { PortfolioThumb } from "./PortfolioThumb";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
          <PortfolioThumb item={item} />
        </div>
        {item.isDemo && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-900">
            Demo concept
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-medium text-text-muted">{item.client}</p>
        <h3 className="mt-1 text-lg font-bold text-ink-900">{item.title}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-text-muted">{item.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Services delivered">
          {item.services.map((s) => (
            <li key={s} className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-ink-700">
              {s}
            </li>
          ))}
        </ul>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal-dark hover:underline"
          >
            Visit project <ExternalLink className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
