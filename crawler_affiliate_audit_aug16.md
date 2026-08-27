# Jafory Crawler and Affiliate-Readiness Audit

## Findings

The live homepage returns a JavaScript app shell that can expose meaningful content after execution, but the public routes use hash URLs such as `/#/category/fashion` and `/#/product/...`. Google’s official JavaScript SEO guidance says hash-fragment routing is not a reliable URL-discovery pattern and recommends History API URLs such as `/products`; it also notes that pre-rendering or server-side rendering helps crawlers and users, and that unique titles, descriptions, canonicals, robots rules, and meaningful status codes matter.[1]

The current homepage does include many product names and descriptions in rendered output after the client runs, but the initial HTML contains only `Loading Jafory…` inside the main app container. A crawler or AI browser that does not execute the module JavaScript can therefore see the shell, navigation and footer but not the complete product catalogue or page-specific content. The current package has `netlify.toml` but no visible `robots.txt` or `sitemap.xml` in the handoff directory. The page head must also be checked for stable title, description, canonical and social-preview tags.

The current site already exposes category navigation, product pages, comparison route, social links, contact settings and a disclosure-like footer sentence. However, an approval-ready public information architecture needs explicit crawlable pages or equivalent visible sections for About, Privacy Policy, Affiliate Disclosure, Contact, Terms, and Sitemap. These should not be hidden only behind admin or authentication.

Amazon’s official Associates guidance requires a legally compliant link-level disclosure placed clearly and conspicuously near affiliate links, plus the statement “As an Amazon Associate I earn from qualifying purchases” on the site once the Amazon relationship applies.[2] Amazon’s current policies also govern link formatting and qualifying purchases.[3] FTC guidance states that endorsements must be honest and not misleading and that material connections should be disclosed clearly and conspicuously.[4]

## Product evidence conclusion

The current catalogue is not uniformly evidentiary. Specific branded/modelled items such as Awei PA-91, UGREEN CD127, Baseus WM01, Creative Furniture products, RFL products, the named YELLOW/Aarong garments, and the two official Andrew Ng/DeepLearning.AI courses have stronger source identity. Generic or weakly branded entries should be labelled as generic listings rather than presented as established branded products. Items previously identified as unavailable or pending direct-page verification must be rechecked or replaced before being called active recommendations.

## Required implementation direction

The preferred long-term solution is crawlable History API routes or a server-rendered/static route layer. If the Netlify single-file constraint remains, the safe interim solution is to add substantial static homepage content, page-specific metadata where possible, `robots.txt`, `sitemap.xml`, visible policy pages, and canonical links, while clearly treating the app as an SPA limitation rather than claiming universal crawler compatibility. Product and category URLs should not rely solely on hash fragments for SEO-critical discovery.

## References

[1]: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics "Google Search Central: Understand the JavaScript SEO basics"
[2]: https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98 "Amazon Associates: Why do I have to identify myself as an Associate?"
[3]: https://affiliate-program.amazon.com/help/operating/policies "Amazon Associates Program Policies"
[4]: https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking "FTC Endorsement Guides: What People Are Asking"
