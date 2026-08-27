# Jafory: Affiliate Marketing পরিচালনা ও Launch-Readiness Guide

**ব্র্যান্ড:** Jafory — *Discover, Compare & Choose Smarter*  
**বাজার:** UAE, Bangladesh, এবং Global  
**প্রস্তুত করেছেন:** Manus AI  
**তারিখ:** 15 August 2026

> **সতর্কতা:** আমি লাইসেন্সপ্রাপ্ত আর্থিক উপদেষ্টা বা আইনজীবী নই। এই গাইডটি ব্যবসা পরিচালনা ও affiliate marketing-এর ব্যবহারিক নির্দেশনা; কমিশন, কর, পেমেন্ট, privacy এবং merchant agreement-এর ক্ষেত্রে সংশ্লিষ্ট programme-এর বর্তমান শর্ত ও প্রয়োজন হলে পেশাদারের পরামর্শ অনুসরণ করবেন।

## 1. `@` কেন বাদ দিতে বলেছিলাম?

`@jaforyofficial` হলো **Instagram, X, YouTube ও TikTok-এ আপনার handle লেখার স্বাভাবিক পদ্ধতি**। তাই account name হিসেবে `@` রাখা একদম ঠিক। কিন্তু profile **URL** লেখার প্রচলিত ও পরিষ্কার format আলাদা হতে পারে। উদাহরণ হিসেবে Instagram-এর standard profile URL হলো `https://www.instagram.com/jaforyofficial/` এবং X-এরটি `https://x.com/JaforyOfficial`।

এটি কোনো কঠোর ভুল নয়। আমি পরীক্ষা করে দেখেছি Instagram-এ `@`-সহ এবং `@`-ছাড়া—দুই URL-ই একই login wall-এ নিয়েছে। অর্থাৎ `@`-এর কারণে link ভেঙে গেছে, এমন প্রমাণ নেই। তবে Admin panel-এ URL হিসেবে standard format ব্যবহার করলে link পরিষ্কার থাকে, কম redirect হয়, এবং ভবিষ্যতে কোনো platform URL validation দিলে সমস্যা কম হয়। **সিদ্ধান্ত:** আপনার handle-এ `@` থাকবে; URL field-এ standard profile URL রাখা ভালো, বাধ্যতামূলক নয়।

## 2. Social links: live পরীক্ষা থেকে ফলাফল

| Platform | Jafory-তে configured destination | পরীক্ষার ফল | আপনার করণীয় |
|---|---|---|---|
| Facebook | `https://www.facebook.com/JaforyOfficial` | **কাজ করছে।** Public Jafory page দেখা গেছে; সেখানে page name, contact number এবং content দেখা গেছে। | Page-এর website link `jafory-link.netlify.app` থেকে `https://jafory.netlify.app` করুন। |
| Instagram | `https://www.instagram.com/@jaforyofficial` | Instagram public browsing-এর বদলে login page দেখিয়েছে। Standard URL-ও একই login page দেখিয়েছে। | নিজের logged-in phone/browser থেকে profile খুলে নিশ্চিত করুন account public এবং username ঠিক আছে। চাইলে URL দিন `https://www.instagram.com/jaforyofficial/`। |
| X | `https://www.x.com/@JaforyOfficial` | Browser environment থেকে X timeout হয়েছে; profile আছে বা নেই—কোনোটিই নিশ্চিত করা যায়নি। | নিজের mobile data/Wi-Fi থেকে `https://x.com/JaforyOfficial` খুলে পরীক্ষা করুন। |
| WhatsApp | `https://wa.me/971552650307` | **কাজ করছে।** Configured number-এর WhatsApp chat route খুলেছে। কোনো message পাঠানো হয়নি। | এই number-এ WhatsApp Business profile, greeting এবং working hours সেট করুন। |
| YouTube | `https://www.youtube.com/@jaforyofficial` | **কাজ করছে।** Public Jafory channel দেখা গেছে, 6 subscribers এবং 6 videos সহ। | Channel About page-এর site link `https://jafory.netlify.app` করুন। |
| TikTok | `https://www.tiktok.com/@jaforyofficial` | Browser-এ destination load নেওয়ার পর verifiable page render হয়নি; exact handle-এর public search confirmationও পাওয়া যায়নি। | TikTok app-এ logged-in অবস্থায় profile খুলে username ও public visibility যাচাই করুন। |

