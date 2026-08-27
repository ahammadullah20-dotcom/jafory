import { type FormEvent, useEffect, useState } from "react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { hasSupabaseBrowserConfig, supabase } from "@/lib/supabase";

function RecoveryComplete() {
  return <main className="account-page"><section><p className="account-page__eyebrow">Jafory account</p><h1>Password updated</h1><p>Your password has been changed securely. Sign in to the administrator page with the new password.</p><div className="account-page__actions"><a className="account-page__button" href="/admin">Continue to admin sign in</a><a className="account-page__button account-page__button--secondary" href="/">Return to storefront</a></div></section></main>;
}

function RecoveryUnavailable() {
  return <main className="account-page"><section><p className="account-page__eyebrow">Jafory account</p><h1>Reset link expired</h1><p>This recovery session is missing or has expired. Request a new reset email and open its link in a regular browser tab.</p><div className="account-page__actions"><a className="account-page__button" href="/admin">Return to admin sign in</a><a className="account-page__button account-page__button--secondary" href="/">Return to storefront</a></div></section></main>;
}

function PasswordRecoveryForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    if (!hasSupabaseBrowserConfig) {
      setErrorMessage("Password recovery is not configured on this deployment yet.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Use at least 8 characters for the new password.");
      return;
    }
    if (password !== confirmation) {
      setErrorMessage("The passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrorMessage(error.message || "The password could not be updated. Request a new reset link and try again.");
    } else {
      await supabase.auth.signOut();
      setCompleted(true);
    }
    setIsSubmitting(false);
  };

  if (completed) return <RecoveryComplete />;
  return <main className="account-page"><section><p className="account-page__eyebrow">Jafory account</p><h1>Set a new password</h1><p>Choose a new administrator password. It is used only by Supabase and is never displayed or sent to Jafory.</p><form className="admin-auth-form" onSubmit={submit}><label className="admin-field"><span>New password</span><input type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} required /></label><label className="admin-field"><span>Confirm new password</span><input type="password" autoComplete="new-password" value={confirmation} onChange={event => setConfirmation(event.target.value)} required /></label>{errorMessage && <p className="admin-auth-error" role="alert">{errorMessage}</p>}<button className="admin-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Updating password…" : "Update password"}</button></form></section></main>;
}

export default function AccountPage() {
  const { loading, user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const params = new URLSearchParams(window.location.search);
  const nextPath = params.get("next");
  const [isRecovery] = useState(() => params.get("recovery") === "1" || params.get("type") === "recovery" || window.location.hash.includes("type=recovery"));
  const [recoverySettled, setRecoverySettled] = useState(false);

  useEffect(() => {
    if (!isRecovery) return;
    let settled = false;
    const settle = () => { settled = true; setRecoverySettled(true); };
    void supabase.auth.getSession().then(({ data }) => { if (data.session) settle(); });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || session) settle();
    });
    const timeout = window.setTimeout(() => { if (!settled) settle(); }, 5000);
    return () => { window.clearTimeout(timeout); data.subscription.unsubscribe(); };
  }, [isRecovery]);

  useEffect(() => {
    if (!loading && isAuthenticated && isAdmin && nextPath === "/admin" && window.location.pathname !== "/admin") {
      window.location.replace("/admin");
    }
  }, [isAdmin, isAuthenticated, loading, nextPath]);

  if (isRecovery) {
    if (loading || !recoverySettled) return <main className="account-page"><p>Preparing your secure password reset…</p></main>;
    if (!isAuthenticated) return <RecoveryUnavailable />;
    return <PasswordRecoveryForm />;
  }

  if (loading) return <main className="account-page"><p>Loading your Jafory account…</p></main>;
  if (!isAuthenticated) return <main className="account-page"><section><p className="account-page__eyebrow">Jafory account</p><h1>Sign in to continue</h1><p>Sign in to submit authentic product reviews and manage your account access.</p><button className="account-page__button" onClick={() => void startLogin()}>Sign in</button></section></main>;

  return <main className="account-page"><section><p className="account-page__eyebrow">Your Jafory account</p><h1>{user?.name || "Signed-in user"}</h1><p>{isAdmin ? "Your account is authorised to manage Jafory content." : "You can browse products and submit reviews. Administrator access is restricted to accounts explicitly granted the admin role."}</p><div className="account-page__actions">{isAdmin ? <a className="account-page__button" href="/admin">Open admin panel</a> : <a className="account-page__button" href="/">Browse products</a>}<button className="account-page__button account-page__button--secondary" onClick={() => void logout()}>Sign out</button></div></section></main>;
}
