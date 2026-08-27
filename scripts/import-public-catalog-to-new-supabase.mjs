import { readFile } from "node:fs/promises";

const root = "/home/ubuntu/jafory-affiliate-hub";
const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error("VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
if (!url.includes("bsnujdoiikafnlaareye.supabase.co")) throw new Error(`Refusing non-V2 target: ${url}`);

const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  "Content-Type": "application/json",
};
const source = await readFile(`${root}/docs/JAFORY_V2_PUBLIC_IMPORT.sql`, "utf8");

function splitSqlValues(text) {
  const values = [];
  let current = "";
  let quote = false;
  let depth = 0;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === "'" && quote && text[i + 1] === "'") {
      current += "''";
      i += 1;
      continue;
    }
    if (char === "'") {
      quote = !quote;
      current += char;
      continue;
    }
    if (!quote && char === "(") depth += 1;
    if (!quote && char === ")") depth -= 1;
    if (!quote && depth === 0 && char === ",") {
      values.push(current.trim());
      current = "";
    } else current += char;
  }
  if (current.trim()) values.push(current.trim());
  return values;
}
function sqlValue(value) {
  const trimmed = value.trim();
  if (/^null$/i.test(trimmed)) return null;
  if (/^true$/i.test(trimmed)) return true;
  if (/^false$/i.test(trimmed)) return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1).replaceAll("''", "'");
  throw new Error(`Unsupported SQL value: ${trimmed.slice(0, 80)}`);
}
function statementsFor(table) {
  const marker = new RegExp(`insert into public\\.${table}\\b`, "gi");
  const starts = [...source.matchAll(marker)].map((match) => match.index);
  const result = [];
  for (const start of starts) {
    let quoted = false;
    let end = -1;
    for (let index = start; index < source.length; index += 1) {
      const char = source[index];
      if (char === "'" && quoted && source[index + 1] === "'") {
        index += 1;
        continue;
      }
      if (char === "'") quoted = !quoted;
      if (!quoted && char === ";") {
        end = index;
        break;
      }
    }
    if (end < 0) throw new Error(`Unterminated ${table} statement`);
    result.push(source.slice(start, end + 1));
  }
  return result;
}
function parseValuesStatement(statement, table) {
  const columnsMatch = statement.match(new RegExp(`insert into public\\.${table}\\s*\\(([^)]+)\\)`, "i"));
  if (!columnsMatch) throw new Error(`Missing columns for ${table}`);
  const columns = columnsMatch[1].split(",").map((column) => column.trim());
  const valuesStart = statement.indexOf(" values ", columnsMatch.index + columnsMatch[0].length);
  if (valuesStart < 0) throw new Error(`Missing values for ${table}`);
  const open = statement.indexOf("(", valuesStart);
  let close = -1;
  let depth = 0;
  let quoted = false;
  for (let index = open; index < statement.length; index += 1) {
    const char = statement[index];
    if (char === "'" && quoted && statement[index + 1] === "'") {
      index += 1;
      continue;
    }
    if (char === "'") quoted = !quoted;
    if (!quoted && char === "(") depth += 1;
    if (!quoted && char === ")") {
      depth -= 1;
      if (depth === 0) {
        close = index;
        break;
      }
    }
  }
  if (close < 0) throw new Error(`Unterminated values tuple for ${table}`);
  const rawValues = splitSqlValues(statement.slice(open + 1, close));
  if (rawValues.length !== columns.length) throw new Error(`${table} column/value mismatch ${columns.length}/${rawValues.length}`);
  return Object.fromEntries(columns.map((column, index) => [column, sqlValue(rawValues[index])]));
}
function parseSelectProductStatement(statement, table, parentTable) {
  const columnsMatch = statement.match(new RegExp(`insert into public\\.${table}\\s*\\(([^)]+)\\)`, "i"));
  if (!columnsMatch) throw new Error(`Missing columns for ${table}`);
  const columns = columnsMatch[1].split(",").map((column) => column.trim());
  const selectPrefix = statement.slice(statement.indexOf(" select ", columnsMatch.index) + 8);
  const parentPattern = new RegExp(`\\s+from public\\.${parentTable}\\s+where slug\\s*=\\s*'([^']+)'`, "i");
  const parentMatch = selectPrefix.match(parentPattern);
  if (!parentMatch) throw new Error(`Missing parent slug for ${table}`);
  const valuesText = selectPrefix.slice(0, parentMatch.index).replace(/^id\s*,\s*/i, "");
  const rawValues = splitSqlValues(valuesText);
  if (rawValues.length !== columns.length - 1) throw new Error(`${table} value mismatch ${columns.length - 1}/${rawValues.length}`);
  const row = Object.fromEntries(columns.slice(1).map((column, index) => [column, sqlValue(rawValues[index])]));
  return { row, parentSlug: parentMatch[1] };
}
async function getRows(table, query) {
  const response = await fetch(`${url}/rest/v1/${table}?${query}`, { headers });
  if (!response.ok) throw new Error(`GET ${table} failed ${response.status}: ${await response.text()}`);
  return response.json();
}
async function postRows(table, rows, query = "") {
  if (!rows.length) return [];
  const response = await fetch(`${url}/rest/v1/${table}${query ? `?${query}` : ""}`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation,resolution=merge-duplicates" },
    body: JSON.stringify(rows),
  });
  if (!response.ok) throw new Error(`POST ${table} failed ${response.status}: ${await response.text()}`);
  return response.json();
}
async function postBatches(table, rows, query = "") {
  for (let i = 0; i < rows.length; i += 50) await postRows(table, rows.slice(i, i + 50), query);
}

