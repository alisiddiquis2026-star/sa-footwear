# Test report
| Check | Result |
|---|---|
| `npm run build` | Pass (25 pages) |
| `tsc --noEmit`, `eslint` | Pass, 0 errors |
| Unit tests (vitest) | 14/14 pass: schema, GSTIN, mobile, rate limit, duplicates, filtering |
| Live API (curl) | valid 200 saved; invalid 422 friendly; duplicate; honeypot; bad JSON 400; cross-origin 403; no-origin 403; rate limit 429; no storage 503 |
| Playwright, run twice | 36 pass / 8 skipped by design / 0 fail |
Browsers: Chromium, Firefox, WebKit with iPhone 14 emulation, Pixel 7 emulation. **These are emulations, not real devices.**
Covered: 20 routes load, no console/page errors, no horizontal overflow at 320/360/375/390/414/768/1024/1280/1440/1920 (Chromium), alt text, skip link, mobile menu, empty-state shop, no fake contact links, form validation and submit, prefilled inquiry, JSON-LD sanity, reduced motion.
Test filters: aborted Next `?_rsc=` prefetch errors are ignored (WebKit reports them as page errors); the 404 route's expected console line is ignored.
**Not tested:** Lighthouse/Core Web Vitals (not measured), axe accessibility scan, real devices, product pages/gallery/zoom (no products exist), email sending (not built), WhatsApp links with a real number, deployment.

## Update 2026-11-09 (after catalogue + redesign)
Unit 20/20, e2e 44 pass / 8 skipped by design / 0 fail, typecheck and lint clean, build 75 pages. New coverage: catalogue integrity (files exist, alt text, no prices, sample flags), shop listing/filter/empty state, product page (gallery, no Offer schema, inquiry link), sample products noindex, sitemap excludes samples (verified 46 URLs). Still **not** measured: Lighthouse/Core Web Vitals, axe accessibility scan, real devices. Product galleries are stacked images (no zoom/thumbnail switcher yet).
