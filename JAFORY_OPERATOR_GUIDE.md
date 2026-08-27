# Jafory Operator Guide

## 1. Accessing the administrator panel

First sign in with the account that owns the Jafory project. Then open **`/admin`** from the storefront header or directly navigate to `https://<your-domain>/admin`. Only accounts with the `admin` role can access this area.

| Task | Control-panel location | What to do |
|---|---|---|
| Add a product | **Products** | Complete the category, unique URL slug, English/Arabic/Bengali names, optional badges, summaries, and details; then select **Save product**. |
| Edit a product | **Products → Current products** | Select **Edit**, revise the fields, and save. |
| Remove a product | **Products → Current products** | Select **Remove** and confirm the warning. This permanently removes the product plus its attached affiliate links, specifications, and reviews. |
| Add specifications | **Specifications** | Select the product, add or update comparison rows in all three languages, then choose **Save all specifications**. |
| Add an affiliate link | **Affiliate links** | Select the product and market, enter the merchant name and approved tracked destination URL, then select **Save affiliate link**. |
| Manage hero content | **Hero slides** | Create or edit the five rotating messages, calls to action, optional image URLs, and display order. |
| Moderate feedback | **Reviews** | Approve only genuine user-submitted reviews; hide any review that should not be public. |
| Contact and social links | **Settings** | Set the floating contact/WhatsApp URL plus Facebook, Instagram, X, WhatsApp, YouTube, and TikTok URLs. |

> **Important:** affiliate links must be your valid merchant or network tracking links. Replace the project’s initial placeholder URLs before promoting a product.

## 2. Setting the Jafory managed domain

The currently assigned Jafory address is **`jaforyhub-w9azpuxs.manus.space`**. To request the shorter `jafory.manus.space` address, open the project’s **Settings → Domains** panel and change the automatically generated subdomain prefix to `jafory`. Save the change if the panel confirms the prefix is available.

The `jafory.manus.space` prefix cannot be guaranteed because it may already be claimed. If it is unavailable, choose another distinctive prefix, such as `jaforyshop.manus.space`, or connect a domain you own through the same **Domains** panel.

## 3. Netlify deployment

Jafory is not a static-only React site. The public catalogue, administrator panel, authentication, review workflow, and database operations depend on the Express/tRPC server. Therefore, do **not** deploy the current repository to Netlify unchanged; a static deployment would not carry the current `/api/trpc` backend.

Netlify supports Express by running it inside Netlify Functions, not as a dedicated long-running server.[1] A Netlify version of Jafory needs a small serverless-conversion project with an Express function wrapper, a `/api/*` rewrite to that function, production database credentials, and reconfigured authentication callback URLs. Netlify documents that redirects can be declared in `netlify.toml` and that rules are processed in order, so the API rewrite must come before the React single-page-app fallback.[3]

| Step | Required action |
|---|---|
| 1 | Export this project to GitHub or download a backup archive. |
| 2 | Provision an external MySQL-compatible production database and set its connection string. |
| 3 | Refactor the Express server into `netlify/functions/api.ts` with the `serverless-http` adapter. |
| 4 | Add the `/api/*` rewrite and the React fallback in `netlify.toml`. |
| 5 | Configure Netlify to build the Vite client to `dist/public` and deploy the function directory. |
| 6 | Add runtime secrets through the Netlify environment-variable UI or CLI; Netlify notes that variables declared only in `netlify.toml` are not available to serverless functions at runtime.[2] |
| 7 | Update OAuth callback URLs, then test sign-in, admin access, product updates, reviews, and deep links. |

For now, the managed project hosting is the safer production choice because it preserves the existing backend, database, storage, authentication, and administrator setup without this migration.

## References

[1] [Netlify, “Express on Netlify”](https://docs.netlify.com/build/frameworks/framework-setup-guides/express/)

[2] [Netlify, “Environment variables and serverless functions”](https://docs.netlify.com/build/functions/environment-variables/)

[3] [Netlify, “Redirects and rewrites”](https://docs.netlify.com/manage/routing/redirects/overview/)