Facebook ও YouTube দুটিই সত্যিকার public Jafory presence হিসেবে মিলেছে। Instagram-এর ক্ষেত্রে platform login wall এসেছে; X-এর ক্ষেত্রে এই browser-এর network timeout হয়েছে; TikTok-এর ক্ষেত্রে rendering/visibility নিশ্চিত করা যায়নি। তাই ওই তিনটির link delete করার দরকার নেই, কিন্তু **নিজের account থেকে একবার click করে profile public আছে কি না নিশ্চিত করুন**।

### সর্বশেষ mobile verification update

আপনার দেওয়া mobile screenshots অনুযায়ী **Facebook, TikTok, YouTube এবং X profile সরাসরি সঠিক Jafory account-এ খুলছে**। X-এ login করার পরে Jafory profile দেখানো স্বাভাবিক। Instagram-এর পুরোনো URL logged-in user-এর general timeline-এ নিতে পারত; নতুন Netlify deployment-এ সেটি standard direct profile URL `https://www.instagram.com/jaforyofficial/` করা হয়েছে। Instagram account public থাকলে logged-in user এবার Jafory profile-এই যাবে।

## 3. Jafory কি এখন public ব্যবহার ও affiliate programme application-এর উপযোগী?

### সংক্ষিপ্ত সিদ্ধান্ত

Jafory এখন **public product-discovery website হিসেবে ব্যবহার করা যায়**। Public visitor sign in ছাড়াই products, product details, specifications এবং comparison দেখতে পারে; WhatsApp contact-ও কাজ করছে। Sign in দরকার কেবল authenticated review দেওয়ার জন্য। Public visitor administrator page দেখতে পায় না।

তবে site-টি **“affiliate approval ready” হতে আরেকটি ছোট content-and-compliance pass দরকার**। আপনি এখন affiliate programme-এ আবেদন করতে পারেন, কিন্তু approval পাওয়ার সম্ভাবনা বাড়াতে প্রথমে demo content-এর জায়গায় বাস্তব, original এবং market-specific content দিন। Amazon UAE-এর rules অনুযায়ী application-এ দেওয়া site-টি publicly available ও original content-সমৃদ্ধ হতে হবে; affiliate links যথাযথ tracking format-এ বসাতে হবে এবং misleading claim করা যাবে না। [1]

| Launch area | Current position | Launch-এর আগে যা করবেন |
|---|---|---|
| Public catalogue | Product pages ও comparison public আছে | 5 demo product ধীরে ধীরে real products দিয়ে বদলান। |
| Affiliate links | Technical structure প্রস্তুত, কিন্তু placeholder URLs আছে | Approved merchant tracking link না পাওয়া পর্যন্ত “Buy” বা “Visit retailer” button-এ real offer দেবেন না। |
| Original editorial content | Demo copy আছে | প্রতিটি priority category-তে অন্তত 3–5টি honest review/comparison article দিন। |
| Affiliate disclosure | Footer-এ commission notice আছে | Header/footer এবং প্রতিটি affiliate CTA-এর কাছে স্পষ্ট disclosure রাখুন। |
| Legal pages | Privacy/terms review প্রয়োজন | Privacy Policy, Terms of Use, Affiliate Disclosure, Contact/Editorial Policy public করুন। |
| Social proof | Facebook ও YouTube confirmed | Instagram, X ও TikTok public visibility নিজে confirm করুন; Facebook/YouTube-এর old website link বদলান। |
| Customer support | WhatsApp link works | WhatsApp Business auto-reply, hours, escalation process এবং response log চালু করুন। |

