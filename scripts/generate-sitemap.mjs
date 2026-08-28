import { readFile, writeFile } from "node:fs/promises";

const baseUrl = "https://jafory.netlify.app";
const publicRoutes = [
  { path: "/", priority: "1.0" },
  { path: "/categories", priority: "0.9" },
  { path: "/categories/electronics", priority: "0.9" },
  { path: "/categories/fashion", priority: "0.9" },
  { path: "/categories/home-living", priority: "0.9" },
  { path: "/categories/beauty-wellness", priority: "0.9" },
  { path: "/categories/daily-essentials", priority: "0.9" },
  { path: "/categories/ai-learn-ai-tech", priority: "0.9" },
  { path: "/compare", priority: "0.6" },
  { path: "/search", priority: "0.5" },
  { path: "/about", priority: "0.5" },
  { path: "/privacy", priority: "0.3" },
  { path: "/disclosure", priority: "0.5" },
  { path: "/contact", priority: "0.6" },
  { path: "/terms", priority: "0.3" },
  { path: "/readiness", priority: "0.5" },
];

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const source = JSON.parse(await readFile(new URL("../docs/jafory-public-product-details.json", import.meta.url), "utf8"));
const productSlugs = source.products
  .map((row) => row?.product?.slug)
  .filter((slug) => typeof slug === "string" && slug.length > 0)
  .sort();

if (productSlugs.length !== 118 || new Set(productSlugs).size !== 118) {
  throw new Error(`Expected 118 unique product slugs, received ${productSlugs.length}.`);
}

const urls = [
  ...publicRoutes.map(({ path, priority }) => ({ loc: `${baseUrl}${path}`, priority })),
  ...productSlugs.map((slug) => ({ loc: `${baseUrl}/products/${encodeURIComponent(slug)}`, priority: "0.8" })),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(({ loc, priority }) => `  <url><loc>${escapeXml(loc)}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`),
  "</urlset>",
  "",
].join("\n");

await writeFile(new URL("../client/public/sitemap.xml", import.meta.url), xml, "utf8");
console.log(`Generated sitemap with ${urls.length} URLs including ${productSlugs.length} product URLs.`);
