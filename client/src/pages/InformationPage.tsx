import StorefrontLayout from "@/components/StorefrontLayout";
import { useCommerce } from "@/contexts/CommerceContext";
import { localized, ui } from "@/lib/localization";
import { trpc } from "@/lib/trpc";

type InfoKey = "about" | "privacy" | "disclosure" | "contact" | "terms" | "readiness";
type InfoCopy = { title: string; body: string };

const content: Record<InfoKey, Record<"en" | "ar" | "bn", InfoCopy>> = {
  about: {
    en: { title: "About Jafory", body: "Jafory is a UAE-, Bangladesh-, and global-focused product discovery platform. We publish practical editorial guides so visitors can discover, compare, and choose more thoughtfully. Jafory is not a retailer, does not process checkout, and does not guarantee a merchant’s price, stock, delivery, warranty, or returns." },
    ar: { title: "عن جعفوري", body: "جعفوري منصة لاكتشاف المنتجات تركز على الإمارات وبنغلاديش والأسواق العالمية. ننشر أدلة تحريرية عملية تساعد الزوار على اكتشاف المنتجات ومقارنتها واختيارها بوعي. جعفوري ليس متجراً ولا يعالج الدفع ولا يضمن سعر التاجر أو مخزونه أو توصيله أو ضمانه أو سياسة الإرجاع." },
    bn: { title: "জ্যাফরি সম্পর্কে", body: "জ্যাফরি সংযুক্ত আরব আমিরাত, বাংলাদেশ ও বৈশ্বিক বাজারভিত্তিক একটি পণ্য আবিষ্কার প্ল্যাটফর্ম। আমরা বাস্তবধর্মী সম্পাদকীয় গাইড প্রকাশ করি, যাতে দর্শকরা পণ্য আবিষ্কার, তুলনা ও চিন্তাভাবনা করে বাছাই করতে পারেন। জ্যাফরি কোনো বিক্রেতা নয়, checkout পরিচালনা করে না এবং বিক্রেতার মূল্য, stock, delivery, warranty বা return-এর নিশ্চয়তা দেয় না।" },
  },
  privacy: {
    en: { title: "Privacy Policy", body: "Jafory uses account authentication for protected actions such as submitting reviews and accessing administration. We aim to collect only the information required for those functions. Public product browsing does not require an account. Activity reporting is designed to exclude IP addresses, email addresses, and browser fingerprints from analytics events." },
    ar: { title: "سياسة الخصوصية", body: "يستخدم جعفوري مصادقة الحساب للإجراءات المحمية مثل إرسال التقييمات والوصول إلى الإدارة. نهدف إلى جمع المعلومات اللازمة لهذه الوظائف فقط. لا يتطلب تصفح المنتجات العامة حساباً. صُممت تقارير النشاط لاستبعاد عناوين IP وعناوين البريد وبصمات المتصفح من أحداث التحليلات." },
    bn: { title: "প্রাইভেসি পলিসি", body: "রিভিউ জমা দেওয়া ও প্রশাসনিক অংশে প্রবেশের মতো সুরক্ষিত কাজের জন্য জ্যাফরি অ্যাকাউন্ট authentication ব্যবহার করে। এসব কাজের জন্য যতটুকু প্রয়োজন, আমরা ততটুকু তথ্য রাখার লক্ষ্য রাখি। সাধারণ পণ্য browsing-এর জন্য account দরকার হয় না। Activity reporting-এ IP address, email address ও browser fingerprint বাদ রাখার নীতি অনুসরণ করা হয়।" },
  },
  disclosure: {
    en: { title: "Affiliate Disclosure", body: "Jafory may receive a qualifying commission when an approved retailer or course link is configured and a visitor chooses to use it. If Jafory uses Amazon Associates links, the following statement applies: As an Amazon Associate I earn from qualifying purchases. Editorial guidance is written for product discovery and comparison; an affiliate relationship does not by itself turn an editorial guide into a paid endorsement. Always verify the destination provider’s current terms before buying or enrolling." },
    ar: { title: "إفصاح الشراكة", body: "قد يحصل جعفوري على عمولة مؤهلة عند إعداد رابط معتمد لمتجر أو دورة واختيار الزائر استخدامه. تُكتب الإرشادات التحريرية لاكتشاف المنتجات ومقارنتها؛ ولا تجعل علاقة الشراكة الدليل التحريري تأييداً مدفوعاً بحد ذاتها. تحقق دائماً من الشروط الحالية لدى الجهة المقصودة قبل الشراء أو التسجيل." },
    bn: { title: "অ্যাফিলিয়েট ডিসক্লোজার", body: "অনুমোদিত বিক্রেতা বা কোর্সের লিংক সেট করা থাকলে এবং কোনো দর্শক সেটি ব্যবহার করলে জ্যাফরি qualifying commission পেতে পারে। সম্পাদকীয় গাইড পণ্য আবিষ্কার ও তুলনার জন্য লেখা হয়; অ্যাফিলিয়েট সম্পর্ক থাকলেই সেটি paid endorsement হয়ে যায় না। কেনা বা enrol করার আগে destination provider-এর বর্তমান শর্ত যাচাই করুন।" },
  },
  contact: {
    en: { title: "Contact Jafory", body: "For a guide correction, product-data question, or account issue, use one of the verified destinations below. Administrator-configured social links are loaded from the Jafory backend and remain editable from the control panel." },
    ar: { title: "تواصل مع جعفوري", body: "لتصحيح دليل أو السؤال عن بيانات منتج أو معالجة مشكلة حساب، استخدم إحدى وجهات التواصل الموثقة أدناه. تُحمّل الروابط الاجتماعية التي يحددها المدير من قاعدة جعفوري ويمكن تعديلها من لوحة التحكم." },
    bn: { title: "জ্যাফরির সাথে যোগাযোগ", body: "কোনো guide correction, product-data প্রশ্ন বা account সমস্যার জন্য নিচের verified destination ব্যবহার করুন। Administrator-এর সেট করা social link জ্যাফরি backend থেকে আসে এবং control panel থেকে edit করা যায়।" },
  },
  terms: {
    en: { title: "Terms & Sitemap", body: "Use Jafory for personal product discovery and comparison. Verify current specifications, availability, delivery, safety, warranty, returns, and merchant terms on the destination retailer or course provider before making a decision. The public sitemap lists the main crawlable sections and is not a guarantee that every external destination remains available." },
    ar: { title: "الشروط وخريطة الموقع", body: "استخدم جعفوري لاكتشاف المنتجات ومقارنتها للاستخدام الشخصي. تحقق من المواصفات والتوفر والتوصيل والسلامة والضمان والإرجاع وشروط التاجر أو مقدم الدورة قبل اتخاذ القرار. تعرض خريطة الموقع العامة الأقسام الرئيسية القابلة للزحف ولا تضمن استمرار توفر أي وجهة خارجية." },
    bn: { title: "শর্তাবলি ও সাইটম্যাপ", body: "ব্যক্তিগত product discovery ও comparison-এর জন্য জ্যাফরি ব্যবহার করুন। সিদ্ধান্ত নেওয়ার আগে destination retailer বা course provider-এর কাছে বর্তমান specification, availability, delivery, safety, warranty, return ও merchant terms যাচাই করুন। Public sitemap প্রধান crawlable section দেখায়; কোনো external destination সবসময় available থাকবে—এমন নিশ্চয়তা নয়।" },
  },
  readiness: {
    en: { title: "Review Evidence", body: "Jafory does not invent ratings, testimonials, customer photographs, or purchase claims. Reviews are eligible for publication only after a genuine user submission and administrator moderation. Editorial research is labelled as editorial guidance rather than customer experience, and an empty review area means no approved user review has been received yet." },
    ar: { title: "دليل التقييمات", body: "لا يختلق جعفوري التقييمات أو الشهادات أو صور العملاء أو ادعاءات الشراء. لا يصبح التقييم مؤهلاً للنشر إلا بعد إرساله من مستخدم حقيقي ومراجعته من المدير. يُعرّف البحث التحريري على أنه إرشاد تحريري وليس تجربة عميل، وتعني خانة التقييمات الفارغة عدم وجود تقييم مستخدم معتمد بعد." },
    bn: { title: "রিভিউ প্রমাণ", body: "জ্যাফরি rating, testimonial, customer photo বা purchase claim তৈরি করে না। প্রকৃত user submission ও administrator moderation-এর পরেই review প্রকাশের যোগ্য হয়। Editorial research-কে customer experience নয়, editorial guidance হিসেবে চিহ্নিত করা হয়; review area ফাঁকা থাকলে এখনো কোনো approved user review পাওয়া যায়নি।" },
  },
};

