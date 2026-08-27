import { execFileSync } from "node:child_process";

const baseUrl = process.env.JAFORY_AUDIT_ORIGIN ?? "https://jafory.netlify.app";
const slugs = ["electronics", "fashion", "home-living", "beauty-wellness", "daily-essentials", "ai-learn-ai-tech"];
const unresolved = [];
let total = 0;

for (const slug of slugs) {
  const input = encodeURIComponent(JSON.stringify({ 0: { json: { slug } } }));
  const response = execFileSync("curl", ["--fail", "--silent", "--show-error", "--retry", "3", "--retry-connrefused", `${baseUrl}/api/trpc/catalog.category?batch=1&input=${input}`], { encoding: "utf8" });
  const products = JSON.parse(response)?.[0]?.result?.data?.json?.products ?? [];
  total += products.length;
  for (const product of products) if (!product.imageUrl) unresolved.push({ category: slug, slug: product.slug, name: product.nameEn });
}

console.log(JSON.stringify({ total, imageUrlPresent: total - unresolved.length, missingImageUrl: unresolved.length, unresolved }, null, 2));
