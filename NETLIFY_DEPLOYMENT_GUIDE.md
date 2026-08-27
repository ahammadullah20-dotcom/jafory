# Jafory Publishing Guide

## Recommendation

Jafory is currently a **full-stack web application**. Its public site, administrator control panel, role checks, database reads and writes, reviews, and regional affiliate logic run through an Express and tRPC server rather than a browser-only static build. The recommended first publication path is therefore the project’s built-in managed hosting, where the existing authentication, database, protected APIs, and managed storage remain connected.

> **Do not publish the current repository to Netlify unchanged.** A static Netlify deployment would render the interface but would not provide the current `/api/trpc` backend, database-backed administrator tools, role protections, or review submission workflow.

| Publication option | Suitability for Jafory now | What it preserves | Main consideration |
|---|---|---|---|
| Built-in managed hosting | **Recommended** | The current database, authentication, managed asset storage, server APIs, and admin panel | Use the project’s Publish control after a checkpoint; custom domains can be managed in the project settings. |
| Netlify after migration | Possible, but not a one-click deployment | The visual React storefront after build | Requires a serverless-function adapter, a separately configured database, runtime secrets, and route rewrites. |

## Current Jafory readiness

The following areas are complete in the current project: the responsive storefront; five editable hero records; category and product discovery; market-aware affiliate destinations; side-by-side comparison; authentic-review submission and moderation; Gulf, Bangladesh, and global language defaults; an RTL Arabic experience; social and contact configuration; and a role-protected Jafory control panel.

The initial catalogue contains **editable placeholder retailer destinations**, rather than real tracked affiliate URLs. Replace each URL in **Admin panel → Affiliate links** with your approved affiliate tracking URL before advertising products. In **Admin panel → Site settings & social links**, set the WhatsApp/contact destination and each social-account URL.

## Built-in managed hosting workflow

The built-in hosting path keeps the current stack intact. First, open the project preview and make a final content check. Then create a project checkpoint. After that, use the **Publish** control in the project interface and configure your preferred custom domain in the project’s domain settings. The administrator account is the project owner by default; any additional administrator should receive the `admin` role through the project database management tools.

## Netlify migration workflow

Netlify can run Express applications through Netlify Functions rather than a dedicated long-running Express server.[1] This means Jafory needs an adaptation pass before it can be deployed there. The following sequence is the safe route.

| Step | Required action | Jafory-specific effect |
|---|---|---|
| 1. Create a source backup | Export the repository to GitHub or download the project archive before changing deployment architecture. | Provides a rollback point for the working managed-hosting version. |
| 2. Create an external production database | Provision a MySQL-compatible database and keep automated backups enabled. | Update Jafory’s `DATABASE_URL`; the current Drizzle implementation uses MySQL/TiDB compatibility. |
| 3. Move Express into a Netlify Function | Refactor the Express application creation into a reusable module, then wrap it in a `netlify/functions/api.ts` function with `serverless-http`. | Preserves the existing tRPC API behind a Netlify function. Netlify’s official Express guide illustrates this adapter architecture.[1] |
| 4. Add routing configuration | Configure `/api/*` to rewrite to the API function, then add an SPA fallback to `index.html`. | Keeps browser calls to `/api/trpc` and direct visits to `/products/:slug`, `/categories/:slug`, and `/admin` working. Netlify supports rewrites in `netlify.toml` or `_redirects`.[3] |
| 5. Configure build and publish paths | Use `pnpm vite build` as the frontend build command and publish `dist/public`; configure `netlify/functions` as the function directory. | Matches Jafory’s current Vite output directory. |
| 6. Set secure runtime variables in the Netlify UI or CLI | Add the production database and authentication values in Netlify’s environment-variable settings with **Functions** scope where applicable. | Netlify states that `netlify.toml` variables are not runtime-available to serverless functions; a fresh deploy is required after variable changes.[2] |
| 7. Reconfigure authentication | Update allowed callback and production URLs to the Netlify custom domain, then test sign-in, administrator access, and sign-out. | Prevents broken login redirects and protects the control panel. |
| 8. Verify function behavior | Test public API calls, product writes in the admin panel, review moderation, market switching, and direct deep links. | Confirms that no static-only fallback has bypassed the live backend. |

### Proposed Netlify routing shape

The migration should use a routing model equivalent to the following. The exact function entry point must be created as part of the serverless conversion; do not add this configuration by itself.

```toml
[build]
  command = "pnpm vite build"
  publish = "dist/public"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The API rewrite must appear before the single-page-app fallback because Netlify evaluates redirect rules in order.[3]

## Operating checklist before public launch

| Area | Required launch check |
|---|---|
| Affiliate compliance | Replace every placeholder merchant destination with a valid, region-specific affiliate tracking URL. Include an affiliate disclosure appropriate to the networks you join. |
| Product quality | Replace example product names, specifications, summaries, and hero messaging with accurate merchant-verified information. |
| Languages | Complete professional Arabic and Bengali translations for all new products and promotions before enabling them. |
| Social and contact | Add real Facebook, Instagram, X, WhatsApp, YouTube, and TikTok destinations in the control panel. |
| Reviews | Publish only genuine, moderated user submissions; do not add fabricated ratings or testimonials. |
| Security | Confirm that only intended users have the `admin` role and that production secrets are not committed to the repository. |
| Mobile and deep links | Check the homepage, category, product, comparison, and admin routes on a phone, tablet, and desktop. |

## References

[1] [Netlify, “Express on Netlify”](https://docs.netlify.com/build/frameworks/framework-setup-guides/express/)

[2] [Netlify, “Environment variables and serverless functions”](https://docs.netlify.com/build/functions/environment-variables/)

[3] [Netlify, “Redirects and rewrites”](https://docs.netlify.com/manage/routing/redirects/overview/)
