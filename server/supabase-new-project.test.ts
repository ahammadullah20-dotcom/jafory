import { describe, expect, it } from "vitest";

describe("new clean Jafory Supabase configuration", () => {
  it("accepts the configured public key at the Auth settings endpoint", async () => {
    const url = (process.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
    const key = process.env.VITE_SUPABASE_ANON_KEY ?? "";
    expect(url).toMatch(/^https:\/\/[^/]+\.supabase\.co$/);
    expect(key).toMatch(/^sb_(publishable|anon)_/);

    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    expect(response.ok).toBe(true);
    const payload = await response.json() as { external?: Record<string, unknown> };
    expect(payload).toHaveProperty("external");

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    expect(serviceRoleKey.length).toBeGreaterThan(20);
    const serverResponse = await fetch(`${url}/auth/v1/settings`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });
    expect(serverResponse.ok).toBe(true);
  }, 15_000);
});
