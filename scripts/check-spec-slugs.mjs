import { readFile } from "node:fs/promises";

const root = "/home/ubuntu/jafory-affiliate-hub";
const productsSql = await readFile(`${root}/docs/JAFORY_V2_IMPORT_02_PRODUCTS.sql`, "utf8");
const specsSql = await readFile(`${root}/docs/JAFORY_V2_IMPORT_03_SPECIFICATIONS.sql`, "utf8");
const productSlugs = [...productsSql.matchAll(/'([^']+)'\s*,\s*'[^']*'\s*,\s*'[^']*'\s*,\s*'[^']*'[^\n]*?from public\.categories/gi)].map((m) => m[1]);
const specSlugs = [...specsSql.matchAll(/from public\.products\s+where slug\s*=\s*'([^']+)'/gi)].map((m) => m[1]);
const uniqueProducts = [...new Set(productSlugs)];
const uniqueSpecs = [...new Set(specSlugs)];
const missing = uniqueSpecs.filter((slug) => !uniqueProducts.includes(slug));
console.log(JSON.stringify({ productStatementCandidates: productSlugs.length, uniqueProducts: uniqueProducts.length, specStatements: specSlugs.length, uniqueSpecs: uniqueSpecs.length, missingCount: missing.length, missing: missing.slice(0, 20) }, null, 2));
