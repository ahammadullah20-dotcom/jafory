# Meta AI ও Affiliate-readiness Final Audit

## Meta AI screenshot থেকে পাওয়া ৬টি বিষয়

১. About Us page-এ Jafory কে, Dubai/UAE ও Bangladesh focus কেন, এবং editorial experience কী—এটি পরিষ্কার থাকতে হবে।

২. Privacy Policy page থাকতে হবে এবং affiliate tracking/data handling সম্পর্কে পরিষ্কার ভাষা থাকতে হবে।

৩. Affiliate Disclosure/Disclaimer product guide ও affiliate link-এর কাছাকাছি থাকতে হবে; approved Amazon ব্যবহার করলে required Amazon Associate statement ব্যবহার করতে হবে।

৪. Contact page-এ email, WhatsApp এবং contact route থাকতে হবে।

৫. Terms & Conditions এবং Sitemap থাকতে হবে।

৬. Minimum 10+ genuine original reviews/content pieces দরকার—তবে fabricated review, rating, testimonial বা personal photo তৈরি করা যাবে না। এই অংশটি Jafory-র owner-কে সত্যিকারের নিজস্ব experience, pros/cons ও legally usable photo দিয়ে পূরণ করতে হবে।

## Meta AI কেন link পুরোপুরি পড়তে পারেনি

Jafory-এর public Netlify version একটি client-side JavaScript SPA এবং route-এ `#/` hash ব্যবহার করে। Initial HTML-এ app shell ও no-JavaScript fallback আছে, কিন্তু product/category/detail content JavaScript চালানোর পরে Supabase থেকে আসে। তাই সাধারণ browser ব্যবহারকারীরা site দেখতে পারেন, কিন্তু কিছু AI browser, social preview bot বা crawler JavaScript/Supabase execution না করলে শুধু shell, Loading state বা fallback content দেখতে পারে। Google নিজেও বলে যে JavaScript render করা সম্ভব হলেও server-side/pre-rendering faster এবং সব bot JavaScript চালাতে পারে না; Google distinct content URL-এর জন্য fragment/hash-এর বদলে History API recommend করে।

## Current implementation status

About, Privacy, Affiliate Disclosure, Contact, Terms, Sitemap, robots.txt, canonical/meta fallback এবং visible no-JavaScript fallback ইতিমধ্যে standalone package-এ আছে। 47 real product guides live catalogue-এ আছে; RFL Teeny Organizer-এর বদলে RFL Salad Cutting Board (Orange), model 95751, এবং unavailable fruit basket-এর বদলে YWLETO guide live search-এ যাচাই হয়েছে। Contact channels, social links, comparison, country/language selector, market ordering, admin role protection, one-tap catalogue publisher এবং clean original illustrations আছে।

## Honest remaining limitation

Meta AI-এর screenshot-এর exact failure পুরোপুরি দূর করতে hash SPA-কে History API/SSR/static pre-rendered product pages-এ রূপান্তর করা দরকার। এটি শুধু ZIP replacement নয়; Netlify routing ও build architecture পরিবর্তন। বর্তমান site সাধারণ users-এর জন্য public এবং usable, কিন্তু JavaScript না চালানো crawler-এর জন্য product-level content guaranteed নয়। Affiliate approval-এর জন্য genuine reviews/content-ও owner-এর বাস্তব অভিজ্ঞতা ছাড়া তৈরি করা যাবে না।

## Official references

[1]: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics "Google Search Central: Understand JavaScript SEO basics"
[2]: https://affiliate-program.amazon.com/help/operating/policies "Amazon Associates Program Policies"
[3]: https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98 "Amazon: Associate identification and disclosure"
[4]: https://affiliate-program.amazon.com/help/operating/agreement "Amazon Associates Program Operating Agreement"
