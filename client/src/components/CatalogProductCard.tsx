import { ChevronRight, Scale } from "lucide-react";
import { ProductArt } from "@/components/ProductArt";
import { useCommerce } from "@/contexts/CommerceContext";
import { localized, ui } from "@/lib/localization";

export default function CatalogProductCard({ product, category }: { product: Record<string, unknown>; category: Record<string, unknown> }) {
  const { language, compareIds, toggleCompare } = useCommerce();
  const copy = ui(language);
  const selected = compareIds.includes(String(product.id));
  return (
    <article className="product-card">
      <a className="product-card__image" href={`/products/${String(product.slug)}`}><ProductArt slug={String(product.slug)} imageUrl={typeof product.imageUrl === "string" ? product.imageUrl : null} tone={String(category.accentColor ?? "teal")} /></a>
      <div className="product-card__content">
        <span className="product-card__category">{localized(category, "name", language)}</span>
        <a href={`/products/${String(product.slug)}`}><h3>{localized(product, "name", language)}</h3></a>
        <p>{localized(product, "shortDescription", language)}</p>
        <div className="product-card__actions"><a href={`/products/${String(product.slug)}`} className="text-link">{copy.shop}<ChevronRight size={15} /></a><button type="button" className={selected ? "compare-toggle is-selected" : "compare-toggle"} onClick={() => toggleCompare(String(product.id))} aria-pressed={selected}><Scale size={15} />{selected ? `${copy.compare} ✓` : copy.compare}</button></div>
      </div>
    </article>
  );
}
