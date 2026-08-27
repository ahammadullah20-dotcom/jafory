import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const marketValues = ["uae", "bangladesh", "global"] as const;
export const languageValues = ["en", "ar", "bn"] as const;

export const categories = mysqlTable(
  "categories",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    nameEn: varchar("nameEn", { length: 180 }).notNull(),
    nameAr: varchar("nameAr", { length: 180 }).notNull(),
    nameBn: varchar("nameBn", { length: 180 }).notNull(),
    descriptionEn: text("descriptionEn"),
    descriptionAr: text("descriptionAr"),
    descriptionBn: text("descriptionBn"),
    imageUrl: text("imageUrl"),
    accentColor: varchar("accentColor", { length: 24 }).default("#0F766E").notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
    isActive: int("isActive").default(1).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("categories_slug_unique").on(table.slug)],
);

export const products = mysqlTable(
  "products",
  {
    id: int("id").autoincrement().primaryKey(),
    categoryId: int("categoryId").notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    nameEn: varchar("nameEn", { length: 255 }).notNull(),
    nameAr: varchar("nameAr", { length: 255 }).notNull(),
    nameBn: varchar("nameBn", { length: 255 }).notNull(),
    shortDescriptionEn: text("shortDescriptionEn"),
    shortDescriptionAr: text("shortDescriptionAr"),
    shortDescriptionBn: text("shortDescriptionBn"),
    descriptionEn: text("descriptionEn"),
    descriptionAr: text("descriptionAr"),
    descriptionBn: text("descriptionBn"),
    imageUrl: text("imageUrl"),
    badgeEn: varchar("badgeEn", { length: 80 }),
    badgeAr: varchar("badgeAr", { length: 80 }),
    badgeBn: varchar("badgeBn", { length: 80 }),
    isFeatured: int("isFeatured").default(0).notNull(),
    isActive: int("isActive").default(1).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("products_slug_unique").on(table.slug)],
);

export const productSpecifications = mysqlTable("productSpecifications", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  groupEn: varchar("groupEn", { length: 120 }).default("General").notNull(),
  groupAr: varchar("groupAr", { length: 120 }).default("عام").notNull(),
  groupBn: varchar("groupBn", { length: 120 }).default("সাধারণ").notNull(),
  labelEn: varchar("labelEn", { length: 160 }).notNull(),
  labelAr: varchar("labelAr", { length: 160 }).notNull(),
  labelBn: varchar("labelBn", { length: 160 }).notNull(),
  valueEn: text("valueEn").notNull(),
  valueAr: text("valueAr").notNull(),
  valueBn: text("valueBn").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const affiliateLinks = mysqlTable("affiliateLinks", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  market: mysqlEnum("market", marketValues).notNull(),
  merchantName: varchar("merchantName", { length: 140 }).notNull(),
  destinationUrl: text("destinationUrl").notNull(),
  priceDisplay: varchar("priceDisplay", { length: 80 }),
  availabilityText: varchar("availabilityText", { length: 120 }),
  isPrimary: int("isPrimary").default(1).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const heroSlides = mysqlTable("heroSlides", {
  id: int("id").autoincrement().primaryKey(),
  eyebrowEn: varchar("eyebrowEn", { length: 140 }).notNull(),
  eyebrowAr: varchar("eyebrowAr", { length: 140 }).notNull(),
  eyebrowBn: varchar("eyebrowBn", { length: 140 }).notNull(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  titleBn: varchar("titleBn", { length: 255 }).notNull(),
  bodyEn: text("bodyEn"),
  bodyAr: text("bodyAr"),
  bodyBn: text("bodyBn"),
  ctaLabelEn: varchar("ctaLabelEn", { length: 100 }).notNull(),
  ctaLabelAr: varchar("ctaLabelAr", { length: 100 }).notNull(),
  ctaLabelBn: varchar("ctaLabelBn", { length: 100 }).notNull(),
  ctaUrl: text("ctaUrl").notNull(),
  imageUrl: text("imageUrl"),
  tone: varchar("tone", { length: 32 }).default("teal").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(),
  title: varchar("title", { length: 180 }),
  body: text("body").notNull(),
  language: mysqlEnum("language", languageValues).default("en").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "hidden"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const socialLinks = mysqlTable(
  "socialLinks",
  {
    id: int("id").autoincrement().primaryKey(),
    network: mysqlEnum("network", ["facebook", "instagram", "x", "whatsapp", "youtube", "tiktok"]).notNull(),
    url: text("url").notNull(),
    isActive: int("isActive").default(1).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("social_links_network_unique").on(table.network)],
);

export const siteSettings = mysqlTable(
  "siteSettings",
  {
    id: int("id").autoincrement().primaryKey(),
    settingKey: varchar("settingKey", { length: 160 }).notNull(),
    settingValue: text("settingValue").notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("site_settings_key_unique").on(table.settingKey)],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type HeroSlide = typeof heroSlides.$inferSelect;
export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type ProductSpecification = typeof productSpecifications.$inferSelect;
export type Review = typeof reviews.$inferSelect;
