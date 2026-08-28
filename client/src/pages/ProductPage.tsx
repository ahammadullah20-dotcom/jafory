import { Check, ChevronRight, ExternalLink, MessageSquarePlus, Scale, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import { useRoute } from "wouter";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { ProductArt } from "@/components/ProductArt";
import StorefrontLayout from "@/components/StorefrontLayout";
import { useCommerce } from "@/contexts/CommerceContext";
import { localized, marketName, ui } from "@/lib/localization";
import { trpc } from "@/lib/trpc";
import { chooseAffiliateDestination } from "@shared/affiliate";

function Stars({ rating, small = false }: { rating: number; small?: boolean }) {
  return <span className={small ? "stars stars--small" : "stars"}>{[1, 2, 3, 4, 5].map(value => <Star key={value} fill={value <= Math.round(rating) ? "currentColor" : "none"} />)}</span>;
}

export default function ProductPage() {
  const [, params] = useRoute("/products/:slug");
  const slug = params?.slug ?? "";
  const shell = trpc.catalog.home.useQuery();
  const detail = trpc.catalog.product.useQuery({ slug });
  const { user, isAuthenticated } = useAuth();
  const { language, market, compareIds, toggleCompare } = useCommerce();
  const copy = ui(language);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const createReview = trpc.review.create.useMutation({ onSuccess: () => { setTitle(""); setBody(""); } });
  const data = detail.data;

  if (!data && !detail.isLoading) return <StorefrontLayout categories={shell.data?.categories ?? []} socialLinks={shell.data?.socialLinks ?? []} settings={shell.data?.settings ?? []}><div className="not-found-stage">This Jafory product is not available.</div></StorefrontLayout>;
  const product = data?.product;
  const affiliateMarket = market === "uae" || market === "bangladesh" ? market : "global";
  const reviewLanguage = language === "ur" || language === "hi" ? "en" : language;
  const link = data ? chooseAffiliateDestination(data.affiliateLinks as any, affiliateMarket) : undefined;
  const selected = product ? compareIds.includes(String(product.id)) : false;

  return <StorefrontLayout categories={shell.data?.categories ?? []} socialLinks={shell.data?.socialLinks ?? []} settings={shell.data?.settings ?? []}>
    {detail.isLoading || !data || !product ? <div className="page-loading page-loading--tall">Loading product</div> : <>
      <section className="product-detail"><div className="container"><div className="breadcrumb-row"><a className="breadcrumb" href={`/categories/${data.category.slug}`}>{localized(data.category, "name", language)}</a><ChevronRight size={13} /><span>{localized(product, "name", language)}</span></div><div className="product-detail__grid"><div className="product-detail__art"><ProductArt slug={product.slug} imageUrl={product.imageUrl} tone={data.category.accentColor} /></div><div className="product-detail__copy"><span className="product-card__category">{localized(data.category, "name", language)}</span><h1>{localized(product, "name", language)}</h1><div className="product-rating">{data.rating.count ? <><Stars rating={data.rating.average} small /><strong>{data.rating.average.toFixed(1)}</strong><a href="#reviews">{data.rating.count} {copy.reviews}</a></> : <span>No verified reviews yet</span>}</div><p>{localized(product, "description", language)}</p><div className="product-detail__buttons"><button className={selected ? "button button--outline is-selected" : "button button--outline"} onClick={() => toggleCompare(String(product.id))}><Scale size={17} />{selected ? copy.viewComparison : copy.compare}</button>{selected && compareIds.length >= 2 && <a href="/compare" className="button button--gold">{copy.viewComparison}</a>}</div></div><aside className="market-offer"><p className="eyebrow eyebrow--dark"><span className="eyebrow__dot" />{marketName(market, language)}</p><h2>{link?.merchantName ?? "No retailer configured"}</h2><p>{link?.availabilityText ?? "A retailer link will appear when it is configured in the admin panel."}</p>{link ? <a className="button button--teal" href={link.destinationUrl} target="_blank" rel="sponsored noopener noreferrer">{copy.shop}<ExternalLink size={16} /></a> : <span className="market-offer__empty">Retailer configuration needed</span>}<small><ShieldCheck size={13} />Retailer price and availability are confirmed off-site.</small></aside></div></div></section>
      <section className="section product-specs"><div className="container"><div className="section-heading"><div><p className="eyebrow eyebrow--dark"><span className="eyebrow__dot" />Compare details</p><h2>Product specifications</h2></div></div><div className="spec-list">{data.specifications.length ? data.specifications.map(spec => <div key={spec.id}><span>{localized(spec, "label", language)}</span><strong>{localized(spec, "value", language)}</strong></div>) : <p>No specifications have been added yet.</p>}</div></div></section>
      <section className="section reviews-section" id="reviews"><div className="container reviews-layout"><div><p className="eyebrow eyebrow--dark"><span className="eyebrow__dot" />{copy.reviews}</p><h2>Reviews from Jafory users</h2><p className="reviews-intro">Only approved submissions are displayed. Jafory does not create or publish simulated customer reviews.</p>{data.reviews.length ? <div className="review-list">{data.reviews.map(review => <article className="review-card" key={review.id}><Stars rating={review.rating} small /><h3>{review.title ?? "Jafory review"}</h3><p>{review.body}</p><small>{review.authorName ?? "Jafory user"} · {new Date(review.createdAt).toLocaleDateString()}</small></article>)}</div> : <div className="review-empty"><Star size={25} /><p>There are no approved reviews yet.</p></div>}</div><aside className="review-form"><MessageSquarePlus size={21} /><h3>Share your product perspective</h3>{isAuthenticated ? <form onSubmit={event => { event.preventDefault(); createReview.mutate({ productId: String(product.id), rating, title: title || undefined, body, language: reviewLanguage }); }}><label>Rating<div className="rating-input">{[1,2,3,4,5].map(value => <button type="button" aria-label={`${value} stars`} className={value <= rating ? "is-active" : ""} key={value} onClick={() => setRating(value)}><Star fill="currentColor" /></button>)}</div></label><label>Title<input value={title} onChange={event => setTitle(event.target.value)} maxLength={180} placeholder="Optional review title" /></label><label>Your review<textarea value={body} onChange={event => setBody(event.target.value)} minLength={20} maxLength={2400} required placeholder="Write at least 20 characters about your experience." /></label><button className="button button--teal" disabled={createReview.isPending}>{createReview.isPending ? "Submitting" : "Submit for approval"}</button>{createReview.isSuccess && <p className="form-success"><Check size={15} />Sent for review</p>}{createReview.error && <p className="form-error">{createReview.error.message}</p>}</form> : <><p>Sign in to submit an authentic review. Your submission will be held for administrator approval.</p><button className="button button--teal" onClick={() => void startLogin()}>Sign in to review</button></>}</aside></div></section>
    </>}
  </StorefrontLayout>;
}