> **বাস্তব সিদ্ধান্ত:** আজই programme-এ apply করা যায়, কিন্তু paid traffic বা বড় promotion **শুরু করবেন না** যতক্ষণ না real products, real tracking links, disclosure, legal pages এবং verified social profiles প্রস্তুত হচ্ছে। Demo product বা placeholder link দিয়ে traffic পাঠালে customer trust এবং merchant approval—দুটিই ক্ষতিগ্রস্ত হতে পারে।

## 4. প্রথমে কোন affiliate programmes-এ আবেদন করবেন

Jafory-এর জন্য শুরুতে তিনটি track আলাদা রাখুন: UAE retailer, Bangladesh retailer, এবং global network। একই product-এর জন্য ভিন্ন market-এর ভিন্ন link থাকবে—এটাই Jafory-এর শক্তি।

| Priority | Programme / network | Jafory-এর ব্যবহার | আবেদন করার আগে কী প্রস্তুত রাখবেন |
|---|---|---|---|
| UAE | [Amazon.ae Associates][1] | UAE visitor-কে Amazon.ae-এর relevant product page-এ পাঠানো | Public `jafory.netlify.app`, original content, contact details, payout/tax information, clear disclosure। |
| Bangladesh | [Daraz Bangladesh Affiliate][2] | BD visitor-কে Daraz Bangladesh-এর product page-এ পাঠানো | Website URL, Jafory Facebook/YouTube details, payment details, real BD-focused product content। |
| Global | [impact.com Affiliate Marketplace][3] | Region-appropriate global brands খোঁজা এবং brand-by-brand approval নেওয়া | Media-partner account, Jafory audience description, website/social profile links, payout details। |

Daraz-এর official page অনুযায়ী affiliate link ব্যবহার করে promotion করা যায়, reported commission rate category/offer অনুযায়ী **up to 18%** বলা হয়েছে, এবং dashboard থেকে click, order, sales ও conversion দেখা যায়। Returned, refunded, cancelled বা suspicious order-এর commission পাওয়া যায় না। [2] Amazon UAE-তে qualifying purchase সাধারণত affiliate special link click-এর পরে session-based attribution অনুযায়ী track হয়; তাদের published policy-তে minimum AED 35 payment threshold এবং month-end-এর প্রায় 60 দিন পরে payment-এর কথা বলা আছে। Terms ও rates বদলাতে পারে, তাই apply করার দিনে programme dashboard-এর policy আবার পড়বেন। [1]

### Application করার step-by-step পদ্ধতি

| Step | আপনার কাজ | কী লিখবেন বা দেবেন |
|---|---|---|
| 1 | Jafory public site খুলে নিজে check করুন | Logo, contact, real content, no broken link, clear affiliate disclosure। |
| 2 | Professional business email ব্যবহার করুন | সম্ভব হলে `info@jafory.com` বা আপনার domain-এর email। |
| 3 | Affiliate programme-এর official page থেকে sign up করুন | Random Facebook/Telegram agent বা paid setup seller ব্যবহার করবেন না। |
| 4 | Website ও channels উল্লেখ করুন | `https://jafory.netlify.app`, Facebook page, YouTube channel, এবং verified social URLs। |
| 5 | Traffic strategy ছোট করে লিখুন | UAE ও BD product reviews, comparison pages, Bengali/Arabic content, YouTube Shorts, organic social traffic। |
| 6 | Payment/tax identity যা চায় দিন | নিজের সঠিক legal name, bank/wallet details, tax status। ভুল তথ্য দেবেন না। |
| 7 | Approval email ও policy সংরক্ষণ করুন | Programme name, approved countries, allowed channel, commission notes আপনার affiliate list-এ রাখুন। |
| 8 | Approved হওয়ার পর link সংগ্রহ করুন | Product-specific tracking URL নিন; সাধারণ product URL কপি করবেন না। |

