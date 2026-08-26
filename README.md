# Jafory V2

Jafory is a multilingual affiliate discovery platform for UAE, Bangladesh, Pakistan, India, and global visitors. This V2 source package uses the clean Supabase project configured for Jafory’s public catalogue and split authentication model: **email/password for administrators** and **magic-link sign-in for customers/viewers**.

## Verified public data

The clean Supabase project contains the following public catalogue records:

| Dataset | Verified rows |
|---|---:|
| Categories | 6 |
| Products | 118 |
| Product specifications | 354 |
| Hero slides | 5 |
| Social links | 6 |
| Site settings | 3 |

No users, passwords, sessions, customer reviews, reviewer identity, or service credentials are included in the public import.

## Netlify deployment

The final public hosting target is **Netlify**. The `manus.space` address is only a managed preview and is not the final public site.

When importing the extracted source into Netlify, use:

| Setting | Value |
|---|---|
| Base directory | Leave empty |
| Build command | `pnpm install --frozen-lockfile && pnpm build` |
| Publish directory | `dist/public` |
| Functions directory | `netlify/functions` |
| Node version | 22 |

The repository workflow described in `FINAL_NEW_NETLIFY_DEPLOY_BN.md` can also keep this source as the only ZIP in a GitHub repository and extract it during the build. Do not publish the repository README as the site root; the application must be built so that `dist/public` is the publish directory.

## Required Netlify environment variables

Add these variables in the Netlify site settings for all relevant deploy contexts. The browser variables contain only the public Supabase URL and publishable key. The service-role key must remain server-only.

| Variable | Purpose | Secret |
|---|---|---|
| `SUPABASE_URL` | Server-side Supabase project URL | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side catalogue/auth access | Yes |
| `VITE_SUPABASE_URL` | Browser Supabase project URL | No |
| `VITE_SUPABASE_ANON_KEY` | Browser publishable/anon key | No |

Never put `SUPABASE_SERVICE_ROLE_KEY` in a `VITE_` variable, GitHub, screenshots, or chat.

## Authentication model

Open `/admin` for the administrator email/password form. Open `/account` for customer/viewer magic-link sign-in. A signed-in account is allowed into the admin workspace only when its profile has `role = 'admin'` in the clean Supabase project.

## Safe release order

First deploy to a temporary Netlify site, confirm the site URL in Supabase Authentication → URL Configuration, and test home, categories, product detail, search, compare, `/account`, and `/admin`. For the first administrator test, use a regular Chrome tab rather than an in-app browser. Do not share passwords, OTPs, recovery links, or service-role keys.

The `netlify.toml` file contains the SPA fallback and `/api/*` function rewrite. Product and logo media are package-owned under `client/public/`; no preview-only `/manus-storage/` URLs are required for the public catalogue.
