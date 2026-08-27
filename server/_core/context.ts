import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getUserByOpenId } from "../db";
import { getSupabaseProfile, getSupabaseUserFromAccessToken, toAppUser } from "../supabase";
import { sdk } from "./sdk";

export type SupabaseAppUser = ReturnType<typeof toAppUser>;
export type AppUser = User | SupabaseAppUser;

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: AppUser | null;
};

function bearerToken(req: CreateExpressContextOptions["req"]) {
  const value = req.headers.authorization;
  return typeof value === "string" && value.startsWith("Bearer ") ? value.slice(7) : "";
}

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  const token = bearerToken(opts.req);
  if (token) {
    try {
      const supabaseUser = await getSupabaseUserFromAccessToken(token);
      if (supabaseUser) {
        const profile = await getSupabaseProfile(supabaseUser.id);
        return { req: opts.req, res: opts.res, user: toAppUser(supabaseUser, profile) };
      }
    } catch (error) {
      console.warn("[Supabase] Failed to read bearer session:", error);
    }
  }

  try {
    const user = await sdk.authenticateRequest(opts.req);
    return { req: opts.req, res: opts.res, user };
  } catch {
    return { req: opts.req, res: opts.res, user: null };
  }
}