## 5. “Affiliate link list” আসলে কী এবং কীভাবে রাখবেন

Affiliate link list কোনো public folder নয়। এটি আপনার **merchant link register**। প্রতি product-এর জন্য market অনুযায়ী link রাখবেন। একই link UAE, Bangladesh ও Global-এর জন্য ব্যবহার করবেন না, যদি merchant আলাদা হয়।

### Recommended master sheet

Admin panel-এ link যোগ করার পাশাপাশি Google Sheets/Excel-এ নিচের register রাখুন। এটি customer-কে দেখাতে হবে না; আপনার management ও reconciliation-এর জন্য।

| Product name | Category | Market | Merchant | Programme | Tracking URL | Link status | Last checked | Notes |
|---|---|---|---|---|---|---|---|---|
| বাস্তব product name | Electronics | UAE | Amazon.ae | Amazon Associates | Merchant থেকে নেওয়া actual URL | Active / Paused | YYYY-MM-DD | Price/stock verify note |
| বাস্তব product name | Electronics | Bangladesh | Daraz BD | Daraz Affiliate | Merchant থেকে নেওয়া actual URL | Active / Paused | YYYY-MM-DD | Campaign expiry note |
| বাস্তব product name | Electronics | Global | Approved merchant | impact.com / direct | Merchant থেকে নেওয়া actual URL | Active / Paused | YYYY-MM-DD | Country availability |

### Jafory Admin panel-এ affiliate link যোগ করার নিয়ম

প্রথমে **Category**, তারপর **Product**, তারপর **Specifications**, সবশেষে **Affiliate links** তৈরি করবেন। এতে link একটি সঠিক product-এর সঙ্গে যুক্ত থাকবে।

| Admin order | কাজ | প্রয়োজনীয় তথ্য |
|---|---|---|
| 1. Category | যেমন Electronics, Home, Beauty | Category title, slug, optional image/description। |
| 2. Product | শুধুমাত্র এক identifiable item | নাম, short description, full original review/analysis, image, category। |
| 3. Specifications | Compare করার facts | একই type-এর product-এ একই label ব্যবহার করুন: Battery, Display, Warranty, Material। |
| 4. Affiliate link | Region-specific merchant route | Merchant name, UAE/BD/Global market, **actual affiliate tracking URL**, active state। |
| 5. Verify | Public page থেকে test | সঠিক country select করুন, CTA click করুন, merchant page খুলছে কি না দেখুন। |

**এক product, তিন market-এর উদাহরণ:** একই headphone-এর জন্য UAE visitor Amazon.ae link পাবে; Bangladesh visitor Daraz link পাবে; অন্য country visitor approved global merchant link পাবে। কোনো market-এর approved link না থাকলে site-এ “এই region-এর retailer link এখনো configured নয়” দেখানোই সঠিক—ভুল destination দেওয়া নয়।

## 6. Product review কীভাবে বানাবেন: Jafory-এর editorial workflow

Jafory-এর value হলো “কেনার আগে বুঝে নেওয়া।” তাই product page শুধু seller description হলে হবে না; আপনার own analysis থাকতে হবে। Amazon UAE-ও original content ও significant commentary/analysis প্রত্যাশা করে। [1]

প্রতিটি product page publish করার আগে এই content structure অনুসরণ করুন:

