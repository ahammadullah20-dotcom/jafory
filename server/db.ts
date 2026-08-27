import { and, asc, eq, inArray, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  affiliateLinks,
  categories,
  heroSlides,
  productSpecifications,
  products,
  reviews,
  siteSettings,
  socialLinks,
  users,
  type InsertUser,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { resolveJaforyRole } from "../shared/authRoles";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };

  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }

  const existing = (await db.select({ role: users.role }).from(users).where(eq(users.openId, user.openId)).limit(1))[0];
  values.role = resolveJaforyRole(user.openId, ENV.ownerOpenId, existing?.role);
  updateSet.role = values.role;

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getHomeCatalog() {
  const db = await getDb();
  if (!db) return { categories: [], slides: [], featuredProducts: [], socialLinks: [], settings: [] };

  const [activeCategories, slides, featuredProducts, socials, settings] = await Promise.all([
    db.select().from(categories).where(eq(categories.isActive, 1)).orderBy(asc(categories.sortOrder)),
    db.select().from(heroSlides).where(eq(heroSlides.isActive, 1)).orderBy(asc(heroSlides.sortOrder)).limit(5),
    db
      .select({ product: products, category: categories })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isActive, 1), eq(products.isFeatured, 1)))
      .orderBy(asc(products.nameEn)),
    db.select().from(socialLinks).where(eq(socialLinks.isActive, 1)).orderBy(asc(socialLinks.sortOrder)),
    db.select().from(siteSettings),
  ]);

  return { categories: activeCategories, slides, featuredProducts, socialLinks: socials, settings };
}

export async function getCategoryCatalog(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const category = (await db.select().from(categories).where(and(eq(categories.slug, slug), eq(categories.isActive, 1))).limit(1))[0];
  if (!category) return undefined;

  const categoryProducts = await db
    .select()
    .from(products)
    .where(and(eq(products.categoryId, category.id), eq(products.isActive, 1)))
    .orderBy(asc(products.nameEn));

  return { category, products: categoryProducts };
}

export async function searchCatalog(query: string) {
  const db = await getDb();
  if (!db || !query.trim()) return [];
  const tokens = query.toLocaleLowerCase().replace(/[^a-z0-9\u0600-\u06ff\u0900-\u097f\u0980-\u09ff]+/gi, " ").trim().split(/\s+/).filter(token => token.length >= 2).slice(0, 8);
  if (!tokens.length) return [];
  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isActive, 1))
    .orderBy(asc(products.nameEn));
  return rows.filter(({ product, category }) => {
    const haystack = [product.nameEn, product.nameAr, product.nameBn, product.slug, category.slug, category.nameEn, category.nameAr, category.nameBn].join(" ").toLocaleLowerCase().replace(/[^a-z0-9\u0600-\u06ff\u0900-\u097f\u0980-\u09ff]+/gi, " ");
    return tokens.some(token => haystack.includes(token) || haystack.split(" ").some(word => word.startsWith(token) || token.startsWith(word)));
  });
}

export async function getProductDetail(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const productRecord = (
    await db
      .select({ product: products, category: categories })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.slug, slug), eq(products.isActive, 1)))
      .limit(1)
  )[0];
  if (!productRecord) return undefined;

  const [specifications, links, approvedReviews, rating] = await Promise.all([
    db.select().from(productSpecifications).where(eq(productSpecifications.productId, productRecord.product.id)).orderBy(asc(productSpecifications.sortOrder)),
    db.select().from(affiliateLinks).where(and(eq(affiliateLinks.productId, productRecord.product.id), eq(affiliateLinks.isActive, 1))),
    db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        body: reviews.body,
        language: reviews.language,
        createdAt: reviews.createdAt,
        authorName: users.name,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(and(eq(reviews.productId, productRecord.product.id), eq(reviews.status, "approved")))
      .orderBy(asc(reviews.createdAt)),
    db
      .select({
        reviewCount: sql<number>`count(*)`,
        averageRating: sql<string>`coalesce(avg(${reviews.rating}), 0)`,
      })
      .from(reviews)
      .where(and(eq(reviews.productId, productRecord.product.id), eq(reviews.status, "approved"))),
  ]);

  return {
    ...productRecord,
    specifications,
    affiliateLinks: links,
    reviews: approvedReviews,
    rating: {
      count: Number(rating[0]?.reviewCount ?? 0),
      average: Number(rating[0]?.averageRating ?? 0),
    },
  };
}

export async function getComparisonProducts(ids: number[]) {
  const db = await getDb();
  if (!db || ids.length === 0) return [];

  const productRows = await db
    .select({ product: products, category: categories })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(inArray(products.id, ids), eq(products.isActive, 1)));

  const result = await Promise.all(
    productRows.map(async row => {
      const [specifications, links] = await Promise.all([
        db.select().from(productSpecifications).where(eq(productSpecifications.productId, row.product.id)).orderBy(asc(productSpecifications.sortOrder)),
        db.select().from(affiliateLinks).where(and(eq(affiliateLinks.productId, row.product.id), eq(affiliateLinks.isActive, 1))),
      ]);
      return { ...row, specifications, affiliateLinks: links };
    }),
  );

  return ids.flatMap(id => result.filter(item => item.product.id === id));
}
