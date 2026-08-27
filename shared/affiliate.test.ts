import { describe, expect, it } from "vitest";
import { chooseAffiliateDestination, comparisonSelection } from "./affiliate";

describe("affiliate destination selection", () => {
  const links = [
    { id: 1, market: "uae" as const, isPrimary: 1 },
    { id: 2, market: "bangladesh" as const, isPrimary: 1 },
    { id: 3, market: "global" as const, isPrimary: 1 },
  ];

  it("uses the configured market-specific destination before the global fallback", () => {
    expect(chooseAffiliateDestination(links, "uae")?.id).toBe(1);
    expect(chooseAffiliateDestination(links, "bangladesh")?.id).toBe(2);
  });

  it("uses a global destination when a regional destination is unavailable", () => {
    expect(chooseAffiliateDestination(links.filter(link => link.market !== "uae"), "uae")?.id).toBe(3);
  });
});

describe("comparison selection", () => {
  it("keeps unique positive product IDs and limits comparison to four products", () => {
    expect(comparisonSelection([3, 3, 2, -1, 7, 8, 9])).toEqual([3, 2, 7, 8]);
  });
});
