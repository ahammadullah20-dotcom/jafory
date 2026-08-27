import { writeFile } from "node:fs/promises";

const base = process.env.JAFORY_SOURCE_URL ?? "https://jafory.netlify.app";
const endpoint = `${base.replace(/\/$/, "")}/api/trpc/catalog.home?input=${encodeURIComponent(JSON.stringify({ json: null }))}`;

const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
if (!response.ok) throw new Error(`Public catalogue request failed: ${response.status}`);
const envelope = await response.json();
const catalog = envelope?.result?.data?.json;
if (!catalog || !Array.isArray(catalog.categories) || !Array.isArray(catalog.featuredProducts)) {
  throw new Error("Unexpected catalogue response shape");
}

const products = catalog.featuredProducts.map(({ product, category }) => ({ product, category }));
const exportPayload = {
  source: "public-catalogue-only",
  sourceUrl: base,
  exportedAt: new Date().toISOString(),
  categories: catalog.categories,
  slides: catalog.slides,
  featuredProducts: products,
  socialLinks: catalog.socialLinks,
  settings: catalog.settings,
  note: "This export intentionally excludes users, passwords, sessions, reviews, and service credentials. Product detail specifications and affiliate links are fetched separately by slug when available."
};

await writeFile("/home/ubuntu/jafory-affiliate-hub/docs/jafory-public-catalog-export.json", JSON.stringify(exportPayload, null, 2) + "\n");
console.log(JSON.stringify({ categories: catalog.categories.length, featuredProducts: products.length, slides: catalog.slides.length, socialLinks: catalog.socialLinks.length }, null, 2));
