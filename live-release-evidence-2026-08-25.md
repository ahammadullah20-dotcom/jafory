# Live release evidence — 2026-08-25

## Public storefront after GitHub archive replacement

The live URL `https://jafory.netlify.app/` was opened and refreshed in the sandbox browser after the GitHub source archive replacement. The page title is `Jafory | Discover, Compare & Choose Smarter`. The live storefront rendered beyond its initial skeleton: market options were visible for UAE, Bangladesh, Pakistan, India, and Global; language options were visible for Arabic, Bengali, Urdu, Hindi, and English; the header exposed Sign in and Menu; category routes exposed Electronics, Fashion, Home & Living, Beauty & Wellness, and Daily Essentials; the compare entry was visible; and the public page rendered five hero-slide controls including previous/next controls.

The extracted live page also contained public product cards and owned `/jafory-media/` image paths, plus the configured WhatsApp, Call, Chat, and Email actions. The public contact action included `tel:+971552650307`. The first screenshot briefly showed the expected branded skeleton while data was loading; the follow-up browser view showed the populated storefront and hero content, including a visible Fashion slide. No authenticated route was opened and no account credentials or sensitive operation were used.

## Pending live owner verification

The owner’s actual magic-link callback and owner-admin session still require a clean Chrome tab on the owner device. The release is not marked as fully live-acceptance-complete until the owner confirms `/admin` reaches the dashboard, Products/Settings load, and sign-out works. No Supabase data, roles, reviews, affiliate records, or secrets were modified during this audit.

## Anonymous protected-route verification

The live `/admin` URL rendered the branded `Sign in to access the Jafory control panel` state with `Administrator access is required to manage Jafory content` and a Sign in button. Opening the live `/ad` URL resolved to `/admin` and rendered the same protected sign-in state. Both paths were nonblank and no authentication action was initiated.

## GitHub source synchronization evidence

After the authorized update, `ahammadullah20-dotcom/jafory` main contains only `Jafory-Final-New-Netlify-Deploy.zip` and `README.md` at repository root. The archive size is 7,364,704 bytes; GitHub blob SHA is `959c300e679ad4be9afbbcdb6acf69120e6abfc9`; main commit is `a6b6c781ba409cf5c50b0958575ff7cc0b131927`. Downloading the GitHub raw archive produced SHA-256 `15fe277fefb9c07bede0141e64be0934434050ad6354e7443501d0248498c0f1`, matching the local `/home/ubuntu/Jafory-Final-Admin-Auth-Hardening.zip`. This proves the repository replacement and archive integrity. Netlify's internal deploy ID/status is not exposed by the GitHub contents API; live public route checks are the available runtime evidence.

## Corrective release evidence

Owner approved one corrective update. GitHub main was updated with commit `0174c818269659f83b081dd0f1d550dc6437d0d6`; the repository root still contains only the intended source ZIP and `README.md`. The uploaded archive is 7,369,142 bytes and includes the magic-link intent repair.

Read-only polling observed the live asset change from `/assets/index-BrXvKqME.js` to `/assets/index-qzru3QYA.js`. The current live bundle contains the compiled admin call `Li(void 0,"/admin")`, the callback construction with `searchParams.set("next",A3(t))`, and the authenticated account handoff `window.location.replace("/admin")`. This is evidence that the corrective source reached the live Netlify bundle.

The live callback URL `https://jafory.netlify.app/account?next=%2Fadmin` rendered a branded `Jafory account / Sign in to continue` state for an anonymous browser, rather than a blank page. The live `/api/trpc/auth.me` endpoint remains `200` with `null` for an anonymous session, `/api/trpc/admin.overview` remains `403 FORBIDDEN`, and public `catalog.home` remains `200`. Owner magic-link completion is intentionally not automated because it requires the owner’s private email/session.

## Owner recording `177990.mp4` diagnosis

The recording shows regular Chrome opening the Jafory tab, then an Incognito tab, followed by Gmail Spam where the Jafory magic-link email is opened. The link opens a Gmail-launched Chrome Custom Tab; the visible domain settles on `jafory.netlify.app`. The account confirmation page shows the signed-in account `ahmmedullah20`. After the owner taps `Open admin panel`, `Confirming administrator access…` appears at about 01:06, then the screen becomes solid white at about 01:07. The confirmation state briefly reappears around 01:21 and the white screen returns. The recording therefore reaches the authenticated admin route; it does not show a failure at the public storefront or an anonymous sign-in gate.

The strongest source-level cause is the admin shell’s `useIsMobile()` mount path: the old code unconditionally called `MediaQueryList.addEventListener`, which can throw in older or embedded Chrome Custom Tab implementations exactly when the shell mounts after authorization. The current source now guards missing `window.matchMedia`, supports both modern `addEventListener` and legacy `addListener`, and wraps the entire React tree in the existing visible `ErrorBoundary`. Local TypeScript, 47 active Vitest tests with 5 legacy skips, and production build pass. No new deployment was requested from this recording alone.

## Admin password release evidence

Owner approved the admin-only password route after the blank-screen recording. GitHub root was found to contain `Jafory-CustomTab-BlankScreen-Fix.zip` as the sole archive; that file was replaced with the latest password-login package in commit `3db7c9710ef17a49005ed1e4b8396dff4b7e0668`. The root still contains only one ZIP and `README.md`.

The live bundle changed to `/assets/index-D8bWDgeY.js` and contains `signInWithPassword`, `Admin sign in`, and `Customer/viewer sign-in`. A live browser visit to `https://jafory.netlify.app/admin` rendered the branded email/password form with email and password fields, an admin sign-in button, and a customer/viewer sign-in link. The page was not blank and no anonymous admin access was granted.

The owner must still set or reset the existing admin account password privately through Supabase and complete one real owner login. No password, OTP, recovery link, secret, Supabase data, product, role, review, or affiliate record was changed by this work.

## Bounded admin verification release evidence

Owner approved the narrowly scoped timeout/retry correction. The single GitHub root archive was replaced in commit `a44886706b3b383f05be6af200a02ffa99bc7fa9`. The live asset changed to `/assets/index-CqbqLYSn.js`; the bundle contains `Admin verification took too long` and `Retry admin verification`. A live browser visit to `https://jafory.netlify.app/admin` still renders the branded email/password form for an anonymous visitor, with the customer/viewer `/account` link, and no blank page or anonymous admin access. No Supabase data or credentials were changed.

The remaining owner-side check is a real admin password login after privately setting/resetting the existing admin password. If the authenticated verification API still stalls, the new release should show a retryable message after eight seconds rather than an endless `Confirming administrator access…` state.
