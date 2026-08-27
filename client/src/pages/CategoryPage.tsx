import { ArrowLeft, Grid2X2, Layers3 } from "lucide-react";
import { useLocation } from "wouter";
import CatalogProductCard from "@/components/CatalogProductCard";
import StorefrontLayout from "@/components/StorefrontLayout";
import { useCommerce } from "@/contexts/CommerceContext";
import { localized, ui } from "@/lib/localization";
import { trpc } from "@/lib/trpc";
import { fallbackCategories } from "@/lib/fallbackCategories";

export function categorySlugFromLocation(location: string) {
  const categoryMatch = location.match(/^\/categories\/([^/?#]+)\/?$/);
  return categoryMatch ? decodeURIComponent(categoryMatch[1]) : "";
}

export default function CategoryPage() {
  const [location] = useLocation();
  // Prefer the browser pathname: a retained Wouter location can incorrectly
  // report the category index after a direct mobile deep link.
  const pathname = typeof window === "undefined" ? location : window.location.pathname;
  const slug = categorySlugFromLocation(pathname);
  const categoryIndex = !slug;
  const shell = trpc.catalog.home.useQuery();
  const query = trpc.catalog.category.useQuery({ slug: slug || "all" }, { enabled: Boolean(slug), retry: 1 });
  const { language } = useCommerce();
  const copy = ui(language);
  const content = query.data;
  const countLabel = content && content.products.length === 1 ? copy.productLabel : copy.productsLabel;
  const categoryCards = shell.data?.categories?.length ? shell.data.categories : fallbackCategories;
  

  return <StorefrontLayout categories={shell.data?.categories ?? []} socialLinks={shell.data?.socialLinks ?? []} settings={shell.data?.settings ?? []}>
    <section className="catalog-hero"><div className="container"><a className="breadcrumb" href="/"><ArrowLeft size={14} />{copy.returnHome}</a>{content ? <><p className="eyebrow eyebrow--dark"><span className="eyebrow__dot" />{copy.categories}</p><h1>{localized(content.category, "name", language)}</h1><p>{localized(content.category, "description", language)}</p></> : <><h1>{copy.categories}</h1><p>{copy.chooseCategory}</p></>}</div></section>
    <section className="section catalog-section"><div className="container">{categoryIndex ? <div className="category-grid category-grid--index" aria-busy={shell.isLoading}>{shell.isLoading ? Array.from({ length: 6 }, (_, index) => <div className="category-card category-card--skeleton" key={index}><span><strong /><small /></span></div>) : categoryCards.map(category => <a className="category-card" key={String(category.id)} href={`/categories/${String(category.slug)}`}><span><strong>{localized(category, "name", language)}</strong><small>{localized(category, "description", language)}</small></span><ArrowLeft className="category-card__arrow" size={18} /></a>)}</div> : query.isLoading ? <div className="catalog-loading" aria-busy="true"><div className="catalog-loading__line" /><div className="catalog-loading__grid">{Array.from({ length: 6 }, (_, index) => <div key={index} className="catalog-loading__card" />)}</div></div> : query.isError ? <div className="empty-catalog"><Layers3 size={28} /><p>Unable to load this category right now. Please try again.</p><a className="text-link" href="/">{copy.returnHome}</a></div> : content ? <><div className="catalog-meta"><span><Grid2X2 size={16} />{content.products.length} {countLabel}</span><span>{copy.compareLimit}</span></div>{content.products.length ? <div className="product-grid">{content.products.map(product => <CatalogProductCard key={product.id} product={product} category={content.category} />)}</div> : <div className="empty-catalog"><Layers3 size={28} /><p>{copy.noProducts}</p></div>}</> : <div className="empty-catalog"><Layers3 size={28} /><p>{copy.noProducts}</p></div>}</div></section>
  </StorefrontLayout>;
}
