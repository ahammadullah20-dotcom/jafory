import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function guestContext(): TrpcContext {
  return {
    user: { id: "guest-profile", openId: "guest-profile", name: "Guest", email: "guest@example.test", loginMethod: "supabase", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Supabase guest administration boundary", () => {
  it("forbids every admin procedure before a guest can read or change catalogue data", async () => {
    const admin = appRouter.createCaller(guestContext()).admin;
    const category = { slug: "guest-test", nameEn: "Guest", nameAr: "Guest", nameBn: "Guest", descriptionEn: null, descriptionAr: null, descriptionBn: null, imageUrl: null, accentColor: "#0F766E", sortOrder: 0, isActive: 1 };
    const product = { categoryId: 1, slug: "guest-test", nameEn: "Guest", nameAr: "Guest", nameBn: "Guest", shortDescriptionEn: null, shortDescriptionAr: null, shortDescriptionBn: null, descriptionEn: null, descriptionAr: null, descriptionBn: null, imageUrl: null, badgeEn: null, badgeAr: null, badgeBn: null, isFeatured: 0, isActive: 1 };
    const slide = { eyebrowEn: "Jafory", eyebrowAr: "Jafory", eyebrowBn: "Jafory", titleEn: "Guest", titleAr: "Guest", titleBn: "Guest", bodyEn: null, bodyAr: null, bodyBn: null, ctaLabelEn: "Explore", ctaLabelAr: "Explore", ctaLabelBn: "Explore", ctaUrl: "/", imageUrl: null, tone: "teal", sortOrder: 0, isActive: 1 };
    const requests = [
      admin.overview(), admin.categories.list(), admin.categories.save({ data: category }),
      admin.products.list({}), admin.products.save({ data: product }), admin.products.delete({ id: 1 }),
      admin.media.list({ productId: 1 }), admin.media.createUpload({ productId: 1, fileName: "guest.webp", contentType: "image/webp", size: 100 }), admin.media.commitUpload({ productId: 1, url: "https://example.supabase.co/storage/v1/object/public/jafory-media/guest.webp", kind: "image" }), admin.media.remove({ productId: 1, url: "https://example.supabase.co/storage/v1/object/public/jafory-media/guest.webp" }),
      admin.specifications.list({ productId: 1 }), admin.specifications.replace({ productId: 1, rows: [] }),
      admin.affiliateLinks.list({ productId: 1 }), admin.affiliateLinks.save({ data: { productId: 1, market: "uae", merchantName: "Guest retailer", destinationUrl: "https://example.test", priceDisplay: null, availabilityText: null, isPrimary: 1, isActive: 1 } }),
      admin.heroSlides.list(), admin.heroSlides.save({ data: slide }),
      admin.reviews.list(), admin.reviews.setStatus({ id: 1, status: "hidden" }),
      admin.socialLinks.list(), admin.socialLinks.save({ network: "facebook", url: "https://example.test", isActive: 1, sortOrder: 0 }),
      admin.settings.list(), admin.settings.save({ settingKey: "footerText", settingValue: "Guest" }),
    ];
    for (const request of requests) await expect(request).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
