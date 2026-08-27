import { supabase, hasSupabaseBrowserConfig } from "@/lib/supabase";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

function safeNextPath(next?: string) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/account";
  return next;
}

export async function startLogin(email?: string, nextPath?: string) {
  if (!hasSupabaseBrowserConfig) {
    window.alert("Supabase authentication is not configured yet.");
    return;
  }
  const address = email?.trim() || window.prompt("Enter your email to receive a Jafory sign-in link:")?.trim();
  if (!address) return;
  const callback = new URL("/account", window.location.origin);
  callback.searchParams.set("next", safeNextPath(nextPath));
  const { error } = await supabase.auth.signInWithOtp({ email: address, options: { emailRedirectTo: callback.toString() } });
  if (error) { window.alert(error.message); return; }
  window.alert("A secure sign-in link has been sent. Check your inbox and spam folder, then return to Jafory.");
}