| Section | কী লিখবেন | কী লিখবেন না |
|---|---|---|
| What it is | Product কী এবং কার জন্য | Manufacturer claim নিজের fact হিসেবে লিখবেন না। |
| Best for | কোন buyer/use case-এর জন্য ভালো | “সবার জন্য সেরা” ধরনের অস্পষ্ট দাবি। |
| Key specifications | Source-checked specs | অনুমান, বানানো benchmark, যাচাই ছাড়া price। |
| Pros | সত্যিকারের সুবিধা | শুধু advertising language। |
| Limitations | বাস্তব সীমাবদ্ধতা | Negative point লুকিয়ে রাখা। |
| Alternatives | একই need-এর 2–3 relevant option | Unrelated product বা affiliate-only ranking। |
| Price/availability note | “Price may change; check retailer” | Static দাম লিখে দীর্ঘদিন না বদলানো। |
| Affiliate disclosure | CTA-এর কাছে ছোট disclosure | Disclosure শুধু hidden footer-এ রাখা। |

**প্রতিটি CTA-এর নিচে ব্যবহারযোগ্য বাংলা disclosure:**

> **Affiliate disclosure:** এই link দিয়ে qualifying purchase হলে Jafory commission পেতে পারে; এতে আপনার অতিরিক্ত খরচ হয় না। Price ও availability retailer-এর page-এ যাচাই করুন।

Merchant-এর required wording আলাদা হলে সেটিই যোগ করবেন। Amazon UAE-এর policies অনুযায়ী compensation arrangement পরিষ্কার, সংক্ষিপ্ত এবং unambiguousভাবে disclose করতে হয়। [1]

## 7. Compare section-এ আপনার কাজ কী

Compare section হলো customer-এর decision assistant। এখানে আপনার কাজ হলো একই ধরনের products-এর **একই facts** এক জায়গায় আনা। এটি ratings বানানো বা “সবচেয়ে ভালো” বলে বিক্রি করার জায়গা নয়।

### একটি comparison তৈরির পদ্ধতি

| Step | আপনার কাজ |
|---|---|
| 1 | একই use case-এর 2–4টি product বাছুন, যেমন “UAE under AED X wireless earbuds” বা “Bangladesh small-room air purifier”। |
| 2 | একই specification labels ব্যবহার করুন, যেমন battery, warranty, weight, connectivity, voltage, size। |
| 3 | প্রতিটি fact manufacturer বা retailer specification থেকে যাচাই করুন; source/date নিজের sheet-এ রাখুন। |
| 4 | “Best for” verdict দিন use case অনুযায়ী: frequent travel, small budget, family use, compact room ইত্যাদি। |
| 5 | প্রতিটি market-এর আলাদা affiliate link যোগ করুন। কোনো link না থাকলে blank রাখুন, জোর করে অন্য country-তে পাঠাবেন না। |
| 6 | Price বা offer লিখলে last checked date এবং retailer disclaimer যোগ করুন। Live/accurate price রাখতে না পারলে price table না দেখানো নিরাপদ। |
| 7 | Offer শেষ হলে comparison ও hero banner update/remove করুন। |

Amazon UAE policy অনুযায়ী price ও availability বদলাতে পারে; price দেখাতে হলে programme-এর allowed method/API-এর নিয়ম মেনে চলতে হয়। একই product-এর অন্য merchant-এর price-এর সঙ্গে Amazon price compare করলে Amazon-এর specific price-display requirements থাকতে পারে। তাই শুরুতে **“Check current price at retailer”** CTA ব্যবহার করা সবচেয়ে কম ঝুঁকির পদ্ধতি। [1]

## 8. Review section-এ আপনার কাজ কী

Jafory-তে review দুই ধরনের, কিন্তু দুটির উৎস আলাদা রাখতে হবে।

| Review type | কে লিখবে | আপনার কাজ | কী করা যাবে না |
|---|---|---|---|
| Editorial review | Jafory team | Research, hands-on assessment, source checking, pros/limitations লিখবেন | Customer review হিসেবে দেখানো যাবে না। |
| Customer review | বাস্তব signed-in customer | Submission moderation করে authentic review publish করবেন | Review, star rating বা testimonial বানিয়ে দেওয়া যাবে না। |

### Customer review moderation SOP

