-- JAFORY V2 MOBILE-SAFE IMPORT 04_FINISH
-- Run after the schema file and in this exact order.
-- This chunk contains public data inserts only; it has no CREATE/ALTER/DROP statements.
begin;
insert into public.social_links (network, url, is_active, sort_order) values ('facebook', 'https://www.facebook.com/JaforyOfficial', true, 0) on conflict (network) do update set url = excluded.url, is_active = excluded.is_active, sort_order = excluded.sort_order;
insert into public.social_links (network, url, is_active, sort_order) values ('instagram', 'https://www.instagram.com/jaforyofficial', true, 1) on conflict (network) do update set url = excluded.url, is_active = excluded.is_active, sort_order = excluded.sort_order;
insert into public.social_links (network, url, is_active, sort_order) values ('x', 'https://www.x.com/JaforyOfficial', true, 2) on conflict (network) do update set url = excluded.url, is_active = excluded.is_active, sort_order = excluded.sort_order;
insert into public.social_links (network, url, is_active, sort_order) values ('whatsapp', 'https://wa.me/971552650307', true, 3) on conflict (network) do update set url = excluded.url, is_active = excluded.is_active, sort_order = excluded.sort_order;
insert into public.social_links (network, url, is_active, sort_order) values ('youtube', 'https://www.youtube.com/@jaforyofficial', true, 4) on conflict (network) do update set url = excluded.url, is_active = excluded.is_active, sort_order = excluded.sort_order;
insert into public.social_links (network, url, is_active, sort_order) values ('tiktok', 'https://www.tiktok.com/@jaforyofficial', true, 5) on conflict (network) do update set url = excluded.url, is_active = excluded.is_active, sort_order = excluded.sort_order;
insert into public.site_settings (setting_key, setting_value) values ('contact_url', 'https://wa.me/971552650307') on conflict (setting_key) do update set setting_value = excluded.setting_value;
insert into public.site_settings (setting_key, setting_value) values ('media_gallery_products_ee0fe905-3d95-4f45-b3d2-857265a4c7e0', '["https://ehbhngznkxngxarquihn.supabase.co/storage/v1/object/public/jafory-media/6e386a8a-9df0-402f-a4cc-bd9a6de177e9/1787082668388-1c9e3850-fefb-471c-a903-0b13e3ed1db0.webp","https://ehbhngznkxngxarquihn.supabase.co/storage/v1/object/public/jafory-media/6e386a8a-9df0-402f-a4cc-bd9a6de177e9/1787082773531-9457cd2b-1bbb-4612-9e5c-bd664e22987e.webp"]') on conflict (setting_key) do update set setting_value = excluded.setting_value;
insert into public.site_settings (setting_key, setting_value) values ('media_video_products_ee0fe905-3d95-4f45-b3d2-857265a4c7e0', 'https://ehbhngznkxngxarquihn.supabase.co/storage/v1/object/public/jafory-media/6e386a8a-9df0-402f-a4cc-bd9a6de177e9/1787290374802-a24eb3f9-7d9d-48d9-8d62-49d558366956.mp4') on conflict (setting_key) do update set setting_value = excluded.setting_value;

commit;

-- Expected import counts: 6 categories, 118 products, 5 slides, 354 specifications.
commit;
