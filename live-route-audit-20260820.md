# Live Route Audit — 2026-08-20

Source checked: https://jafory.netlify.app/#/contact

The live standalone site currently exposes public internal links as hash routes, including `https://jafory.netlify.app/#/contact`, `#/about`, `#/privacy`, `#/disclosure`, `#/terms`, `#/compare`, and product/category hash routes. The live page remains publicly readable and includes a sitemap link at `https://jafory.netlify.app/sitemap.xml`.

The current source uses a hash parser and hashchange render cycle. The requested hashless strategy must therefore preserve existing hash links while migrating them to path URLs only after the client loads. Netlify needs a catch-all fallback so `/contact`, `/about`, `/privacy`, `/disclosure`, `/terms`, `/compare`, category paths, product paths, and `/account` still serve `index.html` after refresh.

The mobile screenshot shows the product video rendered below the image with large black areas because the video element has no dedicated responsive frame/object-fit treatment. The safe fix is a constrained `.product-detail-video-frame` with a neutral surface and a video using `object-fit:contain`, `width:100%`, `height:100%`, and a responsive aspect-ratio/min-height rule; this preserves the full video without cropping.

The Admin video file upload can succeed even though the native file input label resets after the mobile picker closes. The UI should show a separate retained-file status element driven by the in-memory pending file, and clear it only after successful Save or explicit replacement.
