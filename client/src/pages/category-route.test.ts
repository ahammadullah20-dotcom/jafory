import { describe, expect, it } from "vitest";
import { categorySlugFromLocation } from "./CategoryPage";

describe("category URL parsing", () => {
  it("keeps the index distinct from every fixed category pathname", () => {
    expect(categorySlugFromLocation("/categories")).toBe("");
    expect(categorySlugFromLocation("/categories/")).toBe("");
    expect(categorySlugFromLocation("/categories/home-living")).toBe("home-living");
    expect(categorySlugFromLocation("/categories/home-living/")).toBe("home-living");
    expect(categorySlugFromLocation("/categories/ai-learn-ai-tech")).toBe("ai-learn-ai-tech");
  });

  it("uses a browser pathname form that remains stable for a direct deep link", () => {
    const directDeepLink = new URL("https://jafory.netlify.app/categories/home-living?market=global");
    expect(categorySlugFromLocation(directDeepLink.pathname)).toBe("home-living");
  });
});
