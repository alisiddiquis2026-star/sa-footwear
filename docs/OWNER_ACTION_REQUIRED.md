# Owner action required (only real blockers)

## Facts (fill into `.env.local`, then `src/config/business.ts` for address/GST/hours)
- Domain, city/state (name "SA Footwear" is set; confirm exact legal name and logo)
- Phone, WhatsApp number (digits with 91), business email
- Physical address (only if you have a public premises), hours, GSTIN
- Social profile links

## Brand authorization
- **Woccy:** written proof if you are an authorized distributor. Until then the site says "independent seller" and never says "authorized". Change `woccyRelationship` and `relationshipVerified` only with evidence.
- List of the other brands you carry.

## Content and assets
- Real product photos (put originals in `assets/uploads/`, see ASSET_LICENSE_AUDIT.md), with brand/model/SKU/sizes/colours.
- Confirm categories that have real stock.
- About-us facts you can document (start year etc.). Testimonials only if real and permitted.
- Approve or replace policy drafts (privacy, terms, shipping/returns) with a qualified reviewer.

## Accounts and decisions
- Where inquiries go: set `INQUIRY_WEBHOOK_URL` (Google Sheets script, CRM, n8n). Without it production returns an honest 503 and shows phone/WhatsApp fallback.
- Hosting account (Vercel/Netlify/Cloudflare) and domain/DNS access.
- Whether to enable online payment (needs gateway account, GST/legal details). Not built: checkout is inquiry-only.
- Telugu/Tamil/Kannada: human-reviewed translations if wanted.
- Analytics choice and consent approach.

## Added 2026-11-09
- Send the Woccy permission message/letter to file (see ASSET_LICENSE_AUDIT.md).
- RESOLVED 2026-11-09 (owner said "do it"): 8929 = Ladies 5-9, WL 1119 = Gents 5-9. Original note: brand inconsistencies in Woccy's own images: art **8929** is labelled "Gents" on one image but "Ladies" on another (listed as Ladies, sizes 5-9); art **WL 1119** is labelled "Gents" with sizes 5-9 (listed as Gents). Art numbers 8889, 8816, 736, 8930, 8891 appear without a WL/WG prefix on the images.
- Replace ABC / SS Footwear / GG Foots sample products: for each real model give art number, category, colours, sizes and a real photo. Edit `src/data/sample-products.ts`, remove `sample: true`.
- Decide prices (MRP on images vs "Price on inquiry").

## Templates added 2026-11-09
- `docs/WOCCY_PERMISSION_REQUEST.md`: ready-to-send permission request. Still needs your send and Woccy's reply.
- `docs/BRAND_PRODUCTS_TEMPLATE.csv`: fill one row per real ABC / SS Footwear / GG Foots model, put photos in `assets/uploads/`, then send both to me.
