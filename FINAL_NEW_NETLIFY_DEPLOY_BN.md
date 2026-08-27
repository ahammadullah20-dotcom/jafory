# Jafory: নতুন Netlify account-এ একবারের Final Deploy

এই ZIP-টি **source package**। এটি সরাসরি Netlify Drop-এ drag-and-drop করার static bundle নয়, কারণ Jafory-র catalogue, sign-in, role-protected admin panel এবং API Netlify Function ব্যবহার করে। নিচের ধাপগুলো একবারই করুন।

> Password, OTP, recovery code, GitHub token, Netlify token, Supabase key বা service-role key কাউকে chat-এ দেবেন না। নিজের browser-এ নিজে paste করবেন।

## 1. GitHub repository-তে final ZIP দিন

`ahammadullah20-dotcom/jafory` repository-তে পুরোনো source ZIP delete করে শুধু এই final ZIP upload ও **Commit changes** দিন। `README.md` রাখতে পারেন। একই repository-তে একাধিক Jafory source ZIP রাখবেন না।

## 2. নতুন Netlify account-এ repository import করুন

1. নতুন Netlify account-এ sign in করুন।
2. **Add new project → Import an existing project → GitHub** নির্বাচন করুন।
3. নিজের GitHub account authorize করে `ahammadullah20-dotcom/jafory` repository নির্বাচন করুন।
4. Build settings-এ নিচের values দিন:

| Setting | Value |
|---|---|
| Base directory | খালি রাখুন |
| Build command | `unzip -oq "$(find . -maxdepth 1 -name '*.zip' -print -quit)" && pnpm install --frozen-lockfile && pnpm build` |
| Publish directory | `dist/public` |
| Functions directory | `netlify/functions` |
| Node version | `22` |

এই command repository-র একমাত্র source ZIP extract করে build চালায়। ZIP-এর ভিতরের `netlify.toml` API rewrite ও SPA routing ঠিক রাখে।

## 3. Environment variables যোগ করুন

Netlify site settings → **Environment variables**-এ নিচের চারটি নাম দিন। সবগুলো **All deploy contexts / Build + Functions**-এ ব্যবহার করুন। Value আপনার পুরোনো working Netlify site-এর Environment variables অথবা Supabase Project settings থেকে নিজের browser-এ copy করবেন।

| Name | কোথা থেকে value নেবেন | নিরাপত্তা |
|---|---|---|
| `SUPABASE_URL` | Supabase Project URL (`https://…supabase.co`) | সাধারণ configuration |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server/service-role secret key | Secret; কখনো GitHub/chat-এ নয় |
| `VITE_SUPABASE_URL` | একই Supabase Project URL | Browser configuration |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable/anon key | Browser configuration |

`SUPABASE_SERVICE_ROLE_KEY`-এর শুরুতে `VITE_` দেবেন না। নতুন Netlify site-এ এই value ভুল হলে public catalogue, admin panel বা sign-in কাজ করবে না; Supabase database delete বা নতুন করে create করবেন না।

## 4. Supabase Auth redirect-এ নতুন Netlify URL যোগ করুন

প্রথম deploy-এর পরে Netlify যে `https://…netlify.app` site URL দেবে, Supabase → **Authentication → URL Configuration**-এ এটি অনুমোদন করুন:

```text
https://YOUR-NEW-SITE.netlify.app/account
```

পুরোনো URL মুছবেন না যতক্ষণ না নতুন site check করা শেষ হয়। এতে পুরোনো user, admin role, products, reviews এবং affiliate records অপরিবর্তিত থাকবে।

## 5. একবারের release check

Published হওয়ার পরে শুধু এগুলো পরীক্ষা করুন:

1. Home, `/categories/home-living`, `/contact`, `/compare`, এবং `/admin` direct URL খুলছে।
2. UAE-তে Arabic, Bangladesh-এ Bengali, Global-এ English হয়।
3. Guest user `/admin`-এ admin panel পায় না।
4. Owner admin Products, Specifications, Settings খুলতে পারে।
5. Phone-এ শুধু এক floating Contact button, sidebar ছাড়া compact admin, এবং Products-এ current list আগে দেখা যায়।

কোনো issue থাকলে screenshot পাঠান; নতুন করে Supabase data delete, SQL run, বা secret share করবেন না।


## 6. Blank-screen এড়াতে clean Chrome admin smoke test

প্রথম admin test-টি কোনো Facebook, Gmail, Messenger বা অন্য in-app browser-এ করবেন না। Android Chrome-এর নতুন tab খুলে সরাসরি `https://YOUR-SITE.netlify.app/admin` লিখুন। Sign in চাপুন এবং নিজের email নিজের browser-এ দিন; password, OTP বা magic-link chat-এ পাঠাবেন না। Email এলে একই Chrome-এ link খুলুন। Magic-link ফেরার পরে কয়েক সেকেন্ডের branded loading দেখাতে পারে, কিন্তু এরপর Control panel, Products, Specifications এবং Settings দেখা উচিত। সাদা page হলে refresh বারবার না করে screenshot রাখুন এবং কোন URL-এ ছিলেন তা লিখুন; নতুন deployment বা Supabase data change করবেন না।

প্রথমে কোনো Save, Delete বা Upload করবেন না। শুধু যাচাই করুন: Products-এ product list আসে, Settings খোলে, `Open storefront` home-এ ফেরায়, এবং Sign out করলে আবার protected Sign in state আসে। Guest অবস্থায় `/admin` ও `/ad` দুটোই admin panel নয়, branded Sign in state দেখাবে।

## 7. Phone/Desktop Site এবং final acceptance check

মোবাইলে Chrome-এর menu থেকে **Desktop site** চালু করে একবার reload করুন। Header, search, market/language selectors, category navigation এবং admin content যেন viewport-এর বাইরে কেটে না যায় বা এক লাইনে চেপে না বসে—এটি দেখুন। Desktop site বন্ধ করে normal phone layout-ও একবার দেখুন। Home page-এ hero slide-এর উচ্চতা স্থির আছে কি না এবং প্রায় 10 সেকেন্ডে অন্তত একটি horizontal slide movement দেখা যায় কি না দেখুন; শুধু text/color বদলানোকে slide pass ধরবেন না।

Products-এর media test smoke test pass করার পরে করবেন: Admin → Products → একটি existing product → Edit খুলুন। প্রথমে একটি বা একাধিক JPG/PNG/WebP image upload করুন এবং `Upload saved` দেখা পর্যন্ত অপেক্ষা করুন; preview grid-এ image আসে কি না দেখুন। এরপর একটি MP4/WebM video upload করুন এবং video frame ও controls দেখা যায় কি না দেখুন। Remove চাপবেন না যদি না test file-টি আলাদা করে upload করা থাকে। একসাথে সর্বোচ্চ 8টি image এবং 1টি video ব্যবহার করুন।

এই checks-এর যেকোনোটি fail হলে একই session-এ বারবার redeploy করবেন না। URL, browser mode, device width, এবং একটি screenshot পাঠান; Supabase table, roles, secrets বা existing products পরিবর্তন করবেন না।
