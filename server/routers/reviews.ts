import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { reviews } from "../../drizzle/schema";
import { getDb } from "../db";
import { hasSupabaseConfig, supabaseAdmin } from "../supabase";
import { protectedProcedure, router } from "../_core/trpc";

const productIdSchema = z.union([z.string().uuid(), z.number().int().positive()]);

export const reviewRouter = router({
  create: protectedProcedure
    .input(z.object({ productId: productIdSchema, rating: z.number().int().min(1).max(5), title: z.string().trim().max(180).optional(), body: z.string().trim().min(20).max(2400), language: z.enum(["en", "ar", "bn"]) }))
    .mutation(async ({ ctx, input }) => {
      if (hasSupabaseConfig && typeof ctx.user.id === "string") {
        const { data: existing, error: existingError } = await supabaseAdmin.from("reviews").select("id").eq("user_id", ctx.user.id).eq("product_id", String(input.productId)).maybeSingle();
        if (existingError) throw existingError;
        if (existing) throw new Error("You have already submitted a review for this product");
        const { error } = await supabaseAdmin.from("reviews").insert({ product_id: String(input.productId), user_id: ctx.user.id, rating: input.rating, title: input.title || null, body: input.body, language: input.language, status: "pending" });
        if (error) throw error;
        return { success: true } as const;
      }

      if (typeof input.productId !== "number" || typeof ctx.user.id !== "number") throw new Error("This review requires a Supabase-authenticated session");
      const db = await getDb();
      if (!db) throw new Error("Database is currently unavailable");
      const existing = await db.select({ id: reviews.id }).from(reviews).where(and(eq(reviews.userId, ctx.user.id), eq(reviews.productId, input.productId))).limit(1);
      if (existing.length) throw new Error("You have already submitted a review for this product");
      await db.insert(reviews).values({ productId: input.productId, userId: ctx.user.id, rating: input.rating, title: input.title || null, body: input.body, language: input.language, status: "pending" });
      return { success: true } as const;
    }),
});
