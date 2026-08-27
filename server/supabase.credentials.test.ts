import { describe, expect, it } from "vitest";

describe("Supabase credentials", () => {
  it("can reach the configured Supabase REST endpoint with the public key", async () => {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    expect(url, "SUPABASE_URL must be configured").toMatch(/^https:\/\/[^/]+\.supabase\.co(?:\/rest\/v1)?\/?$/);
    expect(anonKey, "SUPABASE_ANON_KEY must be configured").toBeTruthy();

    const baseUrl = url!.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/rest/v1/`, {
      headers: { apikey: anonKey!, Authorization: `Bearer ${anonKey!}` },
    });
    expect(response.status).toBeLessThan(500);
  }, 15000);
});
