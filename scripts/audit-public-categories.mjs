import { execFileSync } from "node:child_process";

const baseUrl = process.env.JAFORY_AUDIT_ORIGIN ?? "https://jafory.netlify.app";
const slugs = ["electronics", "fashion", "home-living", "beauty-wellness", "daily-essentials", "ai-learn-ai-tech"];

const results = [];
for (const slug of slugs) {
  const input = encodeURIComponent(JSON.stringify({ 0: { json: { slug } } }));
  const response = execFileSync("curl", ["--fail", "--silent", "--show-error", "--retry", "3", "--retry-connrefused", `${baseUrl}/api/trpc/catalog.category?batch=1&input=${input}`], { encoding: "utf8" });
  const payload = JSON.parse(response);
  const data = payload?.[0]?.result?.data?.json;
  const products = Array.isArray(data?.products) ? data.products : [];
  results.push({ slug, returnedSlug: data?.category?.slug ?? null, count: products.length, allMatch: products.every(product => product.category?.slug === slug) });
}
console.table(results);
const expected = { electronics: 20, fashion: 20, "home-living": 20, "beauty-wellness": 20, "daily-essentials": 20, "ai-learn-ai-tech": 18 };
if (results.some(item => item.returnedSlug !== item.slug || !item.allMatch || item.count !== expected[item.slug])) process.exitCode = 1;
