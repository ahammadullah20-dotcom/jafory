import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../../..");
const read = (relativePath: string) => readFileSync(resolve(root, relativePath), "utf8");

describe("storefront and phone-admin shell regressions", () => {
  it("removes the duplicate footer tagline and reserves contact actions for the one expandable floating launcher", () => {
    const source = read("client/src/components/StorefrontLayout.tsx");
    expect(source).not.toContain("footer-dock");
    expect(source).toContain("<span>WhatsApp</span>");
    expect(source).toContain("<span>Call</span>");
    expect(source).toContain("<span>Chat</span>");
    expect(source).toContain("<span>Email</span>");
  });

  it("keeps market and language selectors visible in the compact storefront header", () => {
    const source = read("client/src/components/StorefrontLayout.tsx");
    const css = read("client/src/index.css");
    expect(source).toContain('className="header-mobile-controls"');
    expect(source).toContain('"pakistan", "india", "global"');
    expect(source).toContain('{ value: "ur", label: "اردو" }');
    expect(source).toContain('{ value: "hi", label: "हिन्दी" }');
    expect(css).toContain("@media(max-width:820px){.header-main");
    expect(css).toContain(".header-mobile-controls{order:4;display:grid");
    expect(css).toContain("@media (pointer:coarse) and (min-width:821px)");
  });

  it("includes a coarse-pointer safety net that removes a delayed desktop sidebar from phones", () => {
    const dashboard = read("client/src/components/DashboardLayout.tsx");
    const css = read("client/src/index.css");
    expect(dashboard).toContain('className="admin-dashboard-shell"');
    expect(css).toContain('@media (pointer:coarse){.admin-dashboard-shell>.relative{display:none!important}');
    expect(css).toContain('.admin-dashboard-shell>[data-slot="sidebar-inset"]{width:100%!important');
  });

  it("keeps phone chrome singular and puts filtered current products before the optional editor", () => {
    const dashboard = read("client/src/components/DashboardLayout.tsx");
    const admin = read("client/src/pages/AdminPage.tsx");
    const css = read("client/src/index.css");
    expect(dashboard).toContain('<span className="admin-mobile-context">Control menu</span>');
    expect(dashboard).not.toContain('className="admin-mobile-brand"');
    expect(css).toContain('@media (pointer:coarse){.footer-dock{display:none!important}');
    expect(admin.indexOf('const currentProducts =')).toBeLessThan(admin.indexOf('className="admin-panel admin-product-editor"'));
    expect(admin).toContain('Add a product (optional fields)');
  });
});
