import { createClient, type SupabaseClient, type User as SupabaseUser } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "") ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const hasSupabaseConfig = Boolean(url && serviceRoleKey);

export const supabaseAdmin: SupabaseClient = createClient(url || "https://invalid.supabase.co", serviceRoleKey || "invalid", {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function getSupabaseUserFromAccessToken(accessToken: string): Promise<SupabaseUser | null> {
  if (!hasSupabaseConfig || !accessToken) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) return null;
  return data.user;
}

export async function getSupabaseProfile(userId: string) {
  if (!hasSupabaseConfig) return null;
  const { data, error } = await supabaseAdmin.from("profiles").select("id,email,display_name,role").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export function toAppUser(user: SupabaseUser, profile: { id: string; email: string | null; display_name: string | null; role: string } | null) {
  return {
    id: user.id,
    openId: user.id,
    name: profile?.display_name ?? user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "Jafory user",
    email: profile?.email ?? user.email ?? null,
    loginMethod: "supabase",
    role: profile?.role === "admin" ? "admin" as const : "user" as const,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at ?? user.created_at),
    lastSignedIn: new Date(user.last_sign_in_at ?? user.created_at),
  };
}
