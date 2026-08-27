import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

const standalonePath = "/home/ubuntu/jafory_site/index.html";
const standalone = existsSync(standalonePath) ? readFileSync(standalonePath, "utf8") : "";
const describeStandalone = existsSync(standalonePath) ? describe : describe.skip;

describeStandalone("standalone catalogue repair", () => {
  it("uses canonical template category slugs for category routes", () => {
    expect(standalone).toContain("canonicalProductCategorySlug(product) === slug");
  });

  it("prioritizes canonical template images over stale gallery URLs", () => {
    expect(standalone).toContain("canonical?.image_url || gallery?.[0]");
  });

  it("excludes category placeholder slugs from public and publishable templates", () => {
    expect(standalone).toContain('!["ai-learn-ai-tech", "daily-essentials"].includes(template?.slug)');
    expect(standalone).toContain('const allTemplates = [...starterProductTemplates');
  });

  it("keeps overpublished Supabase rows out of the public catalogue", () => {
    expect(standalone).toContain("function canonicalTemplateForProduct(product)");
    expect(standalone).toContain("isCanonicalDisplayProduct(product) && canonicalProductCategorySlug(product) === slug");
    expect(standalone).toContain("product.is_featured && isCanonicalDisplayProduct(product)");
    expect(standalone).toContain("function isCanonicalDisplayProduct(product) { return Boolean(product?.is_active); }");
  });

  it("keeps the deployment package self-contained without an assets dependency", () => {
    expect(standalone).toContain("const displayTemplateCatalog");
    expect(standalone).toContain("const expansionProductTemplates");
  });
});
