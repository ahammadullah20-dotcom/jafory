# Jafory V2 — নতুন Supabase Project Setup

এই guide শুধু নতুন Supabase project-এর জন্য। পুরোনো `Jafory` project বা `jafory.netlify.app`-এ এই SQL চালাবেন না এবং পুরোনো project delete করবেন না। নতুন project-এ schema ও public catalogue তৈরি হওয়ার আগে কোনো production deployment করবেন না।

## ১. নতুন project যাচাই

Supabase Dashboard-এর Projects page-এ নতুন project খুলুন এবং URL মিলিয়ে নিন:

`https://bsnujdoiikafnlaareye.supabase.co`

Project Settings → API page-এ গিয়ে নিশ্চিত করুন যে URL এবং publishable/anon public key এই নতুন project-এর। Service-role key chat-এ পাঠাবেন না।

## ২. Schema চালানো

নতুন project-এ **SQL Editor → New query** খুলুন। এই project-এর `docs/JAFORY_V2_SUPABASE_SCHEMA_FIRST_RUN.sql` ফাইলের সম্পূর্ণ content copy করে SQL Editor-এ paste করুন এবং **Run** চাপুন। এটি নতুন tables, indexes, profile trigger, RLS enablement এবং `jafory-media` storage bucket তৈরি করবে। এটি first-run version; এতে trigger মুছে ফেলার `DROP` statement নেই। এটি পুরোনো project-এ চালাবেন না।

Supabase যদি destructive-query warning দেখায়, **Cancel** চাপুন এবং নিশ্চিত করুন যে আপনি `JAFORY_V2_SUPABASE_SCHEMA_FIRST_RUN.sql` ব্যবহার করছেন—পুরোনো `JAFORY_V2_SUPABASE_SCHEMA.sql` নয়। Schema সফল হলে Table Editor-এ অন্তত `categories`, `products`, `product_specifications`, `hero_slides`, `profiles`, `reviews`, `social_links`, এবং `site_settings` দেখা যাবে। Storage-এ `jafory-media` bucket দেখা যাবে।

## ৩. Public data import

Schema সফল হওয়ার পর বড় single import paste না করে নিচের চারটি mobile-safe file **এই exact order-এ**, প্রতিটি আলাদা New query-তে paste করে Run করুন: `JAFORY_V2_IMPORT_01_CATEGORIES_SLIDES.sql`, `JAFORY_V2_IMPORT_02_PRODUCTS.sql`, `JAFORY_V2_IMPORT_03_SPECIFICATIONS.sql`, তারপর `JAFORY_V2_IMPORT_04_FINISH.sql`। এগুলো public catalogue থেকে সংগৃহীত ৬টি category, ১১৮টি product, ৩৫৪টি specification, ৫টি hero slide, ৬টি social link এবং ৩টি site setting import করবে। কোনো chunk-এ `create table`, `create trigger`, `alter table` বা `drop` নেই। এগুলো users, passwords, sessions, reviewer identity বা customer reviews import করে না; কোনো review বা testimonial বানানো হয়নি।

Server-side importer দিয়ে public catalogue import ইতিমধ্যে সম্পন্ন ও যাচাই করা হয়েছে। Importer-এর no-write যাচাই চালাতে project root থেকে `DRY_RUN=1 node scripts/import-public-catalog-to-new-supabase.mjs` ব্যবহার করা যায়; actual importer `node scripts/import-public-catalog-to-new-supabase.mjs` idempotent এবং কেবল নতুন project-এ কাজ করে। বর্তমান verified result হলো categories 6, products 118, product specifications 354, hero slides 5, social links 6 এবং site settings 3। এটি পুরোনো project, users, passwords, sessions বা reviews পরিবর্তন করেনি।

Import শেষে Table Editor-এ এই read-only query চালিয়ে count যাচাই করুন:

```sql
select 'categories' as table_name, count(*) as row_count from public.categories
union all
select 'products', count(*) from public.products
union all
select 'product_specifications', count(*) from public.product_specifications
union all
select 'hero_slides', count(*) from public.hero_slides;
```

Expected count হলো `categories = 6`, `products = 118`, `product_specifications = 354`, এবং `hero_slides = 5`। Count না মিললে কোনো delete বা re-run করবেন না; screenshot পাঠিয়ে থামুন।

## ৪. নতুন owner admin account

নতুন project-এর Authentication → Users থেকে নিজের email দিয়ে একটি account তৈরি করুন অথবা password reset flow ব্যবহার করুন। এরপর SQL Editor-এ কেবল নিজের নতুন user ID দিয়ে profile-কে admin করুন:

```sql
update public.profiles
set role = 'admin'
where id = 'YOUR_NEW_USER_UUID';
```

`YOUR_NEW_USER_UUID` নিজের নতুন project-এর user ID দিয়ে বদলাবেন। Password, OTP বা recovery link কাউকে পাঠাবেন না।

## ৫. কী copy করা হয়নি

পুরোনো project-এর users, passwords, sessions, roles, reviews, service keys এবং private data copy করা হয়নি। Product/category/slide/specification content public catalogue থেকে নেওয়া হয়েছে। Product image URL-গুলো নতুন project-এ ব্যবহার করার আগে নতুন `jafory-media` bucket-এ upload বা package-owned media mapping দিতে হবে; পুরোনো preview-only `/manus-storage/` URL সরাসরি ব্যবহার করবেন না।

## ৬. Deployment rule

Schema এবং import count সফলভাবে যাচাই হয়েছে। এখন final hosting হিসেবে **Netlify** ব্যবহার করবেন; `manus.space` URL কেবল technical preview/validation-এর জন্য, final public site নয়। Netlify-তে source ZIP বা GitHub repository deploy করে আগে home, categories, product detail, search, compare, customer magic-link এবং admin password login পরীক্ষা করুন। পুরোনো `jafory.netlify.app` এবং পুরোনো Supabase project backup/reference হিসেবে রেখে দিন।

## ৭. Password recovery URL

Password reset email পাঠানোর আগে নতুন project-এর **Authentication → URL Configuration**-এ `Site URL` হিসেবে `https://jafory.netlify.app` দিন এবং Redirect URLs-এ `https://jafory.netlify.app/account` রাখুন। Production reset link কখনো `http://localhost:3000` হওয়া উচিত নয়। নতুন release-এ reset link-এর recovery session `/account?recovery=1`-এ একটি নিরাপদ **Set a new password** form দেখায়; password mismatch বা expired link হলে visible error দেখাবে, এবং সফল update-এর পরে `/admin` sign-in-এ ফেরত যাবে।
