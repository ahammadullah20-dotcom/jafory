import { useCallback, useEffect, useState } from "react";
import { supabase, hasSupabaseBrowserConfig } from "@/lib/supabase";

export type ClientUser = { id: string; openId: string; name: string; email: string | null; role: "admin" | "user" };

type UseAuthOptions = { redirectOnUnauthenticated?: boolean; redirectPath?: string };

async function readUser(): Promise<ClientUser | null> {
  if (!hasSupabaseBrowserConfig) return null;
  const { data: sessionData } = await supabase.auth.getSession();
  const authUser = sessionData.session?.user;
  if (!authUser) return null;
  const { data: profile } = await supabase.from("profiles").select("id,email,display_name,role").eq("id", authUser.id).maybeSingle();
  return { id: authUser.id, openId: authUser.id, name: profile?.display_name ?? authUser.user_metadata?.display_name ?? authUser.email?.split("@")[0] ?? "Jafory user", email: profile?.email ?? authUser.email ?? null, role: profile?.role === "admin" ? "admin" : "user" };
}

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try { setUser(await readUser()); setError(null); } catch (value) { setError(value instanceof Error ? value : new Error("Unable to read account")); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void refresh();
    const { data } = supabase.auth.onAuthStateChange(() => { window.setTimeout(() => void refresh(), 0); });
    return () => data.subscription.unsubscribe();
  }, [refresh]);

  const logout = useCallback(async () => { const { error: signOutError } = await supabase.auth.signOut(); if (signOutError) throw signOutError; setUser(null); }, []);

  useEffect(() => { if (redirectOnUnauthenticated && !loading && !user && redirectPath && window.location.pathname !== redirectPath) window.location.assign(redirectPath); }, [loading, redirectOnUnauthenticated, redirectPath, user]);

  return { user, loading, error, isAuthenticated: Boolean(user), logout, refresh };
}
