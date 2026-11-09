# Footwear retail + wholesale website

Next.js 16 (App Router) · TypeScript · Tailwind v4 · zod · Vitest · Playwright.

## Run locally
Node 20.19+ is required (built with Node 26 LTS).
```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm test             # unit tests
npm run typecheck && npm run lint
npm run build && npm run e2e   # browser tests (Chromium, Firefox, WebKit/iPhone, Android)
```
Playwright browsers: `npx playwright install chromium firefox webkit`.

## Where things live
- `src/config/business.ts` — the single source of business facts (placeholders until confirmed). Set `NEXT_PUBLIC_*` vars in `.env.local`.
- `src/data/catalog.ts` — brands, categories, products (products/categories intentionally empty).
- `src/data/states.ts`, `faqs.ts` — service-area and FAQ copy.
- `src/app/api/inquiry/route.ts` — wholesale inquiry API.
- `docs/` — all audit and guide documents. See also `OWNER_ACTION_REQUIRED.md`.

## Safe defaults
The site is **noindex and robots-blocked** until `SITE_LIVE=true`. Policies and About are noindex drafts.
