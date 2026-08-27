import { describe, expect, it } from "vitest";
import { isMinimumSearchMatch } from "./supabaseCatalog";

describe("minimum-match catalogue search", () => {
  it("matches singular and partial product/category keywords", () => {
    expect(isMinimumSearchMatch(["electronic"], ["Anker 737 Power Bank", "electronics", "Electronics"])).toBe(true);
    expect(isMinimumSearchMatch(["living"], ["BAYTI Decorative Round Storage Box", "home-living", "Home & Living"])).toBe(true);
  });

  it("does not return unrelated products for a minimum keyword", () => {
    expect(isMinimumSearchMatch(["fashion"], ["Anker 737 Power Bank", "electronics", "Electronics"])).toBe(false);
  });
});
