# Asset and licence audit (not legal advice; needs owner/qualified review)
| Asset | Source | Licence / evidence | Status | Action |
|---|---|---|---|---|
| Hero sole illustration (SVG in `src/app/page.tsx`) | Written for this project | Original | OK | Replace with real photography |
| Bricolage Grotesque, Hanken Grotesk | Google Fonts via next/font (self-hosted at build) | SIL OFL | OK | none |
| Next.js, React, Tailwind, zod, Vitest | npm | MIT | OK | none |
| @playwright/test (dev only) | npm | Apache-2.0 | OK | none |
| Product photos, brand logos | **None added** | n/a | Pending | Owner to supply with permission evidence |
| Woccy logos/images/copy | **Not used** | n/a | Excluded | Use only with written permission |
Review before launch: business-name and domain trademark conflicts (IP India public search, https://ipindia.gov.in/), brand-reference wording, and photo ownership. Nominative use of "Woccy" to identify products is a legal judgement for a qualified reviewer.

## Upload batch: "WhatsApp Unknown 2026-11-09" (56 JPEG + 2 MP4)
Stored in `assets/uploads/whatsapp-2026-11-09/` (gitignored). Inventory: `docs/UPLOAD_INVENTORY_2026-11-09.csv`.
| Finding | Detail |
|---|---|
| What they are | **Brand-made promotional creatives**, not our own photography. ~52 carry the Woccy logo, "Miles to Walk" tagline, woccy.in, MRP, art number, colour and size range. 3 are **Hoppins** (girls), 1 is **Foremost** (premium), both labelled as from the "house of Woccy". |
| Quality | Portrait, ~1333x1600, WhatsApp-compressed, EXIF stripped. 5 exact duplicate pairs (51 unique). No visible watermarks. |
| Rights | No evidence of permission. Brand logos, QR code (Telegram) and printed MRPs are baked into the images and cannot be cropped out without altering the brand's creative. |
| Videos | 2 MP4 (7.8 MB, 9.3 MB) **not reviewed** (no video tooling). |
| Status | **Requires approval. Excluded from the site and production build.** |
| Required action | Get written permission from Woccy / your distributor contact to use these creatives on your site (many brands supply dealer marketing kits, but do not assume). Ask for clean product shots without logos/MRP if possible. Confirm you actually carry Hoppins and Foremost before listing them as brands. |
Useful facts extracted for the catalogue once approved: art numbers, colours, size ranges (Ladies 5-9, Gents 6-10, Girls 1-4 / 11-13). Printed MRPs are the brand's; do not publish as your price without owner decision.

## Logo (owner-supplied 2026-11-09)
| Asset | Source | Status | Notes |
|---|---|---|---|
| SA Footwear logo (`assets/uploads/brand/sa-footwear-logo-original.jpeg`; web copies in `public/brand/`, favicon `src/app/icon.png`) | Supplied by owner via WhatsApp | Owner's own brand asset, in use | 1536x1024 JPEG with a baked-in dark background, so it cannot sit on a light page. Ask the designer for **SVG/transparent PNG** for sharper, flexible use. Confirm who created it and that you own it (it appears AI-generated; check the tool's terms). Trademark search for "SA Footwear" still pending. |
| "SK Food Wear" logo in Downloads | Not used | Different business name | Ignored |
Palette now derives from the logo: ink #0d1019 (sampled), gold #d4a82f, white, red accent #e63a2e. Gold is used for buttons (dark text); text accents use deep brass #7a5c00 to keep AA contrast on light pages.

## Update 2026-11-09: Woccy creatives now in use
- Owner states they **have permission** to use the Woccy creatives. Status: **in use, evidence pending**. Keep the written permission (email/WhatsApp from Woccy) on file; record its date and sender here when available.
- 51 unique creatives were resized to WebP in `public/products/` (33 Woccy/Hoppins/Foremost products). Originals stay in `assets/uploads/` (gitignored).
- The images have the brand's **MRP printed on them** (e.g. "Rs 369/-"). The site shows "Price on inquiry", so the two disagree. Decide: publish MRP, or ask Woccy for price-free versions.
- **Sample placeholders** (`public/products/{abc,ss-footwear,gg-foots}-sample-*.webp`): original illustrations drawn for this project, stamped "SAMPLE IMAGE". No third-party images were downloaded. Stock or Google images were deliberately not used (copyright, and they would misrepresent your stock). Replace each with real photos.
- Hoppins and Foremost remain `sample: true` until you confirm you carry them.

## Status note 2026-11-09 (owner)
This build is a **client demo/prototype**. Owner will obtain full written permissions from Woccy before launch. Until then the site stays noindex/robots-blocked (`SITE_LIVE` unset) and shows the "Preview build" banner. Do not set `SITE_LIVE=true` or share publicly until the permission evidence is recorded here.
