import { ArrowRight, ExternalLink, Scale, X } from "lucide-react";
import { ProductArt } from "@/components/ProductArt";
import StorefrontLayout from "@/components/StorefrontLayout";
import { useCommerce } from "@/contexts/CommerceContext";
import { localized, marketName, ui } from "@/lib/localization";
import { trpc } from "@/lib/trpc";
import { chooseAffiliateDestination } from "@shared/affiliate";

export default function ComparePage() {
  const shell = trpc.catalog.home.useQuery();
  const { language, market, compareIds, clearComparison, toggleCompare } = useCommerce();
  const copy = ui(language);
  const idsForQuery = compareIds.length >= 2 ? compareIds : ["00000000-0000-0000-0000-000000000000"];
  const comparison = trpc.catalog.compare.useQuery({ productIds: idsForQuery }, { enabled: compareIds.length >= 2 });
  const products = (comparison.data ?? []).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const labelOrder = Array.from(new Set(products.flatMap(item => item.specifications.map(spec => spec.labelEn))));
  const affiliateMarket = market === "uae" || market === "bangladesh" ? market : "global";

  return <StorefrontLayout categories={shell.data?.categories ?? []} socialLinks={shell.data?.socialLinks ?? []} settings={shell.data?.settings ?? []}>
    <section className="catalog-hero catalog-hero--short"><div className="container"><p className="eyebrow eyebrow--dark"><span className="eyebrow__dot" />Jafory tools</p><h1>Compare with clarity.</h1><p>{copy.compareLimit}. Review full specifications and market-appropriate retailer links in one place.</p></div></section>
    <section className="section comparison-section"><div className="container">{compareIds.length < 2 ? <div className="comparison-empty"><Scale size={32} /><h2>Add two or more products to compare.</h2><p>Select the comparison button from any category or product page. Jafory will keep your selection while you browse.</p><a href="/categories/electronics" className="button button--teal">Explore products <ArrowRight size={16} /></a></div> : comparison.isLoading ? <div className="page-loading">Building comparison</div> : <><div className="comparison-actions"><span>{products.length} products · {marketName(market, language)}</span><button type="button" onClick={clearComparison}>Clear comparison</button></div><div className="comparison-scroll"><div className="comparison-table" style={{ gridTemplateColumns: `180px repeat(${products.length}, minmax(230px, 1fr))` }}><div className="comparison-table__label comparison-table__label--top">Products</div>{products.map(item => <div className="comparison-product" key={item.product.id}><button type="button" className="comparison-remove" onClick={event => { event.preventDefault(); event.stopPropagation(); toggleCompare(String(item.product.id)); }} aria-label="Remove from comparison"><X size={15} /></button><ProductArt slug={item.product.slug} tone={item.category.accentColor} compact /><span>{localized(item.category, "name", language)}</span><h3>{localized(item.product, "name", language)}</h3></div>)}<div className="comparison-table__label">Retailer</div>{products.map(item => { const link = chooseAffiliateDestination(item.affiliateLinks, affiliateMarket); return <div className="comparison-cell comparison-cell--merchant" key={`merchant-${item.product.id}`}>{link ? <a href={link.destinationUrl} target="_blank" rel="sponsored noreferrer">{copy.shop}<ExternalLink size={14} /></a> : "Not configured"}</div>; })}{labelOrder.map(label => <><div className="comparison-table__label" key={`label-${label}`}>{localized(products.flatMap(item => item.specifications).find(spec => spec.labelEn === label)!, "label", language)}</div>{products.map(item => { const spec = item.specifications.find(candidate => candidate.labelEn === label); return <div className="comparison-cell" key={`${label}-${item.product.id}`}>{spec ? localized(spec, "value", language) : "—"}</div>; })}</>)}</div></div></>}</div></section>
  </StorefrontLayout>;
}
