import { Armchair, BrainCircuit, Headphones, Shirt, Sparkles, Tv, type LucideIcon, Zap } from "lucide-react";

const artBySlug: Record<string, LucideIcon> = { electronics: Zap, fashion: Shirt, "home-living": Armchair, "beauty-wellness": Sparkles, "aero-sound-pro": Headphones, "lumaview-55-4k": Tv, "swiftcharge-power-bank": Zap, "everyday-carry-tote": Shirt, "calm-brew-kettle": Armchair, "radiance-care-set": Sparkles };

export function ProductArt({ slug, imageUrl, tone = "teal", compact = false }: { slug: string; imageUrl?: string | null; tone?: string; compact?: boolean }) {
  const inferredIcon = /ai|aws|azure|google|ibm|nvidia|coursera|datacamp|fastai|openai|microsoft/i.test(slug) ? BrainCircuit : /anker|samsung|apple|sony|jbl|belkin|ugreen|logitech|xiaomi|tp-link|charger|power|buds|ipad|tablet|watch/i.test(slug) ? Zap : /nike|adidas|levis|crocs|zara|ray-ban|uniqlo|backpack|tote|bag/i.test(slug) ? Shirt : /ikea|ninja|philips|dyson|kallax|airfryer|cooker|vacuum/i.test(slug) ? Armchair : /cerave|nivea|dove|maybelline|ordinary|colgate|listerine|vaseline|oral-b|gillette/i.test(slug) ? Sparkles : Sparkles;
  const Icon = artBySlug[slug] ?? inferredIcon;
  const validImage = typeof imageUrl === "string" && /^(data:image\/|https?:\/\/|\/)/.test(imageUrl);
  return (
    <div className={`product-art product-art--${tone} ${compact ? "product-art--compact" : ""}`}>
      {validImage ? <img className="product-art__image" src={imageUrl!} alt="" loading="lazy" /> : <><div className="product-art__orb product-art__orb--one" /><div className="product-art__orb product-art__orb--two" /><Icon strokeWidth={1.35} /></>}
    </div>
  );
}
