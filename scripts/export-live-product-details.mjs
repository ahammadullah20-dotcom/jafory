import { readFile, writeFile } from "node:fs/promises";

const base = (process.env.JAFORY_SOURCE_URL ?? "https://jafory.netlify.app").replace(/\/$/, "");
const source = JSON.parse(await readFile("/home/ubuntu/jafory-affiliate-hub/docs/jafory-public-catalog-export.json", "utf8"));
const slugs = [...new Set(source.featuredProducts.map(({ product }) => product?.slug).filter(Boolean))];
const results = [];

async function fetchDetail(slug) {
  const input = encodeURIComponent(JSON.stringify({ json: { slug } }));
  const response = await fetch(`${base}/api/trpc/catalog.product?input=${input}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`${slug}: HTTP ${response.status}`);
  const envelope = await response.json();
  const detail = envelope?.result?.data?.json;
  if (!detail?.product) throw new Error(`${slug}: missing product detail`);
  return detail;
}

for (let index = 0; index < slugs.length; index += 6) {
  const batch = slugs.slice(index, index + 6);
  const details = await Promise.all(batch.map(fetchDetail));
  results.push(...details);
  console.log(`exported ${results.length}/${slugs.length}`);
}

await writeFile("/home/ubuntu/jafory-affiliate-hub/docs/jafory-public-product-details.json", JSON.stringify({ source: "public-catalogue-only", sourceUrl: base, exportedAt: new Date().toISOString(), products: results, note: "Public product details only. User accounts, passwords, sessions, and reviewer identity data are intentionally excluded." }, null, 2) + "\n");
console.log(JSON.stringify({ products: results.length, withSpecifications: results.filter((item) => item.specifications?.length).length, withAffiliateLinks: results.filter((item) => item.affiliateLinks?.length).length }, null, 2));
