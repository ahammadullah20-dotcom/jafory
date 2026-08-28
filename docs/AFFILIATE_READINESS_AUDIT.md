# Jafory Affiliate-Readiness Audit

## Scope and integrity

This audit preserves the 118 existing product rows, six categories, five hero slides, specifications, and current public information. No product, profile, review, rating, user session, or Supabase row is deleted. Customer reviews and ratings are not invented or seeded.

## Verified local catalogue and SEO results

| Check | Result |
|---|---:|
| Authoritative product records | 118 |
| Canonical image decisions | 118 |
| Unrelated non-null duplicate image mappings | 0 |
| Listings using honest product-art fallback until a matching source visual is available | 41 |
| Sitemap URLs | 134 |
| Product URLs in sitemap | 118 |
| Static verification file in source | `google3752cdb3167eae0a.html` |
| `robots.txt` sitemap directive | Present |
| Public app redirects | `/api/*` function rewrite and SPA fallback present |

## Image policy applied

The earlier catalog reused unrelated photos across different products, including cross-category uses such as cookware for washing-up liquid or a charger image for unrelated devices. Those associations are not affiliate-safe. The canonical map now permits a visual only when it is a product-specific or product-family match. Where no verified matching visual is available, the UI renders neutral category/product artwork rather than falsely depicting another product.

This avoids false product representation while keeping every catalogue entry visible. When the owner later has permitted retailer media, supplier media, or affiliate-network product assets, each fallback can be replaced through the protected product/media workflow.

## Affiliate presentation checks

Product pages retain separate market-aware retailer destinations for UAE, Bangladesh, and Global. External merchant buttons open in a new tab using `rel="sponsored noopener noreferrer"`. The public site has a disclosure route and a disclosure-aware meta description. The user interface does not imply retailer pricing, availability, warranty, or commissions are confirmed on Jafory itself.

Real affiliate destinations are intentionally not fabricated. The `affiliate_links` data must be filled only with the owner’s approved network URLs and tracking IDs after their affiliate account is accepted.

## Google Search Console status

The owner-provided Search Console screenshots show that the `https://jafory.netlify.app/` property has a verified owner and that `/sitemap.xml` was submitted successfully. The existing submitted sitemap has reported 15 discovered pages. The local upgraded sitemap contains the full 118-product route set and will need one re-submission after the owner authorizes the single publish.

## Before the single publish

1. Re-run all automated tests, TypeScript validation, production build, route checks, and asset checks.
2. Review the exact local diff with the owner’s no-redeploy-until-approved requirement.
3. Receive explicit permission for one GitHub push, which triggers one Netlify build.
4. After the deployment is live, submit the already-verified `sitemap.xml` once in Search Console; do not remove the property or add AMP pages.
