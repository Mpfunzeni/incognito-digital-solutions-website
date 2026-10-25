"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight } from "lucide-react";
import { PackagePicker } from "@/components/sections/PackagePicker";

type Item = { slug: string; title: string; shortTitle: string };

/** Service tabs on /pricing, each showing that service's package picker. */
export function PricingExplorer({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const current = items[active];

  function onKeyDown(e: KeyboardEvent) {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + items.length) % items.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Services"
        onKeyDown={onKeyDown}
        className="flex flex-wrap justify-center gap-2"
      >
        {items.map((item, i) => (
          <button
            key={item.slug}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${item.slug}`}
            aria-selected={i === active}
            aria-controls={`${uid}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              i === active ? "bg-ink-900 text-white" : "border border-line bg-white text-ink-700 hover:border-brand-teal/60"
            }`}
          >
            {item.shortTitle}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${current.slug}`}
        className="mt-12"
      >
        <PackagePicker key={current.slug} slug={current.slug} serviceTitle={current.title} />
        <p className="mt-6 text-center">
          <Link
            href={`/services/${current.slug}`}
            className="inline-flex items-center gap-1.5 font-semibold text-brand-teal-dark hover:underline"
          >
            Learn more about {current.title} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </div>
  );
}
