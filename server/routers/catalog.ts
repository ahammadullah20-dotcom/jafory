import { z } from "zod";
import { getCategoryCatalog, getComparisonProducts, getHomeCatalog, getProductDetail, searchCatalog } from "../db";
import { supabaseCategory, supabaseCompare, supabaseHome, supabaseProduct, supabaseSearch } from "../supabaseCatalog";
import { publicProcedure, router } from "../_core/trpc";

export const catalogRouter = router({
  home: publicProcedure.query(async () => (await supabaseHome()) ?? getHomeCatalog()),
  category: publicProcedure.input(z.object({ slug: z.string().min(1).max(140) })).query(async ({ input }) => (await supabaseCategory(input.slug)) ?? getCategoryCatalog(input.slug)),
  product: publicProcedure.input(z.object({ slug: z.string().min(1).max(180) })).query(async ({ input }) => (await supabaseProduct(input.slug)) ?? getProductDetail(input.slug)),
  search: publicProcedure.input(z.object({ query: z.string().max(120) })).query(async ({ input }) => (await supabaseSearch(input.query)) ?? searchCatalog(input.query)),
  compare: publicProcedure.input(z.object({ productIds: z.array(z.union([z.string().uuid(), z.number().int().positive()])).min(1).max(4) })).query(async ({ input }) => (await supabaseCompare(input.productIds)) ?? getComparisonProducts(input.productIds.filter((value): value is number => typeof value === "number"))),
});
