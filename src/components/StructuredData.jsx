import { buildRestaurantSchema } from '../data/seo'

/**
 * Restaurant JSON-LD built only from owner-confirmed facts.
 *
 * Deliberately absent: priceRange, geo, sameAs, founder and foundingDate. Those
 * get added only when someone supplies real values — invented structured data
 * is a liability, not an SEO win.
 *
 * aggregateRating and review stay out on purpose even though the Google score
 * is known. Google's review snippet policy only accepts ratings collected by
 * the site itself; marking up a score copied from another platform risks a
 * manual action. The rating is shown as plain text on the Reviews page instead.
 */
export function StructuredData() {
  // Production route files already carry this schema in <head> so crawlers can
  // read it without JavaScript. Render a copy only during Vite development,
  // where index.html is intentionally a minimal shared shell.
  if (document.head.querySelector('#restaurant-schema')) return null

  const schema = buildRestaurantSchema()

  return (
    <script
      id="restaurant-schema"
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
