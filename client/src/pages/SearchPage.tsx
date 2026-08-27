import { Search, SlidersHorizontal } from "lucide-react";
import { useSearch } from "wouter";
import CatalogProductCard from "@/components/CatalogProductCard";
import StorefrontLayout from "@/components/StorefrontLayout";
import { useCommerce } from "@/contexts/CommerceContext";
import { ui } from "@/lib/localization";
import { trpc } from "@/lib/trpc";

export default function SearchPage() {
  const queryString = useSearch();
  const term = new URLSearchParams(queryString).get("q") ?? "";
  const shell = trpc.catalog.home.useQuery();
  const results = trpc.catalog.search.useQuery({ query: term });
  const { language } = useCommerce();
  const copy = ui(language);
  const resultTitle = term ? `${copy.searchResults} “${term}”` : copy.search;
  return <StorefrontLayout categories={shell.data?.categories ?? []} socialLinks={shell.data?.socialLinks ?? []} settings={shell.data?.settings ?? []}>
    <section className="catalog-hero catalog-hero--short"><div className="container"><p className="eyebrow eyebrow--dark"><span className="eyebrow__dot" />{copy.search}</p><h1>{resultTitle}</h1></div></section>
    <section className="section catalog-section"><div className="container"><div className="catalog-meta"><span><Search size={16} />{results.data?.length ?? 0} {copy.matches}</span><span><SlidersHorizontal size={16} />{copy.market}</span></div>{results.isLoading ? <div className="page-loading">{copy.searching}</div> : results.data?.length ? <div className="product-grid">{results.data.map(result => <CatalogProductCard key={result.product.id} product={result.product} category={result.category} />)}</div> : <div className="empty-catalog"><Search size={28} /><p>{copy.tryDifferent}</p></div>}</div></section>
  </StorefrontLayout>;
}
