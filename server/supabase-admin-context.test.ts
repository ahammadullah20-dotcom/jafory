import { describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({
  getUserFromToken: vi.fn(),
  getProfile: vi.fn(),
  authenticateRequest: vi.fn(),
}));

vi.mock("./supabase", () => ({
  getSupabaseUserFromAccessToken: auth.getUserFromToken,
  getSupabaseProfile: auth.getProfile,
  toAppUser: (user: { id: string; email?: string | null; created_at: string; updated_at?: string; last_sign_in_at?: string | null }, profile: { display_name?: string | null; email?: string | null; role?: string } | null) => ({
    id: user.id,
    openId: user.id,
    name: profile?.display_name ?? user.email?.split("@")[0] ?? "Jafory user",
    email: profile?.email ?? user.email ?? null,
    loginMethod: "supabase",
    role: profile?.role === "admin" ? "admin" as const : "user" as const,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at ?? user.created_at),
    lastSignedIn: new Date(user.last_sign_in_at ?? user.created_at),
  }),
}));

vi.mock("./_core/sdk", () => ({ sdk: { authenticateRequest: auth.authenticateRequest } }));

import { createContext } from "./_core/context";
import { appRouter } from "./routers";

describe("Supabase bearer role mapping", () => {
  it("maps a bearer session with a non-admin profile to user and forbids administration", async () => {
    auth.getUserFromToken.mockResolvedValue({ id: "guest-id", email: "guest@example.test", created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z", last_sign_in_at: "2026-01-01T00:00:00.000Z" });
    auth.getProfile.mockResolvedValue({ id: "guest-id", email: "guest@example.test", display_name: "Guest", role: "user" });
    const context = await createContext({ req: { headers: { authorization: "Bearer guest-access-token" } }, res: {} } as any);
    expect(context.user?.role).toBe("user");
    const admin = appRouter.createCaller(context).admin;
    const category = { slug: "guest-test", nameEn: "Guest", nameAr: "Guest", nameBn: "Guest", descriptionEn: null, descriptionAr: null, descriptionBn: null, imageUrl: null, accentColor: "#0F766E", sortOrder: 0, isActive: 1 };
    const product = { categoryId: 1, slug: "guest-test", nameEn: "Guest", nameAr: "Guest", nameBn: "Guest", shortDescriptionEn: null, shortDescriptionAr: null, shortDescriptionBn: null, descriptionEn: null, descriptionAr: null, descriptionBn: null, imageUrl: null, badgeEn: null, badgeAr: null, badgeBn: null, isFeatured: 0, isActive: 1 };
    const slide = { eyebrowEn: "Jafory", eyebrowAr: "Jafory", eyebrowBn: "Jafory", titleEn: "Guest", titleAr: "Guest", titleBn: "Guest", bodyEn: null, bodyAr: null, bodyBn: null, ctaLabelEn: "Explore", ctaLabelAr: "Explore", ctaLabelBn: "Explore", ctaUrl: "/", imageUrl: null, tone: "teal", sortOrder: 0, isActive: 1 };
    const requests = [
      admin.overview(), admin.categories.list(), admin.categories.save({ data: category }),
      admin.products.list({}), admin.products.save({ data: product }), admin.products.delete({ id: 1 }),
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
