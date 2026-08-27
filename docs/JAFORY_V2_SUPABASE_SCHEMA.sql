-- Jafory V2 clean Supabase schema
-- Run this file only in the NEW Supabase project.
-- It creates structure only; it does not copy users, passwords, sessions, reviews, or old data.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  name_bn text not null,
  description_en text,
  description_ar text,
  description_bn text,
  image_url text,
  accent_color text not null default '#0F766E',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  name_bn text not null,
  short_description_en text,
  short_description_ar text,
  short_description_bn text,
  description_en text,
  description_ar text,
  description_bn text,
  image_url text,
  badge_en text,
  badge_ar text,
  badge_bn text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_specifications (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  group_en text not null default 'General',
  group_ar text not null default 'عام',
  group_bn text not null default 'সাধারণ',
  label_en text not null,
  label_ar text not null,
  label_bn text not null,
  value_en text not null,
  value_ar text not null,
  value_bn text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  market text not null check (market in ('uae', 'bangladesh', 'pakistan', 'india', 'global')),
  merchant_name text not null,
  destination_url text not null,
  price_display text,
  availability_text text,
  is_primary boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  eyebrow_en text not null,
  eyebrow_ar text not null,
  eyebrow_bn text not null,
  title_en text not null,
  title_ar text not null,
  title_bn text not null,
  body_en text,
  body_ar text,
  body_bn text,
  cta_label_en text not null,
  cta_label_ar text not null,
  cta_label_bn text not null,
  cta_url text not null default '/',
  image_url text,
  tone text not null default 'teal',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text not null,
  language text not null default 'en' check (language in ('en', 'ar', 'bn', 'ur', 'hi')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  network text not null unique check (network in ('facebook', 'instagram', 'x', 'whatsapp', 'youtube', 'tiktok')),
  url text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value text not null,
  updated_at timestamptz not null default now()
);

create index if not exists products_category_active_order_idx on public.products(category_id, is_active, name_en);
create index if not exists products_active_featured_idx on public.products(is_active, is_featured, name_en);
create index if not exists product_specifications_product_order_idx on public.product_specifications(product_id, sort_order);
create index if not exists affiliate_links_product_market_idx on public.affiliate_links(product_id, market, is_active);
create index if not exists reviews_product_status_idx on public.reviews(product_id, status, created_at);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1)))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_specifications enable row level security;
alter table public.affiliate_links enable row level security;
alter table public.hero_slides enable row level security;
alter table public.reviews enable row level security;
alter table public.social_links enable row level security;
alter table public.site_settings enable row level security;

-- The application server uses the service-role key for controlled reads and writes.
-- No anonymous table policies are created, so the browser cannot bypass server procedures.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('jafory-media', 'jafory-media', true, 40000000, array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'])
on conflict (id) do update set public = true, file_size_limit = 40000000, allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Jafory media public read') then
    create policy "Jafory media public read"
      on storage.objects for select
      using (bucket_id = 'jafory-media');
  end if;
end;
$$;
