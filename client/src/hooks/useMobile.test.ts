import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { isPhoneLikeDevice, isPhoneUserAgent } from "./useMobile";

describe("phone layout detection", () => {
  it("identifies Android and iPhone user agents even if a phone asks for desktop-width content", () => {
    expect(isPhoneUserAgent("Mozilla/5.0 (Linux; Android 14; SM-A556E) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36")).toBe(true);
    expect(isPhoneUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1")).toBe(true);
    expect(isPhoneUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36")).toBe(false);
  });

  it("keeps a touch-capable phone in the compact shell when it requests desktop-width content", () => {
    expect(isPhoneLikeDevice({ compactViewport: false, phoneUserAgent: true, coarsePointer: true, touchPoints: 5 })).toBe(true);
    expect(isPhoneLikeDevice({ compactViewport: false, phoneUserAgent: false, coarsePointer: false, touchPoints: 0 })).toBe(false);
  });

  it("supports legacy MediaQueryList listeners used by embedded/custom browsers", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/hooks/useMobile.tsx"), "utf8");
    expect(source).toContain('typeof mediaQuery.addEventListener === "function"');
    expect(source).toContain('typeof mediaQuery.addListener === "function"');
    expect(source).toContain("typeof window.matchMedia === \"function\"");
  });
});
