import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const root = "/home/ubuntu/jafory-affiliate-hub";

describe("Jafory V2 Supabase migration package", () => {
  it("defines the isolated schema and public-safe storage boundary", async () => {
    const schema = await readFile(`${root}/docs/JAFORY_V2_SUPABASE_SCHEMA.sql`, "utf8");
    expect(schema).toContain("create table if not exists public.profiles");
    expect(schema).toContain("create table if not exists public.categories");
    expect(schema).toContain("create table if not exists public.products");
    expect(schema).toContain("create table if not exists public.product_specifications");
    expect(schema).toContain("create table if not exists public.affiliate_links");
    expect(schema).toContain("create table if not exists public.hero_slides");
    expect(schema).toContain("create table if not exists public.reviews");
    expect(schema).toContain("insert into storage.buckets");
    expect(schema).toContain("Jafory media public read");

    const firstRunSchema = await readFile(`${root}/docs/JAFORY_V2_SUPABASE_SCHEMA_FIRST_RUN.sql`, "utf8");
    expect(firstRunSchema).not.toMatch(/^\s*drop\s+/im);
    expect(firstRunSchema).toContain("create trigger on_auth_user_created");
    expect(firstRunSchema).not.toContain("pg_trigger");
    expect(firstRunSchema).toContain("safe first run for a new project");
  });

  it("contains the expected public import without user or review seeding", async () => {
    const importSql = await readFile(`${root}/docs/JAFORY_V2_PUBLIC_IMPORT.sql`, "utf8");
    expect((importSql.match(/insert into public\.categories/g) ?? [])).toHaveLength(6);
    expect((importSql.match(/insert into public\.products/g) ?? [])).toHaveLength(118);
    expect((importSql.match(/insert into public\.product_specifications/g) ?? []).length).toBe(354);
    expect(importSql).toContain("Expected import counts: 6 categories, 118 products");
    expect(importSql).not.toMatch(/insert into public\.(profiles|reviews)/i);
    expect(importSql).not.toMatch(/insert into public\.(profiles|reviews)/i);
    expect(importSql).not.toContain("/manus-storage/");

    const chunkNames = [
      "JAFORY_V2_IMPORT_01_CATEGORIES_SLIDES.sql",
      "JAFORY_V2_IMPORT_02_PRODUCTS.sql",
      "JAFORY_V2_IMPORT_03_SPECIFICATIONS.sql",
      "JAFORY_V2_IMPORT_04_FINISH.sql",
    ];
    const chunks = await Promise.all(chunkNames.map((name) => readFile(`${root}/docs/${name}`, "utf8")));
    const combinedChunks = chunks.join("\n");
    expect(combinedChunks).not.toMatch(/^\s*(create|alter|drop)\s+/im);
    expect(chunks[0]).toContain("insert into public.categories");
    expect(chunks[0]).toContain("insert into public.hero_slides");
    expect(chunks[1]).toContain("insert into public.products");
    expect(chunks[2]).toContain("insert into public.product_specifications");
    expect(chunks[3]).toContain("insert into public.social_links");
    expect(chunks[3]).toContain("insert into public.site_settings");
    expect((combinedChunks.match(/insert into public\.categories/g) ?? [])).toHaveLength(6);
    expect((combinedChunks.match(/insert into public\.hero_slides/g) ?? [])).toHaveLength(5);
    expect((combinedChunks.match(/insert into public\.products/g) ?? [])).toHaveLength(118);
    expect((combinedChunks.match(/insert into public\.product_specifications/g) ?? [])).toHaveLength(354);
  });
});
