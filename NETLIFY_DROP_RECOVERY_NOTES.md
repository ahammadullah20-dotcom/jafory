# Netlify Drop Recovery Notes

Jafory is deployed as a source package through Netlify Drop. Netlify Drop can unpack an uploaded project ZIP and run the project build when the account is signed in; therefore the package must contain the source project at its root rather than a source ZIP nested inside another package. The Netlify build configuration now installs locked dependencies and invokes the production build directly.

The product images and logo used by this package are copied into `client/public/` and are served from the resulting Netlify domain. The application no longer returns `/manus-storage/` URLs for canonical product cards.

The server catalog requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, while browser magic-link authentication requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The Project URL and the publishable browser key are not secrets; only the server key must be protected and must never be copied into a `VITE_` variable.

References: [Netlify Drop Quickstart](https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/), [Netlify Functions: Get Started](https://docs.netlify.com/build/functions/get-started/), and [Netlify Build Environment Variables](https://docs.netlify.com/build/configure-builds/environment-variables/).
