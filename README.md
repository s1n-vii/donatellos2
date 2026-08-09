# Donatellos 2 — West York, PA

Website for Donatellos 2, 4790 W Market St, York, PA 17408. React + Vite, deployed to Vercel.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Where things live

```
src/
  data/business.js   Address, phone, hours, Slice URL, rating config — single source of truth
  data/menu.js       Every menu item and price
  data/reviews.js    Verbatim customer reviews
  data/seo.js        Shared page metadata and factual Restaurant schema
  components/        Header, footer, mobile action bar, menu pieces, photography wrapper
  pages/             Home, Menu, Visit, Reviews, 404
  styles/            tokens.css, global.css, components.css, pages.css
public/images/       Photography — see public/images/README.md
```

## Editing content

**Hours, address, phone.** `src/data/business.js` only. Every page reads from it, so
there is exactly one place to change and nothing to keep in sync. The hours in that
file are owner-confirmed; do not replace them with hours from Google, Slice or DoorDash.

**Menu prices.** `src/data/menu.js`. Prices are stored as final display values and are
never computed at runtime. Standard items already include the owner's +$1.00 adjustment
over the printed menu; modifiers, add-ons and the lunch special are printed prices and
were deliberately left alone. The printed in-store menu is the only source — nothing on
this site comes from an ordering platform. A photograph of the in-store menu was checked
against every price and agreed throughout; `npm run audit:menu` re-runs that diff.

**Photos.** Convert a source photo to the WebP sizes the site loads, then point a slot
at it:

```bash
npm run images -- ~/photos/pizza.jpg public/images/food/pizza 640 1024
```

That writes `pizza-640.webp` and `pizza.webp`. It uses the available Playwright browser
or installed system Chrome, so there is no image library to add. Food categories with
no photo render as an asymmetric typographic index rather than empty frames — see
`FOOD_TILES` in `src/pages/Home.jsx`.

**Reviews.** `src/data/reviews.js`. Copy the posted text exactly, including its original
spelling, and set `verified: true`. Unverified entries are stripped from production
builds, so nothing unconfirmed can ship as a testimonial.

## Before launch

Everything below either renders as an obvious placeholder or stays hidden until filled in.

1. **Custom domain** — `business.siteUrl` is currently the Vercel address,
   `https://donatellos2.vercel.app`. Canonical tags, `og:url`, `og:image`, the JSON-LD
   `url` and the generated sitemap all derive from it. When a domain is bought, change
   that one value and the matching `ORIGIN` in `scripts/prod-check.mjs`, then redirect
   the old address so the two do not compete in search results.
2. **Food photography** — the four homepage categories and the "made here" section have
   no photos yet and currently render as type. Adding files needs no layout changes.
3. **Higher-resolution interiors** — the two interior photos are 1024px wide, which the
   hero stretches slightly on large screens. Larger originals would sharpen it.
4. **Beverage prices** — `soda`, `water` and `2 liter` render without prices. Add them from
   the in-store menu.
5. **Printed add-ons** — the build brief did not supply the appetizer, salad or pasta
   add-on names/prices it referenced. Transcribe any of those that appear on the physical
   menu; do not obtain them from Slice.
6. **Google rating** — `4.6` from `49` reviews, last checked 2026-08-09. Re-check
   periodically and update all three fields in `business.rating` together.

## Verifying changes

The checks below run against a real browser. Start `npm run dev` first (or
`npm run preview` for the two that check the built output), then:

```bash
npm run audit:menu       # re-transcribes the owner's price list and diffs it against menu.js
npm run qa:functional    # routes, phone links, search, category jumps, mobile nav, touch targets
npm run qa:responsive    # 320–1600px sweep for overflow and console errors
npm run qa:a11y          # contrast ratios, heading order, alt text, control names
npm run qa:motion        # reduced-motion behaviour and layout shift (needs preview)
npm run qa:prod          # fails if placeholder or dev-only content reaches a build (needs preview)
npm run qa:shots         # section screenshots for design review
```

`qa:shots` takes an optional width and honours `QA_BASE`, so
`QA_BASE=http://localhost:4173 node scripts/shots.mjs 390` reviews the built site at
phone width.

`npm run qa:prod` is the important one before deploying: it fails the moment
placeholder review text, a development note or a wrong page title would ship.
Playwright is a dev dependency only and is not part of the site bundle. QA first uses a
configured/custom Playwright browser, then Playwright's installed Chromium. When neither
exists, it automatically falls back to Google Chrome in `/Applications`, so a separate
browser download is not required on a normal Mac Chrome installation.

## Analytics

`src/lib/analytics.js` fires `call_order_click`, `menu_view`, `delivery_click` and
`directions_click`. It detects `gtag`, `dataLayer` or `plausible` at runtime and no-ops
when none is present, so no analytics dependency is installed and the site works either way.

## Deployment

Vercel, zero config: `vercel deploy --prod`. `vercel.json` enables clean URLs and sets
cache headers for hashed build assets. The postbuild step writes `menu.html`,
`visit.html`, `reviews.html`, and `404.html`: known routes therefore support direct
loads with route-specific metadata, while unknown URLs receive a real 404 instead of a
soft-404 homepage rewrite. React Router continues to handle in-app navigation.

`npm run build` also runs `scripts/seo-files.mjs`, which writes the route HTML,
`dist/robots.txt`, and `dist/sitemap.xml` from `business.siteUrl` and `data/seo.js`.
Generated files are not committed, so page metadata and crawler URLs cannot drift from
the source config.
