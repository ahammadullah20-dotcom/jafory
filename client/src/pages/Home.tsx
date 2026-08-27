import { ArrowRight, ChevronRight, CircleHelp, Layers3, Scale, Search, ShieldCheck } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import { ProductArt } from "@/components/ProductArt";
import StorefrontLayout from "@/components/StorefrontLayout";
import { useCommerce } from "@/contexts/CommerceContext";
import { localized, ui } from "@/lib/localization";
import { trpc } from "@/lib/trpc";
import { fallbackCategories } from "@/lib/fallbackCategories";

type RecordData = Record<string, unknown>;

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div><p className="eyebrow eyebrow--dark"><span className="eyebrow__dot" />{eyebrow}</p><h2>{title}</h2></div>{action}</div>;
}

function ProductCard({ product, category }: { product: RecordData; category: RecordData }) {
  const { language, compareIds, toggleCompare } = useCommerce();
  const copy = ui(language);
  const selected = compareIds.includes(String(product.id));
  const productName = localized(product, "name", language);
  return (
    <article className="product-card">
      <a className="product-card__image" href={`/products/${String(product.slug)}`}><ProductArt slug={String(product.slug)} imageUrl={typeof product.imageUrl === "string" ? product.imageUrl : null} tone={String(category.accentColor ?? "teal")} /></a>
      <div className="product-card__content">
        <span className="product-card__category">{localized(category, "name", language)}</span>
        <a href={`/products/${String(product.slug)}`}><h3>{productName}</h3></a>
        <p>{localized(product, "shortDescription", language)}</p>
        <div className="product-card__actions"><a href={`/products/${String(product.slug)}`} className="text-link">{copy.shop}<ChevronRight size={15} /></a><button type="button" className={selected ? "compare-toggle is-selected" : "compare-toggle"} onClick={() => toggleCompare(String(product.id))} aria-pressed={selected}><Scale size={15} />{selected ? copy.viewComparison : copy.compare}</button></div>
      </div>
    </article>
  );
}

function HomeLoadingShell({ copy }: { copy: ReturnType<typeof ui> }) {
  return <>
    <section className="hero hero--loading"><div className="container hero-loading__inner"><p className="eyebrow"><span className="eyebrow__dot" />Jafory</p><h1>{copy.discover} · {copy.compareClear} · {copy.chooseSmarter}</h1><p>{copy.markets}</p><div className="hero-loading__line" /></div></section>
    <section className="trust-band"><div className="container trust-band__grid"><div><Search size={20} /><span><strong>{copy.discover}</strong><small>{copy.curatedStartingPoints}</small></span></div><div><Scale size={20} /><span><strong>{copy.compareClear}</strong><small>{copy.specsClear}</small></span></div><div><ShieldCheck size={20} /><span><strong>{copy.chooseSmarter}</strong><small>{copy.marketSpecific}</small></span></div></div></section>
    <section className="section section--categories"><div className="container"><SectionHeading eyebrow={copy.curated} title={copy.categories} /><div className="category-grid" aria-busy="true">{Array.from({ length: 6 }, (_, index) => <div className="category-card category-card--skeleton" key={index}><span><strong /><small /></span></div>)}</div></div></section>
  </>;
}

function HomeFallbackHero({ copy }: { copy: ReturnType<typeof ui> }) {
  return <section className="hero hero--loading hero--fallback"><div className="container hero-loading__inner"><p className="eyebrow"><span className="eyebrow__dot" />Jafory</p><h1>{copy.discover} · {copy.compareClear} · {copy.chooseSmarter}</h1><p>{copy.markets}</p><a className="button button--gold" href="/categories">{copy.categories}<ArrowRight size={17} /></a></div></section>;
}

export default function Home() {
  const home = trpc.catalog.home.useQuery();
  const { language } = useCommerce();
  const copy = ui(language);
  const data = home.data;
  const categories = data?.categories?.length ? data.categories : fallbackCategories;
  const featured = data?.featuredProducts ?? [];

  return (
    <StorefrontLayout categories={categories} socialLinks={data?.socialLinks ?? []} settings={data?.settings ?? []}>
      {home.isLoading ? <HomeLoadingShell copy={copy} /> : <>
        {data?.slides?.length ? <HeroCarousel slides={data.slides} /> : <HomeFallbackHero copy={copy} />}
        <section className="trust-band"><div className="container trust-band__grid"><div><Search size={20} /><span><strong>{copy.discover}</strong><small>{copy.curatedStartingPoints}</small></span></div><div><Scale size={20} /><span><strong>{copy.compareClear}</strong><small>{copy.specsClear}</small></span></div><div><ShieldCheck size={20} /><span><strong>{copy.chooseSmarter}</strong><small>{copy.marketSpecific}</small></span></div></div></section>
        <section className="section section--categories"><div className="container"><SectionHeading eyebrow={copy.curated} title={copy.categories} action={<a className="text-link text-link--heading" href="/">{copy.explore}<ArrowRight size={16} /></a>} /><div className="category-grid">{categories.map(category => <a className="category-card" key={String(category.id)} href={`/categories/${String(category.slug)}`}><ProductArt slug={String(category.slug)} imageUrl={typeof category.imageUrl === "string" ? category.imageUrl : null} tone={String(category.accentColor ?? "teal")} compact /><span><strong>{localized(category, "name", language)}</strong><small>{localized(category, "description", language)}</small></span><ArrowRight className="category-card__arrow" size={18} /></a>)}</div></div></section>
        <section className="section section--featured"><div className="container"><SectionHeading eyebrow={copy.jAforyEdit} title={copy.featured} action={<a className="text-link text-link--heading" href="/compare">{copy.compare}<ArrowRight size={16} /></a>} />{featured.length ? <div className="product-grid">{featured.filter(item => item.category).map(item => <ProductCard key={String(item.product.id)} product={item.product} category={item.category!} />)}</div> : <div className="empty-catalog"><Layers3 size={28} /><p>{copy.noProducts}</p></div>}</div></section>
        <section className="section section--guide"><div className="container guide-panel"><div><p className="eyebrow"><span className="eyebrow__dot" />{copy.guideEyebrow}</p><h2>{copy.guideTitle}</h2><p>{copy.subtitle}</p></div><a href="/compare" className="button button--gold"><Scale size={18} />{copy.compare}</a><CircleHelp className="guide-panel__icon" aria-hidden="true" /></div></section>
        <section className="section section--information"><div className="container"><SectionHeading eyebrow={copy.informationEyebrow} title={copy.informationTitle} /><div className="six-topic-strip" aria-label={copy.informationEyebrow}><a href="/about"><strong>{copy.about}</strong><span>{copy.topicAboutDesc}</span></a><a href="/privacy"><strong>{copy.privacy}</strong><span>{copy.topicPrivacyDesc}</span></a><a href="/disclosure"><strong>{copy.disclosure}</strong><span>{copy.topicDisclosureDesc}</span></a><a href="/contact"><strong>{copy.contact}</strong><span>{copy.topicContactDesc}</span></a><a href="/terms"><strong>{copy.terms}</strong><span>{copy.topicTermsDesc}</span></a><a href="/readiness"><strong>{copy.reviewEvidence}</strong><span>{copy.topicReviewDesc}</span></a></div></div></section>
      </>}
    </StorefrontLayout>
  );
}
