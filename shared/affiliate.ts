export type AffiliateMarket = "uae" | "bangladesh" | "global";

export type AffiliateDestination = { id?: string | number; productId?: string | number; market: AffiliateMarket; isPrimary?: number; merchantName?: string; destinationUrl?: string; priceDisplay?: string | null; availabilityText?: string | null };

export function chooseAffiliateDestination<T extends AffiliateDestination>(links: T[], market: AffiliateMarket): T | undefined {
  return links.find(link => link.market === market && link.isPrimary !== 0) ?? links.find(link => link.market === market) ?? links.find(link => link.market === "global" && link.isPrimary !== 0) ?? links.find(link => link.market === "global") ?? links[0];
}

export function comparisonSelection<T extends string | number>(ids: T[]) {
  return Array.from(new Set(ids.filter(id => typeof id === "string" ? id.length > 0 : Number.isInteger(id) && (id as number) > 0))).slice(0, 4);
}
