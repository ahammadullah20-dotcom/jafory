export type ClientMarket = "uae" | "bangladesh" | "pakistan" | "india" | "global";
export type ClientLanguage = "en" | "ar" | "bn" | "ur" | "hi";

const languageDefaults: Record<ClientMarket, ClientLanguage> = { uae: "ar", bangladesh: "bn", pakistan: "ur", india: "hi", global: "en" };

export function isClientMarket(value: string): value is ClientMarket {
  return value === "uae" || value === "bangladesh" || value === "pakistan" || value === "india" || value === "global";
}

export function defaultLanguageForMarket(market: ClientMarket): ClientLanguage {
  return languageDefaults[market];
}

export function languageForMarketChange({ currentLanguage, nextMarket, wasChosenManually }: { currentLanguage: ClientLanguage; nextMarket: ClientMarket; wasChosenManually: boolean }) {
  return wasChosenManually ? currentLanguage : defaultLanguageForMarket(nextMarket);
}

export function toggleComparisonProduct(current: string[], productId: string) {
  if (current.includes(productId)) return current.filter(id => id !== productId);
  return current.length < 4 ? [...current, productId] : current;
}

export function clearComparisonProducts() {
  return [] as string[];
}