const categoryRows = statementsFor("categories").map((statement) => parseValuesStatement(statement, "categories"));
const slideRows = statementsFor("hero_slides").map((statement) => parseValuesStatement(statement, "hero_slides"));
const socialRows = statementsFor("social_links").map((statement) => parseValuesStatement(statement, "social_links"));
const settingRows = statementsFor("site_settings").map((statement) => parseValuesStatement(statement, "site_settings"));
await postBatches("categories", categoryRows, "on_conflict=slug");
const categories = await getRows("categories", "select=id,slug");
const categoryIds = new Map(categories.map((row) => [row.slug, row.id]));

const productParsed = statementsFor("products").map((statement) => parseSelectProductStatement(statement, "products", "categories"));
const products = productParsed.map(({ row, parentSlug }) => ({ ...row, category_id: categoryIds.get(parentSlug) }));
if (products.some((row) => !row.category_id)) throw new Error("A product category slug was not imported");
await postBatches("products", products, "on_conflict=slug");
const productRows = await getRows("products", "select=id,slug");
const productIds = new Map(productRows.map((row) => [row.slug, row.id]));

const specParsed = statementsFor("product_specifications").map((statement) => parseSelectProductStatement(statement, "product_specifications", "products"));
if (process.env.DRY_RUN === "1") {
  console.log(JSON.stringify({ dryRun: true, target: url, sourceRows: { categories: categoryRows.length, products: productParsed.length, specifications: specParsed.length, heroSlides: slideRows.length, socialLinks: socialRows.length, siteSettings: settingRows.length } }, null, 2));
  process.exit(0);
}
const existingSpecs = await getRows("product_specifications", "select=product_id,label_en,value_en");
const existingSpecKeys = new Set(existingSpecs.map((row) => `${row.product_id}|${row.label_en}|${row.value_en}`));
const specs = specParsed.map(({ row, parentSlug }) => ({ ...row, product_id: productIds.get(parentSlug) })).filter((row) => row.product_id && !existingSpecKeys.has(`${row.product_id}|${row.label_en}|${row.value_en}`));
if (specs.some((row) => !row.product_id)) throw new Error("A specification product slug was not imported");
await postBatches("product_specifications", specs);

const existingSlides = await getRows("hero_slides", "select=id");
if (!existingSlides.length) await postBatches("hero_slides", slideRows);
await postBatches("social_links", socialRows, "on_conflict=network");
await postBatches("site_settings", settingRows, "on_conflict=setting_key");

const counts = {};
for (const table of ["categories", "products", "product_specifications", "hero_slides", "social_links", "site_settings"]) counts[table] = (await getRows(table, "select=id")).length;
console.log(JSON.stringify({ target: url, imported: { categories: categoryRows.length, products: products.length, specifications: specs.length, heroSlides: slideRows.length, socialLinks: socialRows.length, siteSettings: settingRows.length }, counts }, null, 2));
