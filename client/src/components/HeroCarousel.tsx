import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCommerce } from "@/contexts/CommerceContext";
import { localized, ui } from "@/lib/localization";

type Slide = Record<string, unknown>;

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const { language } = useCommerce();
  const copy = ui(language);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = slides.length;

  useEffect(() => {
    if (total < 2) return;
    const timer = window.setInterval(() => setActiveIndex(index => (index + 1) % total), 5000);
    return () => window.clearInterval(timer);
  }, [total]);

  useEffect(() => setActiveIndex(index => Math.min(index, Math.max(total - 1, 0))), [total]);

  if (!total) return null;
  const activeSlide = slides[activeIndex];
  const activeTone = typeof activeSlide.tone === "string" ? activeSlide.tone : "teal";

  return (
    <section className={`hero hero--${activeTone}`} aria-label={copy.promotions}>
      <div className="hero__viewport">
        <div className="hero__track" style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}>
          {slides.map((slide, index) => {
            const imageUrl = typeof slide.imageUrl === "string" && slide.imageUrl && !slide.imageUrl.startsWith("data:") ? slide.imageUrl : null;
            const rawCtaUrl = typeof slide.ctaUrl === "string" ? slide.ctaUrl : "/";
            const ctaUrl = rawCtaUrl.replace(/^#\/?/, "/").replace(/^\/category\//, "/categories/");
            return <div className="hero__slide" key={String(slide.id ?? index)} aria-hidden={index !== activeIndex}>
              <div className="container hero__inner">
                <div className="hero__copy">
                  <p className="eyebrow"><span className="eyebrow__dot" />{localized(slide, "eyebrow", language)}</p>
                  <h1>{localized(slide, "title", language)}</h1>
                  <p className="hero__body">{localized(slide, "body", language)}</p>
                  <a className="button button--light" href={ctaUrl} tabIndex={index === activeIndex ? 0 : -1}>{localized(slide, "ctaLabel", language)} <ArrowRight size={17} /></a>
                </div>
                <div className="hero__display" aria-hidden="true">
                  {imageUrl ? <img className="hero__configured-image" src={imageUrl} alt="" /> : <><div className="hero__halo" /><div className="hero__card hero__card--front"><span>J</span><strong>Jafory</strong><small>{copy.tagline}</small></div><div className="hero__card hero__card--back"><span>01</span><i /></div><div className="hero__spark hero__spark--one" /><div className="hero__spark hero__spark--two" /></>}
                </div>
              </div>
            </div>;
          })}
        </div>
      </div>
      <div className="container hero__progress hero__progress--carousel" aria-label={copy.promotions}>{slides.map((item, index) => <button type="button" key={String(item.id ?? index)} className={index === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(index)} aria-label={`${copy.showSlide} ${index + 1}`} />)}</div>
      {total > 1 && <div className="hero__arrows"><button type="button" onClick={() => setActiveIndex(index => (index - 1 + total) % total)} aria-label={copy.previousSlide}><ChevronLeft size={20} /></button><button type="button" onClick={() => setActiveIndex(index => (index + 1) % total)} aria-label={copy.nextSlide}><ChevronRight size={20} /></button></div>}
    </section>
  );
}
