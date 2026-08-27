import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("authenticated admin resilience", () => {
  it("passes one auth snapshot into the dashboard shell instead of reading the session twice", () => {
    const adminPage = source("client/src/pages/AdminPage.tsx");
    const dashboard = source("client/src/components/DashboardLayout.tsx");

    expect(adminPage).toContain("auth={{ loading, user, logout }}");
    expect(dashboard).toContain("export type DashboardAuth");
    expect(dashboard).not.toContain("const { loading, user } = useAuth();");
    expect(dashboard).not.toContain("const { user, logout } = useAuth();");
  });

  it("shows a retryable account error instead of allowing a silent blank state", () => {
    const adminPage = source("client/src/pages/AdminPage.tsx");

    expect(adminPage).toContain("Jafory account could not be loaded");
    expect(adminPage).toContain("The sign-in session could not be read on this device");
    expect(adminPage).toContain("onClick={() => void refresh()}");
    expect(adminPage).toContain("Admin verification took too long");
    expect(adminPage).toContain("Retry admin verification");
    expect(adminPage).toContain("await serverAuthorization.refetch()");
  });

  it("keeps the legacy /ad entry point inside the protected admin flow", () => {
    const app = source("client/src/App.tsx");

    expect(app).toContain('<Route path="/ad" component={LegacyAdminRoute} />');
    expect(app).toContain('setLocation("/admin", { replace: true })');
  });

  it("keeps customer magic links while giving /admin a separate password form", () => {
    const authEntry = source("client/src/const.ts");
    const accountPage = source("client/src/pages/AccountPage.tsx");
    const adminPage = source("client/src/pages/AdminPage.tsx");

    expect(authEntry).toContain('callback.searchParams.set("next", safeNextPath(nextPath))');
    expect(authEntry).toContain('emailRedirectTo: callback.toString()');
    expect(adminPage).toContain("function AdminPasswordSignIn");
    expect(adminPage).toContain("supabase.auth.signInWithPassword");
    expect(adminPage).toContain('href="/account"');
    expect(accountPage).toContain('nextPath === "/admin"');
    expect(accountPage).toContain('window.location.replace("/admin")');
  });

  it("routes a recovery hash arriving at the root into the dedicated recovery screen", () => {
    const app = source("client/src/App.tsx");

    expect(app).toContain("function RecoveryHashRedirect()");
    expect(app).toContain('window.location.pathname === "/"');
    expect(app).toContain('window.location.hash.includes("type=recovery")');
    expect(app).toContain('setLocation(`/account?recovery=1${window.location.hash}`, { replace: true })');
    expect(app).toContain('<Route path="/" component={Home} />');
  });

  it("renders a dedicated password recovery form instead of dropping reset links on the homepage", () => {
    const accountPage = source("client/src/pages/AccountPage.tsx");

    expect(accountPage).toContain('params.get("recovery") === "1"');
    expect(accountPage).toContain("Set a new password");
    expect(accountPage).toContain("Confirm new password");
    expect(accountPage).toContain("supabase.auth.updateUser({ password })");
    expect(accountPage).toContain("The passwords do not match.");
    expect(accountPage).toContain('href="/admin"');
    expect(accountPage).not.toContain("console.log(password)");
  });

  it("wraps the application so an embedded-browser render exception has a visible fallback", () => {
    const main = source("client/src/main.tsx");
    const boundary = source("client/src/components/ErrorBoundary.tsx");

    expect(main).toContain("import ErrorBoundary from \"./components/ErrorBoundary\";");
    expect(main).toContain("<ErrorBoundary>");
    expect(boundary).toContain("An unexpected error occurred.");
    expect(boundary).toContain("Reload Page");
  });
});
