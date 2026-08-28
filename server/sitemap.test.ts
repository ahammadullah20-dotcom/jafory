import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const root = new URL("../", import.meta.url);

describe("public sitemap", () => {
  it("includes every authoritative product URL exactly once", async () => {
    const [sitemap, catalogue] = await Promise.all([
      readFile(new URL("../client/public/sitemap.xml", import.meta.url), "utf8"),
      readFile(new URL("../docs/jafory-public-product-details.json", import.meta.url), "utf8"),
    ]);
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const productUrls = locations.filter((location) => location.includes("/products/"));
    const productSlugs = JSON.parse(catalogue).products.map((row: { product: { slug: string } }) => row.product.slug);

    expect(locations).toHaveLength(134);
    expect(new Set(locations).size).toBe(134);
    expect(productUrls).toHaveLength(118);
    expect(new Set(productUrls).size).toBe(118);
    expect(productSlugs).toHaveLength(118);

    for (const slug of productSlugs) {
      expect(productUrls).toContain(`https://jafory.netlify.app/products/${slug}`);
    }
  });

  it("keeps the required public policy and category URLs crawlable", async () => {
    const sitemap = await readFile(new URL("../client/public/sitemap.xml", import.meta.url), "utf8");
    for (const route of ["/", "/categories", "/disclosure", "/privacy", "/terms", "/contact", "/readiness"]) {
      expect(sitemap).toContain(`<loc>https://jafory.netlify.app${route}</loc>`);
    }
  });
});
