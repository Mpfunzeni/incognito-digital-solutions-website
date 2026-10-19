"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { PostMeta } from "@/lib/blog-utils";
import { PostCard } from "./PostCard";

export function BlogList({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);

  const q = query.trim().toLowerCase();
  const visible = posts.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (!q || [p.title, p.description, p.category, ...p.tags].some((t) => t.toLowerCase().includes(q))),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter articles by category" className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`h-10 rounded-full px-4 text-sm font-semibold transition-colors ${
                category === c ? "bg-ink-900 text-white" : "border border-line bg-white text-ink-700 hover:border-ink-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative md:w-72">
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
          <input
            id="blog-search"
            type="search"
            placeholder="Search articles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-full border border-[#cbd5e1] bg-white pl-11 pr-4 text-base focus:border-ink-900 focus:outline-none focus:ring-3 focus:ring-brand-teal/40"
          />
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "article" : "articles"} found
      </p>
      {visible.length > 0 ? (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-2xl border border-line bg-surface-muted p-8 text-center text-text-muted">
          No articles match your search. Try a different word or category.
        </p>
      )}
    </div>
  );
}
