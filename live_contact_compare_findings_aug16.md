# Live contact and comparison findings — 2026-08-16

The live site at https://jafory.netlify.app/#/ loads the public storefront, six hero indicators, six categories including AI Learn / AI Tech, and product cards. Selecting a product through the card Compare control updates the header to `Compare (1)` and reveals a bottom-right `Compare now` floating control. The screenshot shows the Contact control is not simultaneously visible; the Compare control occupies the same lower-right region and hides/overlaps it.

The current live contact anchor is `#contact-link` and the source markup only exposes a single floating Contact Jafory action. The CSS places `.floating-contact` at `right:18px; bottom:18px`, explaining the collision with the Compare floating control. The source does not currently expose separate email, call, or direct contact-page actions in that floating control.

The live comparison state is publicly accessible. A selected product appears in the header count and can be opened through Compare / Compare now. The comparison route should be documented as: select Compare on product cards, open Compare now or header Compare, review specification rows, remove items, and add more from cards. No customer reviews or ratings are fabricated.

The current local source includes the existing `contact-link` anchor, and contact destinations are controlled through configured site settings/social settings. The corrective patch should use separate stacked floating controls and safe unconfigured states for WhatsApp, email, phone, and a direct contact route.

## Post-patch measurement

The rebuilt local storefront correctly exposes a Contact button, contact menu, and four configured/unconfigured channel states. With four products selected, the Compare tray and Contact button are both present, but the initial 82px separation was insufficient for the tray’s full height; the Contact control was still vertically close to the Compare tray. The CSS was subsequently raised to 104px desktop and 100px mobile, with the contact menu raised accordingly. A fresh local preview and final measurement are required before packaging.
