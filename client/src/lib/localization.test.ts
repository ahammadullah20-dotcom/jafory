import { describe, expect, it } from "vitest";
import { ui } from "./localization";

describe("Jafory public localization", () => {
  it("provides non-English navigation and contact labels", () => {
    const arabic = ui("ar");
    const bengali = ui("bn");
    expect(arabic.allCategories).toBe("جميع الفئات");
    expect(arabic.signOut).toBe("تسجيل الخروج");
    expect(arabic.informationTitle).not.toBe(ui("en").informationTitle);
    expect(bengali.allCategories).toBe("সব বিভাগ");
    expect(bengali.contact).toContain("জ্যাফরি");
    expect(bengali.tryDifferent).not.toBe(ui("en").tryDifferent);
  });

  it("keeps public labels available in every supported language", () => {
    for (const language of ["en", "ar", "bn", "ur", "hi"] as const) {
      const copy = ui(language);
      expect(copy.markets.length).toBeGreaterThan(0);
      expect(copy.promotions.length).toBeGreaterThan(0);
      expect(copy.previousSlide.length).toBeGreaterThan(0);
      expect(copy.nextSlide.length).toBeGreaterThan(0);
    }
  });
});