প্রত্যেক pending review-এর জন্য reviewer, date, product relevance, abusive language, duplicate text এবং promotional link check করুন। Review সত্যিকারের experience বলে মনে হলে approve করুন; সন্দেহজনক, copied, offensive, irrelevant বা fabricated মনে হলে reject করুন। Rating পরিবর্তন করবেন না এবং নিজেরা review লিখে customer-এর নামে publish করবেন না।

যেহেতু Jafory seller নয়, customer-এর return, refund, delivery, warranty বা payment problem merchant-এর সঙ্গে সমাধান হবে। Jafory-এর ভূমিকা হলো correct retailer link, transparent guidance, এবং link/description correction; merchant-এর হয়ে refund promise করা নয়।

## 9. Customer কীভাবে Jafory ব্যবহার করবে

### Customer journey

| Customer step | Customer যা করবে | Jafory যা দেবে |
|---|---|---|
| 1. Country choose | UAE, Bangladesh বা নিজের country বাছবে | Automatically appropriate language ও market context। |
| 2. Browse/search | Category, product বা search ব্যবহার করবে | Product discovery ও structured information। |
| 3. Read | Specifications, pros, limitations, comparison দেখবে | Original information এবং clear disclosure। |
| 4. Compare | 2–4টি product add করে side-by-side দেখবে | Same-field comparison ও market-aware CTA। |
| 5. Visit retailer | “Visit retailer”/affiliate button click করবে | সঠিক country-এর approved merchant tracking link। |
| 6. Checkout | Merchant site/app-এ order করবে | Jafory checkout বা payment নেবে না। |
| 7. Review | Product ব্যবহারের পরে sign in করে review submit করবে | Moderated authentic review publication। |
| 8. Help | Link/website problem হলে WhatsApp বা Contact ব্যবহার করবে | Fast acknowledgement, correct escalation। |

### Customer support: WhatsApp Business setup

| Situation | First reply | Resolution owner |
|---|---|---|
| Broken affiliate link | “ধন্যবাদ, আমরা linkটি যাচাই করছি।” | Jafory admin একই দিন link test/replace করবে। |
| Wrong description/spec | “Source যাচাই করে product page update করব।” | Jafory editorial/admin। |
| Delivery/refund/payment issue | “Order merchant-এর সঙ্গে হয়েছে; এই order issue retailer support-ই handle করবে। প্রয়োজন হলে retailer support page দিচ্ছি।” | Merchant support; Jafory helpfully points them there. |
| Review status | “Review moderation queue-তে আছে।” | Jafory review moderator। |
| Partnership enquiry | Email/contact form-এ brand details নিন | Jafory owner/admin। |

WhatsApp Business-এ একটি greeting message রাখুন: **“Welcome to Jafory. Product discovery, comparison বা website link সহায়তার জন্য product name ও country লিখুন। Delivery, refund এবং payment retailer সরাসরি পরিচালনা করে।”** এর ফলে customer শুরুতেই বুঝবে Jafory affiliate guide, merchant নয়।

## 10. Weekly operating routine

| Frequency | কাজ | ফলাফল |
|---|---|---|
| প্রতিদিন | WhatsApp, broken-link report ও pending customer review দেখুন | Fast response, clean review queue। |
| সপ্তাহে 2 দিন | Active affiliate link click-test করুন | Dead/expired link কমে। |
| সপ্তাহে 1 দিন | Top product, click, conversion এবং merchant dashboard report দেখুন | কোন category কাজ করছে বোঝা যায়। |
| সপ্তাহে 1 দিন | একটি genuine comparison বা review publish করুন | Original content বাড়ে। |
| মাসে 1 দিন | Social bios, Facebook/YouTube website link, contact number, legal pages পরীক্ষা করুন | Brand consistency বজায় থাকে। |
| মাসে 1 দিন | Offer expiry, product discontinued status এবং market availability update করুন | Outdated claims কমে। |

