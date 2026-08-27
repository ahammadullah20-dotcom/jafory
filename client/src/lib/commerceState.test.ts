import { describe, expect, it } from "vitest";
import { clearComparisonProducts, defaultLanguageForMarket, isClientMarket, languageForMarketChange, toggleComparisonProduct } from "./commerceState";

describe("client commerce state", () => {
  it("uses the correct regional default language when a market is selected", () => {
    expect(defaultLanguageForMarket("uae")).toBe("ar");
    expect(defaultLanguageForMarket("bangladesh")).toBe("bn");
    expect(defaultLanguageForMarket("pakistan")).toBe("ur");
    expect(defaultLanguageForMarket("india")).toBe("hi");
    expect(defaultLanguageForMarket("global")).toBe("en");
    expect(isClientMarket("uae")).toBe(true);
    expect(isClientMarket("pakistan")).toBe(true);
    expect(isClientMarket("india")).toBe(true);
    expect(isClientMarket("other")).toBe(false);
  });

  it("uses new market defaults unless the visitor explicitly chose a language", () => {
    expect(languageForMarketChange({ currentLanguage: "en", nextMarket: "india", wasChosenManually: false })).toBe("hi");
    expect(languageForMarketChange({ currentLanguage: "bn", nextMarket: "pakistan", wasChosenManually: true })).toBe("bn");
  });

  it("adds, removes, limits, and clears comparison selections in the client experience", () => {
    const twoItems = toggleComparisonProduct(["one"], "two");
    expect(twoItems).toEqual(["one", "two"]);
    expect(toggleComparisonProduct(twoItems, "one")).toEqual(["two"]);
    const fourItems = ["one", "two", "three", "four"];
    expect(toggleComparisonProduct(fourItems, "five")).toEqual(fourItems);
    expect(clearComparisonProducts()).toEqual([]);
  });
});
