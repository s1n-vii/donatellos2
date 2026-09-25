import { business } from './business.js'

/** No location photography in repo yet — omit share image until a real shot is added. */
export const SHARE_IMAGE_PATH = null

export const PAGE_META = {
  home: {
    path: '/',
    title: "Donatello's Pizzeria & Grill | Pizza, Subs & Wings in Abbottstown, PA",
    description:
      "Donatello's Pizzeria & Grill serves New York-style pizza, fresh-made subs, wings and Italian-American favorites in Abbottstown, PA. Dine in or call for pickup.",
    robots: 'index, follow',
  },
  menu: {
    path: '/menu',
    title: "Menu | Donatello's Pizzeria & Grill – Abbottstown, PA",
    description:
      "The full Donatello's menu: pizza, specialty and stuffed pizzas, stromboli, wings, hot and cold subs, wraps, salads, pasta dinners and more. Abbottstown, PA.",
    robots: 'index, follow',
  },
  visit: {
    path: '/visit',
    title: "Visit Donatello's | 6945 York Rd, Abbottstown, PA",
    description:
      "Donatello's Pizzeria & Grill is at 6945 York Rd in Abbottstown, PA. Directions, dine-in, pickup and delivery details. Call (717) 624-7930.",
    robots: 'index, follow',
  },
  reviews: {
    path: '/reviews',
    title: "Reviews | Donatello's Pizzeria & Grill – Abbottstown, PA",
    description:
      "What customers say about Donatello's Pizzeria & Grill in Abbottstown, PA.",
    robots: 'index, follow',
  },
  notFound: {
    path: null,
    title: "Page not found | Donatello's Pizzeria & Grill",
    description:
      "That page does not exist. Find the Donatello's menu, hours and Abbottstown location here.",
    robots: 'noindex, follow',
  },
}

export function absoluteSiteUrl(path = '/') {
  if (!business.siteUrl) return null
  return `${business.siteUrl}${path === '/' ? '/' : path}`
}

/** Restaurant schema containing owner-confirmed facts only. */
export function buildRestaurantSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: business.name,
    telephone: business.phone.e164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    servesCuisine: ['Pizza', 'Italian-American'],
  }

  if (business.hoursVerified && business.hours.length) {
    schema.openingHoursSpecification = business.hours
      .filter((entry) => !entry.closed)
      .map((entry) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${entry.schemaDay}`,
        opens: entry.open,
        closes: entry.close,
      }))
  }

  if (business.siteUrl) {
    schema.url = business.siteUrl
    schema.hasMenu = `${business.siteUrl}/menu`
    if (SHARE_IMAGE_PATH) {
      schema.image = `${business.siteUrl}${SHARE_IMAGE_PATH}`
    }
  }

  return schema
}
