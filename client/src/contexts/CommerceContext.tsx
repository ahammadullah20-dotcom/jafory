import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { marketForTimeZone } from "@shared/regions";
import { useRef } from "react";
import { clearComparisonProducts, defaultLanguageForMarket, isClientMarket, languageForMarketChange, toggleComparisonProduct, type ClientLanguage, type ClientMarket } from "@/lib/commerceState";

export type Market = ClientMarket;
export type Language = ClientLanguage;

type CommerceContextValue = {
  market: Market;
  language: Language;
  compareIds: string[];
  setMarket: (market: Market) => void;
  setLanguage: (language: Language) => void;
  toggleCompare: (productId: string) => void;
  clearComparison: () => void;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

function detectInitialMarket(): Market {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return marketForTimeZone(timeZone);
}

export function CommerceProvider({ children }: { children: ReactNode }) {
  const manualLanguageThisVisit = useRef(false);
  const [market, setMarketState] = useState<Market>(() => {
    const saved = window.localStorage.getItem("jafory-market") as Market | null;
    return saved && isClientMarket(saved) ? saved : detectInitialMarket();
  });
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = window.localStorage.getItem("jafory-language") as Language | null;
    const selectedManually = window.localStorage.getItem("jafory-language-manual") === "1";
    const savedForMarket = window.localStorage.getItem("jafory-language-market");
    // Old cache entries were not tied to a market and could leave UAE in English.
    return selectedManually && savedForMarket === market && saved && ["en", "ar", "bn", "ur", "hi"].includes(saved) ? saved : defaultLanguageForMarket(market);
  });
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("jafory-compare") ?? "[]");
      return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string" && id.length > 0).slice(0, 4) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem("jafory-market", market);
    window.localStorage.setItem("jafory-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [market, language]);

  useEffect(() => {
    window.localStorage.setItem("jafory-compare", JSON.stringify(compareIds));
  }, [compareIds]);

  const value = useMemo<CommerceContextValue>(
    () => ({
      market,
      language,
      compareIds,
      setMarket: nextMarket => {
        const manuallySelected = manualLanguageThisVisit.current;
        setMarketState(nextMarket);
        setLanguageState(languageForMarketChange({ currentLanguage: language, nextMarket, wasChosenManually: manuallySelected }));
        if (manuallySelected) {
          window.localStorage.setItem("jafory-language-market", nextMarket);
        } else {
          window.localStorage.removeItem("jafory-language-market");
        }
      },
      setLanguage: nextLanguage => {
        manualLanguageThisVisit.current = true;
        window.localStorage.setItem("jafory-language-manual", "1");
        window.localStorage.setItem("jafory-language-market", market);
        setLanguageState(nextLanguage);
      },
      toggleCompare: productId => {
          setCompareIds(previous => toggleComparisonProduct(previous, productId));
      },
      clearComparison: () => setCompareIds(clearComparisonProducts()),
    }),
    [compareIds, language, market],
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) throw new Error("useCommerce must be used inside CommerceProvider");
  return context;
}