export default function InformationPage({ kind }: { kind: InfoKey }) {
  const home = trpc.catalog.home.useQuery();
  const { language } = useCommerce();
  const copy = ui(language);
  const pageLanguage = language === "ur" || language === "hi" ? "en" : language;
  const page = content[kind][pageLanguage];
  const socialLinks = home.data?.socialLinks ?? [];
  const contactUrl = home.data?.settings?.find(setting => setting.settingKey === "contactUrl")?.settingValue;
  const configuredPhone = home.data?.settings?.find(setting => setting.settingKey === "contactPhone")?.settingValue;
  const phoneNumber = typeof configuredPhone === "string" && /^\+?[0-9()\-\s]{7,26}$/.test(configuredPhone.trim()) ? configuredPhone.trim() : "+971552650307";
  const configuredChatUrl = home.data?.settings?.find(setting => setting.settingKey === "contactChatUrl")?.settingValue;
  const chatUrl = typeof configuredChatUrl === "string" && /^(https?:|mailto:|tel:)/i.test(configuredChatUrl) ? configuredChatUrl : `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=Hello%20Jafory`;
  const validSocials = socialLinks.filter(item => typeof item.url === "string" && /^(https?:|mailto:|tel:)/i.test(String(item.url)));

  return <StorefrontLayout categories={home.data?.categories ?? []} socialLinks={socialLinks} settings={home.data?.settings ?? []}>
      <section className="info-page"><section className="section"><div className="container"><p className="eyebrow eyebrow--dark"><span className="eyebrow__dot" />{copy.informationEyebrow}</p><h1>{page.title}</h1><div className="info-page__panel"><p>{page.body}</p>{kind === "contact" && <div className="contact-destinations"><h2>{copy.contactSocial}</h2><div className="contact-destinations__grid"><a href="mailto:jafarsodor@gmail.com"><strong>{copy.contactEmail}</strong><span>jafarsodor@gmail.com</span></a><a href={`tel:${phoneNumber}`}><strong>Call</strong><span>{phoneNumber}</span></a><a href={String(contactUrl && /^(https?:|mailto:|tel:)/i.test(String(contactUrl)) ? contactUrl : `https://wa.me/${phoneNumber.replace(/\D/g, "")}`)} target="_blank" rel="noopener noreferrer"><strong>{copy.contactWhatsApp}</strong><span>WhatsApp chat</span></a><a href={chatUrl} target="_blank" rel="noopener noreferrer"><strong>Chat</strong><span>Start a Jafory conversation</span></a>{validSocials.map(item => <a key={String(item.id)} href={String(item.url)} target="_blank" rel="noopener noreferrer"><strong>{String(item.network)}</strong><span>{String(item.url)}</span></a>)}</div></div>}<a href="/" className="button button--teal">{copy.returnHome}</a></div></div></section></section>
  </StorefrontLayout>;
}
