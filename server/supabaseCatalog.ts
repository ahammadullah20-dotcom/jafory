import { supabaseAdmin, hasSupabaseConfig } from "./supabase";
import { canonicalProductSlugs } from "@shared/canonicalCatalog";
import { canonicalStorageImages, safePublicMediaUrl, toNetlifyMediaPath } from "@shared/storageImageMap";
const mapCategory = (row: any) => ({ id: String(row.id), slug: row.slug, nameEn: row.name_en, nameAr: row.name_ar, nameBn: row.name_bn, descriptionEn: row.description_en, descriptionAr: row.description_ar, descriptionBn: row.description_bn, imageUrl: safePublicMediaUrl(row.image_url), accentColor: row.accent_color, sortOrder: row.sort_order, isActive: row.is_active ? 1 : 0 });
const isCategorySafeMedia = (url: string | null) => Boolean(url && /^\/(?:jafory-media|manus-storage)\//i.test(url));
const fallbackMediaByCategorySlug: Record<string, string> = {
  electronics: "/jafory-media/electronics-anker-737_4fb124c7.webp",
  fashion: "/jafory-media/jafory-fashion-kalidi-tote_aada0356.webp",
  "home-living": "/jafory-media/jafory-home-bayti-round-box_5c1a5ab9.webp",
  "beauty-wellness": "/jafory-media/beauty-cerave-cleanser_1bfd2c8b.webp",
  "daily-essentials": "/jafory-media/daily-ariel-detergent_fe557788.webp",
  "ai-learn-ai-tech": "/jafory-media/ai-google-essentials_4f03d2a4.webp",
};
const isEditablePublicMedia = (url: string | null) => Boolean(url && (/^https?:\/\//i.test(url) || /^\/jafory-media\/uploads\//i.test(url)));
const publicUploadedMedia = (values: unknown[]) => values.map(safePublicMediaUrl).filter((url: string | null): url is string => Boolean(url));
export const productImage = (row: any, categorySlug?: string, uploadedImages: unknown[] = []) => {
  const hasCanonicalDecision = Object.prototype.hasOwnProperty.call(canonicalStorageImages, row.slug);
  const canonicalValue = hasCanonicalDecision ? toNetlifyMediaPath(canonicalStorageImages[row.slug]) : null;
  if (canonicalValue && isCategorySafeMedia(canonicalValue)) return canonicalValue;
  const editable = safePublicMediaUrl(row.image_url);
  if (editable && (hasCanonicalDecision ? isEditablePublicMedia(editable) : isCategorySafeMedia(editable))) return editable;
  const uploaded = publicUploadedMedia(uploadedImages).find(url => hasCanonicalDecision ? isEditablePublicMedia(url) : isCategorySafeMedia(url));
  if (uploaded) return uploaded;
  if (hasCanonicalDecision) return null;
  return categorySlug ? fallbackMediaByCategorySlug[categorySlug] ?? null : null;
};
const mapProduct = (row: any, categorySlug?: string, uploadedImages: unknown[] = []) => ({ id: String(row.id), categoryId: String(row.category_id), slug: row.slug, nameEn: row.name_en, nameAr: row.name_ar, nameBn: row.name_bn, shortDescriptionEn: row.short_description_en, shortDescriptionAr: row.short_description_ar, shortDescriptionBn: row.short_description_bn, descriptionEn: row.description_en, descriptionAr: row.description_ar, descriptionBn: row.description_bn, imageUrl: productImage(row, categorySlug, uploadedImages), badgeEn: row.badge_en, badgeAr: row.badge_ar, badgeBn: row.badge_bn, isFeatured: row.is_featured ? 1 : 0, isActive: row.is_active ? 1 : 0 });
const mapSlide = (row: any) => ({ id: String(row.id), eyebrowEn: row.eyebrow_en, eyebrowAr: row.eyebrow_ar, eyebrowBn: row.eyebrow_bn, titleEn: row.title_en, titleAr: row.title_ar, titleBn: row.title_bn, bodyEn: row.body_en, bodyAr: row.body_ar, bodyBn: row.body_bn, ctaLabelEn: row.cta_label_en, ctaLabelAr: row.cta_label_ar, ctaLabelBn: row.cta_label_bn, ctaUrl: row.cta_url, imageUrl: safePublicMediaUrl(row.image_url), tone: row.tone, sortOrder: row.sort_order, isActive: row.is_active ? 1 : 0 });
const mapSpec = (row: any) => ({ id: String(row.id), productId: String(row.product_id), groupEn: row.group_en, groupAr: row.group_ar, groupBn: row.group_bn, labelEn: row.label_en, labelAr: row.label_ar, labelBn: row.label_bn, valueEn: row.value_en, valueAr: row.value_ar, valueBn: row.value_bn, sortOrder: row.sort_order });
const mapLink = (row: any) => ({ id: String(row.id), productId: String(row.product_id), market: row.market, merchantName: row.merchant_name, destinationUrl: row.destination_url, priceDisplay: row.price_display, availabilityText: row.availability_text, isPrimary: row.is_primary ? 1 : 0, isActive: row.is_active ? 1 : 0 });
const mapSocial = (row: any) => ({ id: String(row.id), network: row.network, url: row.url, isActive: row.is_active ? 1 : 0, sortOrder: row.sort_order });
const categoryColumns = "id,slug,name_en,name_ar,name_bn,description_en,description_ar,description_bn,image_url,accent_color,sort_order,is_active";
const productColumns = "id,category_id,slug,name_en,name_ar,name_bn,short_description_en,short_description_ar,short_description_bn,description_en,description_ar,description_bn,image_url,badge_en,badge_ar,badge_bn,is_featured,is_active";
const slideColumns = "id,eyebrow_en,eyebrow_ar,eyebrow_bn,title_en,title_ar,title_bn,body_en,body_ar,body_bn,cta_label_en,cta_label_ar,cta_label_bn,cta_url,image_url,tone,sort_order,is_active";
const specificationColumns = "id,product_id,group_en,group_ar,group_bn,label_en,label_ar,label_bn,value_en,value_ar,value_bn,sort_order";
const affiliateColumns = "id,product_id,market,merchant_name,destination_url,price_display,availability_text,is_primary,is_active";
const socialColumns = "id,network,url,is_active,sort_order";
const settingColumns = "setting_key,setting_value";
const compactPublicSetting = (value: unknown) => {
  if (typeof value !== "string") return "";
  const normalized = value.trim();
  return normalized.length > 20_000 || /^data:/i.test(normalized) || /^blob:/i.test(normalized) ? "" : normalized;
};
const mapSetting = (row: any) => ({ settingKey: row.setting_key, settingValue: compactPublicSetting(row.setting_value) });
const mediaSettingKey = (productId: string) => `productMedia:${productId}`;
const parsePublicMedia = (value: unknown) => {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : null;
    const images = Array.isArray(parsed?.images) ? parsed.images.map(safePublicMediaUrl).filter((url: string | null): url is string => Boolean(url)).slice(0, 8) : [];
    const videoUrl = safePublicMediaUrl(parsed?.videoUrl);
    return { images, videoUrl };
  } catch { return { images: [], videoUrl: null }; }
};
const readProductMediaMap = async () => {
  const { data, error } = await supabaseAdmin.from("site_settings").select("setting_key,setting_value").like("setting_key", "productMedia:%");
  if (error) throw error;
  const map = new Map<string, { images: string[]; videoUrl: string | null }>();
  for (const row of data ?? []) {
    if (typeof row.setting_key !== "string" || !row.setting_key.startsWith("productMedia:")) continue;
    map.set(row.setting_key.slice("productMedia:".length), parsePublicMedia(row.setting_value));
  }
  return map;
};
const normalizedSearch = (value: unknown) => String(value ?? "").toLocaleLowerCase().replace(/[^a-z0-9\u0600-\u06ff\u0900-\u097f\u0980-\u09ff]+/gi, " ").trim();
const searchTokens = (query: string) => normalizedSearch(query).split(/\s+/).filter(token => token.length >= 2).slice(0, 8);
export const isMinimumSearchMatch = (tokens: string[], values: Array<unknown>) => {
  const haystack = normalizedSearch(values.join(" "));
  return tokens.some(token => haystack.includes(token) || haystack.split(" ").some(word => word.startsWith(token) || token.startsWith(word)));
};

async function read<T>(table: string, columns: string, query: (builder: any) => any): Promise<T[]> {
  const { data, error } = await query(supabaseAdmin.from(table).select(columns));
  if (error) throw error;
  return (data ?? []) as T[];
}

export async function supabaseHome() {
  if (!hasSupabaseConfig) return null;
  const [catRows, slideRows, featuredRows, socialRows, settingRows, mediaMap] = await Promise.all([
    read<any>("categories", categoryColumns, q => q.eq("is_active", true).order("sort_order", { ascending: true })),
    read<any>("hero_slides", slideColumns, q => q.eq("is_active", true).order("sort_order", { ascending: true }).limit(5)),
    read<any>("products", productColumns, q => q.eq("is_active", true).eq("is_featured", true).order("name_en", { ascending: true })),
    read<any>("social_links", socialColumns, q => q.eq("is_active", true).order("sort_order", { ascending: true })),
    read<any>("site_settings", settingColumns, q => q.order("setting_key", { ascending: true })),
    readProductMediaMap(),
  ]);
  const cats = catRows.map(mapCategory);
  const categorySlugById = new Map(cats.map(category => [String(category.id), String(category.slug)]));
  const publicFeatured = featuredRows.filter(row => canonicalProductSlugs.has(row.slug));
  return { categories: cats, slides: slideRows.map(mapSlide), featuredProducts: publicFeatured.map(row => ({ product: mapProduct(row, categorySlugById.get(String(row.category_id)), mediaMap.get(String(row.id))?.images ?? []), category: cats.find(c => c.id === String(row.category_id)) ?? null })), socialLinks: socialRows.map(mapSocial), settings: settingRows.map(mapSetting) };
}

export async function supabaseCategory(slug: string) {
  if (!hasSupabaseConfig) return null;
  const { data: categoryRow, error: categoryError } = await supabaseAdmin.from("categories").select(categoryColumns).eq("slug", slug).eq("is_active", true).maybeSingle();
  if (categoryError) throw categoryError;
  if (!categoryRow) return undefined;
  const { data: productRows, error: productError } = await supabaseAdmin.from("products").select(productColumns).eq("category_id", categoryRow.id).eq("is_active", true).order("name_en", { ascending: true });
  if (productError) throw productError;
  const mediaMap = await readProductMediaMap();
  return { category: mapCategory(categoryRow), products: (productRows ?? []).filter(row => canonicalProductSlugs.has(row.slug)).map(row => mapProduct(row, categoryRow.slug, mediaMap.get(String(row.id))?.images ?? [])) };
}

export async function supabaseSearch(query: string) {
  if (!hasSupabaseConfig || !query.trim()) return [];
  const tokens = searchTokens(query);
  if (!tokens.length) return [];
  const { data, error } = await supabaseAdmin.from("products").select(productColumns).eq("is_active", true).order("name_en", { ascending: true }).limit(500);
  if (error) throw error;
  const { data: categoryRows, error: categoryError } = await supabaseAdmin.from("categories").select(categoryColumns);
  if (categoryError) throw categoryError;
  const categoryMap = new Map((categoryRows ?? []).map(row => [String(row.id), mapCategory(row)]));
  const mediaMap = await readProductMediaMap();
  return (data ?? []).filter(row => canonicalProductSlugs.has(row.slug)).map(row => { const category = categoryMap.get(String(row.category_id)) ?? { id: "", slug: "", nameEn: "", nameAr: "", nameBn: "", descriptionEn: "", descriptionAr: "", descriptionBn: "", imageUrl: null, accentColor: "teal" }; return { row, category }; }).filter(({ row, category }) => isMinimumSearchMatch(tokens, [row.name_en, row.name_ar, row.name_bn, row.slug, category.slug, category.nameEn, category.nameAr, category.nameBn])).map(({ row, category }) => ({ product: mapProduct(row, category.slug, mediaMap.get(String(row.id))?.images ?? []), category }));
}

export async function supabaseProduct(slug: string) {
  if (!hasSupabaseConfig) return null;
  const { data: productRow, error: productError } = await supabaseAdmin.from("products").select(productColumns).eq("slug", slug).eq("is_active", true).maybeSingle();
  if (productError) throw productError;
  if (!productRow || !canonicalProductSlugs.has(productRow.slug)) return undefined;
  const [cat, specs, links, approved, mediaSetting] = await Promise.all([
    supabaseAdmin.from("categories").select(categoryColumns).eq("id", productRow.category_id).maybeSingle(),
    supabaseAdmin.from("product_specifications").select(specificationColumns).eq("product_id", productRow.id).order("sort_order", { ascending: true }),
    supabaseAdmin.from("affiliate_links").select(affiliateColumns).eq("product_id", productRow.id).eq("is_active", true).order("is_primary", { ascending: false }),
    supabaseAdmin.from("reviews").select("id,rating,title,body,language,created_at,user_id").eq("product_id", productRow.id).eq("status", "approved").order("created_at", { ascending: true }),
    supabaseAdmin.from("site_settings").select("setting_value").eq("setting_key", mediaSettingKey(String(productRow.id))).maybeSingle(),
  ]);
  for (const response of [cat, specs, links, approved, mediaSetting]) if (response.error) throw response.error;
  const media = parsePublicMedia(mediaSetting.data?.setting_value);
  const reviews = (approved.data ?? []).map((row: any) => ({ id: String(row.id), rating: row.rating, title: row.title, body: row.body, language: row.language, createdAt: row.created_at, authorName: "Jafory shopper" }));
  const category = cat.data ? mapCategory(cat.data) : { id: "", slug: "", nameEn: "", nameAr: "", nameBn: "", descriptionEn: "", descriptionAr: "", descriptionBn: "", imageUrl: null, accentColor: "teal" };
  return { product: mapProduct(productRow, category.slug, media.images), category, media, specifications: (specs.data ?? []).map(mapSpec), affiliateLinks: (links.data ?? []).map(mapLink), reviews, rating: { count: reviews.length, average: reviews.length ? reviews.reduce((sum: number, row: any) => sum + row.rating, 0) / reviews.length : 0 } };
}

export async function supabaseCompare(ids: Array<string | number>) {
  if (!hasSupabaseConfig || ids.length === 0) return [];
  const uuidIds = ids.map(String);
  const { data, error } = await supabaseAdmin.from("products").select(productColumns).in("id", uuidIds).eq("is_active", true);
  if (error) throw error;
  const rows = (data ?? []).filter(row => canonicalProductSlugs.has(row.slug));
  const result = await Promise.all(rows.map(async row => { const detail = await supabaseProduct(row.slug); return detail ?? null; }));
  return ids.flatMap(id => result.filter(item => item && String(item.product.id) === String(id)));
}
