import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Facebook, Globe2, Headphones, Instagram, Mail, Menu, MessageCircle, Music2, PhoneCall, Search, ShieldCheck, ShoppingBag, Sparkles, Twitter, UserRound, X, Youtube } from "lucide-react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCommerce, type Language, type Market } from "@/contexts/CommerceContext";
import { marketName, ui } from "@/lib/localization";

type Category = Record<string, unknown>;
type SocialLink = Record<string, unknown>;

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "ar", label: "العربية" },
  { value: "bn", label: "বাংলা" },
  { value: "ur", label: "اردو" },
  { value: "hi", label: "हिन्दी" },
  { value: "en", label: "English" },
];
const marketOptions: Market[] = ["uae", "bangladesh", "pakistan", "india", "global"];
const socialIcons = { facebook: Facebook, instagram: Instagram, x: Twitter, whatsapp: MessageCircle, youtube: Youtube, tiktok: Music2 };
const isConfiguredUrl = (value: unknown) => typeof value === "string" && /^(https?:|mailto:|tel:)/i.test(value) && value.length > 12;

export default function StorefrontLayout({ children, categories, socialLinks, settings }: { children: ReactNode; categories: Category[]; socialLinks: SocialLink[]; settings: SocialLink[] }) {
  const { language, market, setLanguage, setMarket, compareIds } = useCommerce();
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const previousScroll = useRef(0);
  const copy = ui(language);
  const contactUrl = settings.find(item => item.settingKey === "contactUrl")?.settingValue;
  const configuredPhone = settings.find(item => item.settingKey === "contactPhone")?.settingValue;
  const phoneNumber = typeof configuredPhone === "string" && /^\+?[0-9()\-\s]{7,26}$/.test(configuredPhone.trim()) ? configuredPhone.trim() : "+971552650307";
  const chatUrl = settings.find(item => item.settingKey === "contactChatUrl")?.settingValue;
  const headerNotice = settings.find(item => item.settingKey === "headerNotice")?.settingValue;
  const footerText = settings.find(item => item.settingKey === "footerText")?.settingValue;
  const sidebarTitle = settings.find(item => item.settingKey === "sidebarTitle")?.settingValue;
  const whatsappUrl = typeof contactUrl === "string" && /^https?:\/\/wa\.me\//i.test(contactUrl) ? contactUrl : socialLinks.find(item => item.network === "whatsapp" && isConfiguredUrl(item.url))?.url ?? `https://wa.me/${phoneNumber.replace(/\D/g, "")}`;
  const configSocials = socialLinks.filter(item => item.isActive !== 0 && isConfiguredUrl(item.url));
  const closeMenu = () => setMobileOpen(false);
  const categoryLabel = (category: Category) => language === "ar" ? String(category.nameAr ?? category.nameEn ?? "") : language === "bn" ? String(category.nameBn ?? category.nameEn ?? "") : String(category.nameEn ?? "");
  const infoLinks = [
    ["/about", copy.about], ["/privacy", copy.privacy], ["/disclosure", copy.disclosure], ["/contact", copy.contact], ["/terms", copy.terms], ["/readiness", copy.reviewEvidence], ["/compare", copy.compareProducts],
  ] as const;

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  useEffect(() => {
    const updateDirection = () => {
      const current = Math.max(window.scrollY, 0);
      // Mobile browsers can retain a small scroll offset while their address bar
      // expands. Treat the opening viewport as the start state so both docks are
      // visible exactly as requested.
      const atStart = current < 120;
      const movingDown = current > previousScroll.current + 5;
      const movingUp = current < previousScroll.current - 5;
      if (atStart || movingUp) setHeaderVisible(true);
      if (movingDown) setHeaderVisible(false);
      previousScroll.current = current;
    };
    window.addEventListener("scroll", updateDirection, { passive: true });
    return () => window.removeEventListener("scroll", updateDirection);
  }, []);

  return (
    <div className="storefront" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="market-strip">
        <div className="container market-strip__inner">
          <span><Sparkles size={13} /> {typeof headerNotice === "string" && headerNotice.trim() ? headerNotice : copy.markets}</span>
          <span className="market-strip__note">{marketOptions.map(option => marketName(option, language)).join(" · ")}</span>
        </div>
      </div>
      <header className={`site-header ${headerVisible ? "site-header--visible" : "site-header--hidden"}`}>
        <div className="container header-main">
          <a href="/" className="brand" aria-label={copy.returnHome} onClick={closeMenu}>
            <img src="/jafory-logo.webp" alt="Jafory" />
            <span className="brand__copy"><strong>Jafory</strong><small>{copy.tagline}</small></span>
          </a>
          <form className="header-search" onSubmit={submitSearch}>
            <Search size={18} />
            <input aria-label={copy.search} value={query} onChange={event => setQuery(event.target.value)} placeholder={copy.search} />
            <button type="submit" aria-label={copy.search}><Search size={18} /></button>
          </form>
          <div className="header-actions">
            <label className="compact-select"><span>{copy.market}</span><select value={market} onChange={event => setMarket(event.target.value as Market)}>{marketOptions.map(option => <option key={option} value={option}>{marketName(option, language)}</option>)}</select></label>
            <label className="compact-select compact-select--language"><Globe2 size={15} /><span className="sr-only">{copy.language}</span><select aria-label={copy.language} value={language} onChange={event => setLanguage(event.target.value as Language)}>{languageOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
            {isAuthenticated ? <a className="account-link" href={user?.role === "admin" ? "/admin" : "/account"} aria-label={user?.role === "admin" ? copy.adminPanel : copy.yourAccount}><UserRound size={20} /><span>{user?.role === "admin" ? copy.adminPanel : copy.yourAccount}</span></a> : <button type="button" className="account-link" onClick={() => void startLogin()}><UserRound size={20} /><span>{copy.signIn}</span></button>}
          </div>
          <button type="button" className="mobile-menu-button" onClick={() => setMobileOpen(open => !open)} aria-label={mobileOpen ? copy.closeNavigation : copy.openNavigation}>{mobileOpen ? <X /> : <Menu />}</button>
          <div className="header-mobile-controls" aria-label={`${copy.market} and ${copy.language}`}>
            <label className="mobile-select"><span>{copy.market}</span><select value={market} onChange={event => setMarket(event.target.value as Market)}>{marketOptions.map(option => <option key={option} value={option}>{marketName(option, language)}</option>)}</select></label>
            <label className="mobile-select"><Globe2 size={14} /><span className="sr-only">{copy.language}</span><select aria-label={copy.language} value={language} onChange={event => setLanguage(event.target.value as Language)}>{languageOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          </div>
        </div>
        <div className={`header-nav ${mobileOpen ? "header-nav--open" : ""}`}>
          <div className="container header-nav__inner">
            <a href="/" onClick={closeMenu}><ShoppingBag size={17} />{copy.allCategories}</a>
            {categories.slice(0, 5).map(category => <a key={String(category.id)} href={`/categories/${String(category.slug)}`} onClick={closeMenu}>{categoryLabel(category)}</a>)}
            <a href="/compare" onClick={closeMenu}><ShieldCheck size={17} />{copy.compare}{compareIds.length > 0 && <b>{compareIds.length}</b>}</a>
          </div>
        </div>
      </header>
      <aside className={`storefront-sidebar ${mobileOpen ? "storefront-sidebar--open" : ""}`} aria-label={copy.openNavigation}>
        <div className="storefront-sidebar__head"><a href="/" className="storefront-sidebar__brand" onClick={closeMenu}><img src="/jafory-logo.webp" alt="Jafory" /><strong>Jafory</strong></a><button type="button" className="storefront-sidebar__close" onClick={closeMenu} aria-label={copy.closeNavigation}><X size={20} /></button></div>
        <div className="storefront-sidebar__account">{isAuthenticated ? <><strong>{user?.name || copy.yourAccount}</strong><span>{user?.email || copy.yourAccount}</span><a href={user?.role === "admin" ? "/admin" : "/account"} onClick={closeMenu}>{user?.role === "admin" ? copy.openAdmin : copy.openProfile} →</a><button type="button" onClick={() => { closeMenu(); void logout(); }}>{copy.signOut}</button></> : <><strong>{copy.welcome}</strong><span>{copy.signInProfile}</span><button type="button" onClick={() => void startLogin()}>{copy.signInSignUp} →</button></>}</div>
        <details className="storefront-sidebar__categories" open><summary>{typeof sidebarTitle === "string" && sidebarTitle.trim() ? sidebarTitle : copy.allCategories}</summary><nav>{categories.map(category => <a key={String(category.id)} href={`/categories/${String(category.slug)}`} onClick={closeMenu}>{categoryLabel(category)}</a>)}</nav></details>
        <nav className="storefront-sidebar__links">{infoLinks.map(([href, label]) => <a key={href} href={href} onClick={closeMenu}>{label}</a>)}</nav>
      </aside>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div><a href="/" className="footer-brand">Jafory</a><p>{typeof footerText === "string" && footerText.trim() ? footerText : copy.footer}</p><p className="footer-disclosure">{copy.affiliateDisclosure}</p></div>
          <div><h3>{copy.categories}</h3><div className="footer-links">{categories.map(category => <a key={String(category.id)} href={`/categories/${String(category.slug)}`}>{categoryLabel(category)}</a>)}</div></div>
          <div><h3>{copy.contact}</h3><p>{copy.socialHelp}</p><div className="social-row">{configSocials.map(item => { const Icon = socialIcons[item.network as keyof typeof socialIcons] ?? Globe2; return <a key={String(item.id)} href={String(item.url)} target="_blank" rel="noopener noreferrer" aria-label={String(item.network)}><Icon size={17} /></a>; })}<a href="mailto:jafarsodor@gmail.com" aria-label={copy.contactEmail}><span className="social-row__email">@</span></a></div></div>
        </div>
        <div className="container site-footer__bottom"><span>© {new Date().getFullYear()} Jafory</span><span>{copy.tagline}</span></div>
      </footer>
      <div className="floating-contact-wrap"><div className={`floating-contact-menu ${contactOpen ? "floating-contact-menu--open" : ""}`} aria-hidden={!contactOpen}><a href={String(whatsappUrl)} target="_blank" rel="noopener noreferrer" onClick={() => setContactOpen(false)}><MessageCircle size={17} /><span>WhatsApp</span></a><a href={`tel:${phoneNumber}`} onClick={() => setContactOpen(false)}><PhoneCall size={17} /><span>Call</span></a><a href={typeof chatUrl === "string" && isConfiguredUrl(chatUrl) ? chatUrl : `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Jafory")}`} target="_blank" rel="noopener noreferrer" onClick={() => setContactOpen(false)}><Headphones size={17} /><span>Chat</span></a><a href="mailto:jafarsodor@gmail.com?subject=Jafory%20contact" onClick={() => setContactOpen(false)}><Mail size={17} /><span>Email</span></a></div><button type="button" className={`floating-contact ${contactOpen ? "is-open" : ""}`} onClick={() => setContactOpen(open => !open)} aria-expanded={contactOpen} aria-label={copy.contact}><Headphones size={23} /><span>{copy.contact}</span></button></div>
    </div>
  );
}
