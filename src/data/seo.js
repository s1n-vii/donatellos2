import { business } from './business.js'

export const SHARE_IMAGE_PATH = '/images/interior/interior-01.webp'

/**
 * One source of truth for both the browser-rendered metadata and the static
 * route HTML written after the Vite build.
 */
export const PAGE_META = {
  home: {
    path: '/',
    title: 'Donatellos 2 | Pizza, Subs & Wings in West York, PA',
    description:
      'Donatellos 2 serves New York-style pizza, fresh-made subs, wings and Italian-American favorites in West York, PA. Dine in or call for pickup.',
    robots: 'index, follow',
  },
  menu: {
    path: '/menu',
    title: 'Menu | Donatellos 2 – West York, PA',
    description:
      'The full Donatellos 2 menu: pizza, specialty and stuffed pizzas, stromboli, wings, hot and cold subs, wraps, salads, pasta dinners and more. West York, PA.',
    robots: 'index, follow',
  },
  visit: {
    path: '/visit',
    title: 'Visit Donatellos 2 | 4790 W Market St, York, PA',
    description:
      'Donatellos 2 is at 4790 W Market St in West York, PA. Hours, directions, dine-in, pickup and delivery details. Call (717) 699-7896.',
    robots: 'index, follow',
  },
  reviews: {
    path: '/reviews',
    title: 'Reviews | Donatellos 2 – West York, PA',
    description:
      'What customers say about Donatellos 2 in West York, PA. Real reviews from the pizza shop at 4790 W Market St.',
    robots: 'index, follow',
  },
  notFound: {
    path: null,
    title: 'Page not found | Donatellos 2',
    description: 'That page does not exist. Find the Donatellos 2 menu, hours and location here.',
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
    openingHoursSpecification: business.hours
      .filter((entry) => !entry.closed)
      .map((entry) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${entry.schemaDay}`,
        opens: entry.open,
        closes: entry.close,
      })),
  }

  if (business.siteUrl) {
    schema.url = business.siteUrl
    schema.hasMenu = `${business.siteUrl}/menu`
    schema.image = `${business.siteUrl}${SHARE_IMAGE_PATH}`
  }

  return schema
}
