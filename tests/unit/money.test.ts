import { describe, expect, it } from "vitest";
import { formatZar } from "@/lib/money";

describe("formatZar", () => {
  it("groups thousands with non-breaking spaces", () => {
    expect(formatZar(1500)).toBe("R 1 500");
    expect(formatZar(1234567)).toBe("R 1 234 567");
    expect(formatZar(999)).toBe("R 999");
  });
  it("supports cents and negatives", () => {
    expect(formatZar(249, 2)).toBe("R 249.00");
    expect(formatZar(-1234.5, 2)).toBe("-R 1 234.50");
  });
});
