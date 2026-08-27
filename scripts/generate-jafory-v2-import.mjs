import { readFile, writeFile } from "node:fs/promises";

const root = "/home/ubuntu/jafory-affiliate-hub";
const catalog = JSON.parse(await readFile(`${root}/docs/jafory-public-catalog-export.json`, "utf8"));
const details = JSON.parse(await readFile(`${root}/docs/jafory-public-product-details.json`, "utf8"));

const sql = (value) => value == null ? "null" : `'${String(value).replaceAll("'", "''")}'`;
const bool = (value) => value ? "true" : "false";
const text = (value, fallback = "") => typeof value === "string" && value.trim() ? value.trim() : fallback;
const categoryBySlug = new Map(catalog.categories.map((category) => [category.slug, category]));
const productRows = catalog.featuredProducts.map(({ product, category }) => ({ product, category }));
const detailBySlug = new Map(details.products.map((item) => [item.product.slug, item]));

const lines = [
  "-- Jafory V2 public data import generated from the old public catalogue.",
  "-- Run only after JAFORY_V2_SUPABASE_SCHEMA.sql in the NEW project.",
  "-- Intentionally excludes users, passwords, sessions, reviewer identity, and reviews.",
  "begin;",
  ""
];

for (const category of catalog.categories) {
  lines.push(`insert into public.categories (slug, name_en, name_ar, name_bn, description_en, description_ar, description_bn, image_url, accent_color, sort_order, is_active) values (${sql(category.slug)}, ${sql(category.nameEn)}, ${sql(category.nameAr)}, ${sql(category.nameBn)}, ${sql(category.descriptionEn)}, ${sql(category.descriptionAr)}, ${sql(category.descriptionBn)}, null, ${sql(category.accentColor || "#0F766E")}, ${Number(category.sortOrder) || 0}, ${bool(Boolean(category.isActive))}) on conflict (slug) do update set name_en = excluded.name_en, name_ar = excluded.name_ar, name_bn = excluded.name_bn, description_en = excluded.description_en, description_ar = excluded.description_ar, description_bn = excluded.description_bn, accent_color = excluded.accent_color, sort_order = excluded.sort_order, is_active = excluded.is_active;`);
}

for (const slide of catalog.slides) {
  lines.push(`insert into public.hero_slides (eyebrow_en, eyebrow_ar, eyebrow_bn, title_en, title_ar, title_bn, body_en, body_ar, body_bn, cta_label_en, cta_label_ar, cta_label_bn, cta_url, image_url, tone, sort_order, is_active) values (${sql(slide.eyebrowEn)}, ${sql(slide.eyebrowAr)}, ${sql(slide.eyebrowBn)}, ${sql(slide.titleEn)}, ${sql(slide.titleAr)}, ${sql(slide.titleBn)}, ${sql(slide.bodyEn)}, ${sql(slide.bodyAr)}, ${sql(slide.bodyBn)}, ${sql(slide.ctaLabelEn)}, ${sql(slide.ctaLabelAr)}, ${sql(slide.ctaLabelBn)}, ${sql(slide.ctaUrl || "/")}, null, ${sql(slide.tone || "teal")}, ${Number(slide.sortOrder) || 0}, ${bool(Boolean(slide.isActive))});`);
}

for (const { product, category } of productRows) {
  const categorySlug = category?.slug || "electronics";
  const fallbackName = text(product.nameEn, product.slug.replaceAll("-", " "));
  lines.push(`insert into public.products (category_id, slug, name_en, name_ar, name_bn, short_description_en, short_description_ar, short_description_bn, description_en, description_ar, description_bn, image_url, badge_en, badge_ar, badge_bn, is_featured, is_active) select id, ${sql(product.slug)}, ${sql(fallbackName)}, ${sql(text(product.nameAr, fallbackName))}, ${sql(text(product.nameBn, fallbackName))}, ${sql(product.shortDescriptionEn)}, ${sql(product.shortDescriptionAr)}, ${sql(product.shortDescriptionBn)}, ${sql(product.descriptionEn)}, ${sql(product.descriptionAr)}, ${sql(product.descriptionBn)}, null, ${sql(product.badgeEn)}, ${sql(product.badgeAr)}, ${sql(product.badgeBn)}, ${bool(Boolean(product.isFeatured))}, ${bool(Boolean(product.isActive))} from public.categories where slug = ${sql(categorySlug)} on conflict (slug) do update set category_id = excluded.category_id, name_en = excluded.name_en, name_ar = excluded.name_ar, name_bn = excluded.name_bn, short_description_en = excluded.short_description_en, short_description_ar = excluded.short_description_ar, short_description_bn = excluded.short_description_bn, description_en = excluded.description_en, description_ar = excluded.description_ar, description_bn = excluded.description_bn, badge_en = excluded.badge_en, badge_ar = excluded.badge_ar, badge_bn = excluded.badge_bn, is_featured = excluded.is_featured, is_active = excluded.is_active;`);

  const detail = detailBySlug.get(product.slug);
  for (const spec of detail?.specifications ?? []) {
    lines.push(`insert into public.product_specifications (product_id, group_en, group_ar, group_bn, label_en, label_ar, label_bn, value_en, value_ar, value_bn, sort_order) select id, ${sql(text(spec.groupEn, "General"))}, ${sql(text(spec.groupAr, "عام"))}, ${sql(text(spec.groupBn, "সাধারণ"))}, ${sql(text(spec.labelEn, "Specification"))}, ${sql(text(spec.labelAr, text(spec.labelEn, "Specification")))}, ${sql(text(spec.labelBn, text(spec.labelEn, "Specification")))}, ${sql(text(spec.valueEn, "—"))}, ${sql(text(spec.valueAr, text(spec.valueEn, "—")))}, ${sql(text(spec.valueBn, text(spec.valueEn, "—")))}, ${Number(spec.sortOrder) || 0} from public.products where slug = ${sql(product.slug)} and not exists (select 1 from public.product_specifications existing where existing.product_id = public.products.id and existing.label_en = ${sql(text(spec.labelEn, "Specification"))} and existing.value_en = ${sql(text(spec.valueEn, "—"))});`);
  }
}

for (const social of catalog.socialLinks) {
  if (!social.url) continue;
  lines.push(`insert into public.social_links (network, url, is_active, sort_order) values (${sql(social.network)}, ${sql(social.url)}, ${bool(Boolean(social.isActive))}, ${Number(social.sortOrder) || 0}) on conflict (network) do update set url = excluded.url, is_active = excluded.is_active, sort_order = excluded.sort_order;`);
}

for (const setting of catalog.settings) {
  if (!setting.settingKey || setting.settingKey.startsWith("productMedia:")) continue;
  lines.push(`insert into public.site_settings (setting_key, setting_value) values (${sql(setting.settingKey)}, ${sql(setting.settingValue || "")}) on conflict (setting_key) do update set setting_value = excluded.setting_value;`);
}

lines.push("", "commit;", "", `-- Expected import counts: ${catalog.categories.length} categories, ${productRows.length} products, ${catalog.slides.length} slides, ${details.products.reduce((sum, item) => sum + (item.specifications?.length ?? 0), 0)} specifications.`);
await writeFile(`${root}/docs/JAFORY_V2_PUBLIC_IMPORT.sql`, lines.join("\n") + "\n");
console.log(JSON.stringify({ categories: catalog.categories.length, products: productRows.length, slides: catalog.slides.length, specifications: details.products.reduce((sum, item) => sum + (item.specifications?.length ?? 0), 0) }, null, 2));
