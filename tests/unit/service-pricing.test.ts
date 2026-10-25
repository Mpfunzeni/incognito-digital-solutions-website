import { describe, expect, it } from "vitest";
import { publishedServices } from "@/content/services";
import { describeSelection, resolveSelection, selectionTotals, servicePricing } from "@/content/service-pricing";
import { budgetForAmount } from "@/lib/quote-schema";

describe("service pricing", () => {
  it("has tiers for every published service, with unique ids", () => {
    for (const s of publishedServices) {
      expect(servicePricing.find((p) => p.slug === s.slug)?.tiers.length).toBeGreaterThan(0);
    }
    const tierIds = servicePricing.flatMap((p) => p.tiers.map((t) => t.id));
    expect(new Set(tierIds).size).toBe(tierIds.length);
  });

  it("resolves a quote link back into a selection and totals it by billing", () => {
    const sel = resolveSelection("web-business", "logo,hosting,unknown")!;
    expect(sel.pricing.slug).toBe("web-design");
    expect(sel.addOns.map((a) => a.id)).toEqual(["logo", "hosting"]);
    expect(selectionTotals(sel)).toEqual({ "once-off": 11000, monthly: 149, yearly: 0 });
    expect(describeSelection(sel)).toContain("Business + Logo design");
    expect(resolveSelection("nope", null)).toBeUndefined();
  });

  it("maps estimates to budget options", () => {
    expect(budgetForAmount(4500)).toBe("Under R5 000");
    expect(budgetForAmount(11000)).toBe("R5 000 – R15 000");
    expect(budgetForAmount(180000)).toBe("Over R60 000");
  });
});
