# Jafory: Netlify Drop ও Supabase সেটআপ নির্দেশনা

## গুরুত্বপূর্ণ সিদ্ধান্ত

এটি শুধু static drag-and-drop site নয়। 118টি product, persistent catalogue, magic-link sign-in, role-protected admin panel, product edit, hero slide, social link এবং affiliate link চালাতে Netlify Functions ও Supabase environment variables একসাথে দরকার।

## Netlify Drop-এ Corrected Package আপলোড

১. আপনার existing `jafory.netlify.app` project খুলুন।

২. corrected source ZIP-টি Netlify Drop-এর production deploy area-তে upload করুন। ZIP-এর root-এ `package.json`, `pnpm-lock.yaml`, `netlify.toml`, `client/`, `server/`, `shared/`, এবং `netlify/` folder থাকবে। ZIP-এর ভিতরে আরেকটি ZIP থাকবে না।

৩. `netlify.toml` সরাসরি `pnpm install --frozen-lockfile && pnpm build` চালায়। Publish directory হলো `dist/public`, এবং Functions directory হলো `netlify/functions`।

## Environment Variables

Netlify Site settings → Environment variables-এ নিচের চারটি variable রাখুন:

| Key | Value | Scope / Secret |
|---|---|---|
| `SUPABASE_URL` | Supabase Project Overview-এ `.supabase.co` পর্যন্ত যে Project URL দেখায় | এটি secret নয়; All scopes ও same value for all contexts দিন |
| `SUPABASE_SERVICE_ROLE_KEY` | `jafory_netlify_server`-এর সম্পূর্ণ `sb_secret_...` key | Secret; Builds, Functions ও Runtime |
| `VITE_SUPABASE_URL` | একই Project URL | All scopes; same value for all contexts |
| `VITE_SUPABASE_ANON_KEY` | `default` Publishable key-এর সম্পূর্ণ `sb_publishable_...` value | All scopes; same value for all contexts |

পুরোনো `SUPABASE_ANON_KEY` থাকলে delete করার দরকার নেই, কিন্তু Jafory browser sign-in এখন `VITE_SUPABASE_ANON_KEY` ব্যবহার করে। `SUPABASE_SERVICE_ROLE_KEY` কখনো `VITE_` variable-এ, screenshot-এ, chat-এ, অথবা GitHub-এ রাখবেন না।

## Supabase Auth Redirect

Supabase Authentication → URL Configuration-এ site URL এবং redirect URL হিসেবে নিচের address অনুমোদন করুন:

```text
https://jafory.netlify.app/account
```

## Redeploy-এর পর যাচাই

Home page-এ 6টি category, 5টি hero slide এবং 118টি canonical product দেখতে হবে: Electronics 20, Fashion 20, Home & Living 20, Beauty & Wellness 20, Daily Essentials 20, এবং AI Learn / AI Tech 18। Header ও sidebar-এ logo দেখা যাবে; product image URL-গুলো `jafory.netlify.app/jafory-media/...` থেকে আসবে, কোনো preview storage URL থেকে নয়।
