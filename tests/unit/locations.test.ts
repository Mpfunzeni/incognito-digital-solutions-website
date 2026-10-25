import { describe, expect, it } from "vitest";
import { locations, getLocation } from "@/content/locations";
import { getService } from "@/content/services";

describe("locations", () => {
  it("has unique slugs", () => {
    expect(new Set(locations.map((l) => l.slug)).size).toBe(locations.length);
  });

  it("references real services and locations", () => {
    for (const l of locations) {
      for (const f of l.serviceFocus) expect(getService(f.service), `${l.slug} -> ${f.service}`).toBeDefined();
      for (const n of l.nearby) {
        expect(getLocation(n), `${l.slug} -> ${n}`).toBeDefined();
        expect(n).not.toBe(l.slug);
      }
    }
  });

  it("gives every city its own copy, so pages are not near-duplicates", () => {
    const fields = (l: (typeof locations)[number]) => [
      l.seo.title,
      l.seo.description,
      l.intro,
      ...l.market,
      ...l.industries.map((i) => i.description),
      ...l.faqs.map((f) => f.answer),
    ];
    const seen = new Map<string, string>();
    for (const l of locations) {
      for (const text of fields(l)) {
        expect(seen.get(text), `"${text.slice(0, 40)}…" reused by ${l.slug}`).toBeUndefined();
        seen.set(text, l.slug);
      }
    }
  });

  it("keeps SEO descriptions within search snippet length", () => {
    for (const l of locations) expect(l.seo.description.length, l.slug).toBeLessThanOrEqual(165);
  });
});
