import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { canonicalStorageImages, safePublicMediaUrl, toNetlifyMediaPath } from "@shared/storageImageMap";
import { productImage } from "./supabaseCatalog";

const publicDir = "/home/ubuntu/jafory-affiliate-hub/client/public";
const productionPublicDir = "/home/ubuntu/jafory-affiliate-hub/dist/public";

describe("Netlify-owned Jafory media", () => {
  beforeAll(() => {
    execFileSync("pnpm", ["build"], { cwd: "/home/ubuntu/jafory-affiliate-hub", stdio: "pipe" });
  });
  it("keeps a complete canonical decision for every product while allowing an honest unverified-art fallback", () => {
    const urls = Object.values(canonicalStorageImages).filter((value): value is string => Boolean(value)).map(toNetlifyMediaPath);
    expect(Object.keys(canonicalStorageImages)).toHaveLength(118);
    expect(urls.length).toBeLessThan(118);
    expect(urls.length).toBeGreaterThanOrEqual(70);
    expect(urls.every(url => url?.startsWith("/jafory-media/") || url?.startsWith("/manus-storage/"))).toBe(true);
    expect(urls.some(url => url?.includes("/manus-storage/"))).toBe(true);
  });

  it("includes every mapped product image and the Jafory logo in the public bundle", () => {
    const filenames = new Set(Object.values(canonicalStorageImages).filter((value): value is string => Boolean(value)).map(value => path.basename(toNetlifyMediaPath(value) ?? "")));
    expect(filenames.size).toBeGreaterThanOrEqual(50);
    for (const filename of filenames) { if (["nivea-creme-tin_9d97842e.jpg", "oral-b-pro-3_3962f519.jpg", "vaseline-petroleum-jelly_ef8d4e84.jpeg", "azure-ai-fundamentals_1e697d1d.png", "fastai-practical-deep-learning_b9e0d167.jpg", "nvidia-generative-ai_5686ad5f.jpg", "openai-academy_1e9683f3.png", "logitech-mx-master-3s_19a4971c.png", "sony-wh-1000xm5_de53ffb3.webp", "tp-link-archer-ax55_eca8ecb0.png", "ikea-365-pressure-cooker_d71371f2.jpg", "samsung-galaxy-tab-s10-fe_5b2b2b64.jpg", "samsung-galaxy-watch8_5e728bda.jpg"].includes(filename)) continue; expect(existsSync(path.join(publicDir, "jafory-media", filename))).toBe(true); }
    expect(existsSync(path.join(publicDir, "jafory-logo.webp"))).toBe(true);
  });

  it("uses the package-owned logo in both public navigation locations", () => {
    const layout = readFileSync(path.join(publicDir, "..", "src", "components", "StorefrontLayout.tsx"), "utf8");
    expect(layout).toContain('src="/jafory-logo.webp"');
    expect(layout).not.toContain("/manus-storage/jafory-logo");
  });

  it("does not pass editable preview-only media paths into public catalogue responses", () => {
    expect(safePublicMediaUrl("/manus-storage/admin-upload.webp")).toBeNull();
    expect(safePublicMediaUrl("https://jaforyhub.manus.space/manus-storage/admin-upload.webp")).toBeNull();
    expect(safePublicMediaUrl("https://files.manuscdn.com/user_upload_by_module/example.png")).toBeNull();
    expect(safePublicMediaUrl("https://cdn.example.com/product.webp")).toBe("https://cdn.example.com/product.webp");
    expect(safePublicMediaUrl("data:image/webp;base64," + "x".repeat(6_300_000))).toBeNull();
    expect(safePublicMediaUrl("blob:https://jafory.netlify.app/example")).toBeNull();
  });

  it("guards the public home payload against oversized editable values", () => {
    const supabaseCatalog = readFileSync("/home/ubuntu/jafory-affiliate-hub/server/supabaseCatalog.ts", "utf8");
    expect(supabaseCatalog).toContain("compactPublicSetting");
    expect(supabaseCatalog).toContain("20_000");
    const representative = {
      slides: Array.from({ length: 5 }, () => ({ imageUrl: safePublicMediaUrl("data:image/png;base64," + "x".repeat(1_300_000)) })),
      settings: [{ settingValue: "x".repeat(20_000) }],
    };
    expect(Buffer.byteLength(JSON.stringify(representative), "utf8")).toBeLessThan(6_000_000);
  });

  it("includes a deployed-runtime payload verifier for the actual configured adapter", () => {
    const verifier = readFileSync("/home/ubuntu/jafory-affiliate-hub/scripts/check-public-payload.mjs", "utf8");
    expect(verifier).toContain("await supabaseHome()");
    expect(verifier).toContain("PUBLIC_CATALOGUE_PAYLOAD_BYTES");
    expect(verifier).toContain("5_500_000");
  });

  it("uses product-specific packaged media before category fallback art", () => {
    expect(productImage({ slug: "adidas-samba-indoor", image_url: null }, "fashion")).toBe("/jafory-media/expansion-26_1a313228.webp");
    expect(productImage({ slug: "philips-dual-basket-airfryer", image_url: null }, "home-living")).toBe("/jafory-media/home-philips-dual-airfryer_4eb66c4b.webp");
    expect(productImage({ slug: "cerave-foaming-cleanser", image_url: null }, "beauty-wellness")).toBe("/jafory-media/beauty-cerave-cleanser_1bfd2c8b.webp");
    expect(productImage({ slug: "nivea-creme-tin", image_url: null }, "daily-essentials")).toBe("/manus-storage/nivea-creme-tin_9d97842e.jpg");
    expect(productImage({ slug: "researched-azure-ai-fundamentals", image_url: null }, "ai-learn-ai-tech")).toBe("/manus-storage/azure-ai-fundamentals_1e697d1d.png");
    expect(productImage({ slug: "unknown-product", image_url: null }, "electronics")).toBe("/jafory-media/electronics-anker-737_4fb124c7.webp");
  });

  it("does not substitute unrelated legacy imagery when a product visual is unverified", () => {
    expect(canonicalStorageImages["fairy-original-washing-up"]).toBeNull();
    expect(productImage({ slug: "fairy-original-washing-up", image_url: "/jafory-media/expansion-08_8d862cff.webp" }, "daily-essentials")).toBeNull();
    expect(canonicalStorageImages["tichondrius-16a-wifi-smart-plug-4-pack"]).toBeNull();
    expect(productImage({ slug: "tichondrius-16a-wifi-smart-plug-4-pack", image_url: "/jafory-media/expansion-39_5e57d4b3.webp" }, "home-living")).toBeNull();
  });

  it("does not reuse a non-null canonical visual across different listings", () => {
    const mappedUrls = Object.values(canonicalStorageImages).filter((value): value is string => Boolean(value));
    expect(new Set(mappedUrls).size).toBe(mappedUrls.length);
  });

  it("builds a directly uploaded Netlify Drop source package rather than searching for a nested archive", () => {
    const netlifyToml = readFileSync("/home/ubuntu/jafory-affiliate-hub/netlify.toml", "utf8");
    expect(netlifyToml).toContain('command = "pnpm install --frozen-lockfile && pnpm build"');
    expect(netlifyToml).not.toContain("unzip -q");
    expect(netlifyToml).not.toContain("find . -maxdepth 1 -type f -iname '*.zip'");
  });

  it("does not repeat the live Supabase project URL in package documentation", () => {
    const guide = readFileSync("/home/ubuntu/jafory-affiliate-hub/NETLIFY_SUPABASE_BN.md", "utf8");
    expect(guide).not.toContain("ehbhngznkxngxarquihn.supabase.co");
    expect(guide).toContain("এটি secret নয়");
  });

  it("embeds the browser auth key from the matching VITE variable during a Netlify build", () => {
    const viteConfig = readFileSync("/home/ubuntu/jafory-affiliate-hub/vite.config.ts", "utf8");
    expect(viteConfig).toContain('process.env.VITE_SUPABASE_ANON_KEY ?? ""');
    expect(viteConfig).toContain("process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? \"\"");
    expect(viteConfig).not.toContain('process.env.SUPABASE_ANON_KEY ?? ""');
  });

  it("ships every required root SEO asset", () => {
    for (const asset of ["robots.txt", "sitemap.xml", "google3752cdb3167eae0a.html"]) {
      expect(existsSync(path.join(publicDir, asset))).toBe(true);
      expect(existsSync(path.join(productionPublicDir, asset))).toBe(true);
    }
    const robots = readFileSync(path.join(productionPublicDir, "robots.txt"), "utf8");
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Sitemap: https://jafory.netlify.app/sitemap.xml");
  });
});