## 11. প্রথম 14 দিনের practical launch plan

| Day | কাজ |
|---|---|
| 1 | Facebook ও YouTube profile-এর website link `https://jafory.netlify.app` করুন। Instagram, X, TikTok-এর public visibility নিজের phone থেকে confirm করুন। |
| 2 | Footer/header-এ affiliate disclosure, Privacy Policy, Terms, Editorial Policy ও Contact details যোগ/verify করুন। |
| 3–4 | UAE-এর জন্য 3টি real product এবং Bangladesh-এর জন্য 3টি real product research করুন। Demo product ধীরে সরান। |
| 5 | Amazon.ae Associates, Daraz BD Affiliate এবং impact.com-এ official application দিন। |
| 6–7 | প্রতিটি product-এর specs, pros, limitations, relevant image, last checked date এবং unique market link register তৈরি করুন। |
| 8 | Approved merchant থেকে পাওয়া real tracking links Admin panel-এ market-wise add করুন। |
| 9 | 3টি comparison page তৈরি করুন—একটি UAE, একটি Bangladesh, একটি Global focus। |
| 10 | YouTube/Facebook/Instagram-এ একটি short original product guide publish করুন; direct product link-এর বদলে relevant Jafory article link দিন। |
| 11 | WhatsApp Business greeting, labels এবং support hours চালু করুন। |
| 12 | A friend দিয়ে UAE/BD country selection, product page, compare, link click ও mobile view test করান। |
| 13 | Link status, disclosure placement এবং account visibility পুনরায় audit করুন। |
| 14 | Paid promotion শুরু করার আগে merchant-specific traffic rules আবার পড়ুন। |

## 12. যে ভুলগুলো করবেন না

আপনি নিজে বা অন্য কাউকে দিয়ে customer review, star rating বা testimonial বানাবেন না। Retailer-এর images/specs copy করলে যথাযথ permission/usage terms যাচাই করবেন। Discount, price, stock বা warranty সম্পর্কে অনিশ্চিত হলে claim করবেন না। Merchant-এর tracking link shortener, redirect বা tracking setup দিয়ে এমনভাবে alter করবেন না যাতে programme attribution নষ্ট হয়। Amazon UAE policy অনুসারে affiliate special links ঠিক tracking format-এ এবং site থেকে direct accessible হতে হয়; misleading product claim বা stale promotion রাখা নিষিদ্ধ। [1]

Daraz-এর terms অনুযায়ী cancelled, returned, refunded বা fraudulent transaction commission-eligible নাও হতে পারে এবং reporting/commission calculation platform-এর records অনুযায়ী হয়। [2] তাই projected income নয়, approved commission report-কে আসল হিসাব ধরবেন।

## 13. আজকের সবচেয়ে জরুরি কাজের checklist

1. Facebook page এবং YouTube channel-এর old website link বদলে `https://jafory.netlify.app` করুন।
2. Instagram, X এবং TikTok app থেকে নিজে profile open করে username/public visibility confirm করুন।
3. Demo product-এর বদলে প্রথম 6টি real product-এর research শুরু করুন।
4. Affiliate disclosure ও essential legal pages visible করুন।
5. Official Amazon.ae, Daraz BD এবং impact.com application শুরু করুন।
6. Approved tracking URL পাওয়ার পরই Jafory Admin panel → **Affiliate links**-এ UAE/BD/Global অনুযায়ী যোগ করুন।
7. প্রতি সপ্তাহে link test এবং review moderation চালু রাখুন।

## References

[1]: https://affiliate-program.amazon.ae/help/operating/policies/ "Amazon.ae Associates Program Policies"
[2]: https://www.daraz.com.bd/daraz-affiliate-program/ "Daraz Bangladesh Affiliate Program"
[3]: https://impact.com/partners/affiliate-partners/ "impact.com Affiliate Partner Marketplace"
