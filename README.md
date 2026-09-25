# Donatello's Pizzeria & Grill — Abbottstown, PA

Website for Donatello's Pizzeria & Grill, 6945 York Rd, Abbottstown, PA 17301. React + Vite, deployed to Vercel.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Where things live

```
src/
  data/siteConfig.ts  Address, phone, orderUrl, directionsUrl, hours (verified only)
  data/menu.ts        Menu items and prices (shared West York transcription)
  data/specials.ts    Owner specials (homepage hidden when empty)
  data/reviews.js     Verbatim Abbottstown reviews only
  data/seo.js         Page metadata and Restaurant JSON-LD
  components/         Header, footer, mobile bar, menu UI
  pages/              Home, Menu, Visit, Reviews, 404
  styles/             tokens.css, global.css, components.css, pages.css
public/images/        Photography — see public/images/README.md
```

## Editing content

**Location facts.** `src/data/siteConfig.ts` only. Do not paste hours from Google or Slice until the owner confirms them.

**Menu.** `src/data/menu.ts`. Same pricing rules as the West York source; run `npm run audit:menu` after edits.

**Specials.** `src/data/specials.ts`. Leave the array empty to hide the homepage section.

## Verifying changes

With `npm run preview` running:

```bash
npm run audit:menu
npm run qa:functional
npm run qa:responsive
npm run qa:a11y
npm run qa:prod
```
