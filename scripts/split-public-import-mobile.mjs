import { readFile, writeFile } from "node:fs/promises";

const root = "/home/ubuntu/jafory-affiliate-hub";
const source = await readFile(`${root}/docs/JAFORY_V2_PUBLIC_IMPORT.sql`, "utf8");
const statements = source
  .split(/(?=insert into public\.)/i)
  .map((part) => part.trim())
  .filter((part) => /^insert into public\./i.test(part))
  .map((statement) => statement.replace(/\s*commit;\s*$/i, "").trim());
const tableOf = (statement) => statement.match(/^insert into public\.([a-z_]+)/i)?.[1] ?? "unknown";
const groups = [
  ["01_CATEGORIES_SLIDES", new Set(["categories", "hero_slides"])],
  ["02_PRODUCTS", new Set(["products"])],
  ["03_SPECIFICATIONS", new Set(["product_specifications"])],
  ["04_FINISH", new Set(["social_links", "site_settings", "affiliate_links"])],
];
const counts = {};
for (const statement of statements) counts[tableOf(statement)] = (counts[tableOf(statement)] ?? 0) + 1;
for (const [label, tables] of groups) {
  const selected = statements.filter((statement) => tables.has(tableOf(statement)));
  if (!selected.length) throw new Error(`No statements found for ${label}`);
  const sql = [
    `-- JAFORY V2 MOBILE-SAFE IMPORT ${label}`,
    "-- Run after the schema file and in this exact order.",
    "-- This chunk contains public data inserts only; it has no CREATE/ALTER/DROP statements.",
    "begin;",
    ...selected,
    "commit;",
    "",
  ].join("\n");
  await writeFile(`${root}/docs/JAFORY_V2_IMPORT_${label}.sql`, sql);
}
console.log(JSON.stringify({ statementCount: statements.length, counts, chunks: groups.map(([label]) => label) }, null, 2));
