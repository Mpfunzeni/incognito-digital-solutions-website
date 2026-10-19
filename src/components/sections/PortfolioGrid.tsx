"use client";

import { useState } from "react";
import type { PortfolioCategory, PortfolioItem } from "@/content/portfolio";
import { PortfolioCard } from "./PortfolioCard";

export function PortfolioGrid({ items, categories }: { items: PortfolioItem[]; categories: PortfolioCategory[] }) {
  const [active, setActive] = useState<PortfolioCategory | "All">("All");
  const visible = active === "All" ? items : items.filter((i) => i.category === active);
  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {(["All", ...categories] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className={`h-10 rounded-full px-4 text-sm font-semibold transition-colors ${
              active === c ? "bg-ink-900 text-white" : "border border-line bg-white text-ink-700 hover:border-ink-500"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>
      <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <li key={item.slug}>
            <PortfolioCard item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
