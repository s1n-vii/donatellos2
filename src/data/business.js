/**
 * Single source of truth for Donatellos 2 business facts.
 *
 * Every hour string, phone number and address on the site reads from this file.
 * Nothing here may be guessed: fields that are not owner-confirmed are `null`
 * and marked TODO so they are obvious in review.
 */

export const business = {
  name: 'Donatellos 2',
  areaName: 'West York',
  areaLine: 'West York, PA',

  address: {
    street: '4790 W Market St',
    city: 'York',
    region: 'PA',
    regionName: 'Pennsylvania',
    postalCode: '17408',
    country: 'US',
  },

  phone: {
    display: '(717) 699-7896',
    href: 'tel:+17176997896',
    e164: '+1-717-699-7896',
  },

  service: {
    dineIn: true,
    pickup: true,
    // Delivery is fulfilled through the third-party Slice platform, not in-house.
    deliveryViaSlice: true,
  },

  /**
   * OWNER-CONFIRMED HOURS. Authoritative.
   * Do not replace with Google / Slice / DoorDash hours.
   * `open` and `close` are 24h "HH:MM" strings used for both display and JSON-LD.
   */
  hours: [
    { day: 'Monday', short: 'Mon', schemaDay: 'Monday', closed: false, open: '11:00', close: '21:00' },
    { day: 'Tuesday', short: 'Tue', schemaDay: 'Tuesday', closed: false, open: '11:00', close: '21:00' },
    { day: 'Wednesday', short: 'Wed', schemaDay: 'Wednesday', closed: false, open: '11:00', close: '21:00' },
    { day: 'Thursday', short: 'Thu', schemaDay: 'Thursday', closed: false, open: '11:00', close: '21:00' },
    { day: 'Friday', short: 'Fri', schemaDay: 'Friday', closed: false, open: '11:00', close: '22:00' },
    { day: 'Saturday', short: 'Sat', schemaDay: 'Saturday', closed: false, open: '11:00', close: '22:00' },
    { day: 'Sunday', short: 'Sun', schemaDay: 'Sunday', closed: true, open: null, close: null },
  ],

  /**
   * Verified Slice ordering page for this location (4790 W Market St, 17408).
   * Delivery is the third-party path; calling is the primary way to order.
   */
  sliceOrderingUrl: 'https://slicelife.com/restaurants/pa/york/17408/donatello-s-w-york/menu',

  /**
   * Public rating shown on the Reviews page. Read off the live Google listing
   * ("Donatellos 2 of west york") on the date below. Re-check it periodically
   * and update all three fields together — a stale count is worse than none.
   * Nothing renders while the score or count is null.
   */
  rating: {
    googleRating: 4.6,
    googleReviewCount: 49,
    ratingLastVerified: '2026-08-09',
    // Optional exact listing URL. While null, the site links to a Google Maps
    // lookup for this name and address, which resolves to the same listing.
    googleProfileUrl: null,
  },

  /**
   * Production origin, no trailing slash. Used for canonical URLs, share cards
   * and JSON-LD. Canonicals are omitted entirely while this is null.
   *
   * Currently the Vercel address, since there is no custom domain yet. Change
   * this one value when one is bought — and update the expected origin in
   * scripts/prod-check.mjs to match.
   */
  siteUrl: 'https://donatellos2.vercel.app',
}

export const addressLines = [
  business.address.street,
  `${business.address.city}, ${business.address.region} ${business.address.postalCode}`,
]

export const addressSingleLine = `${business.address.street}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}`

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${business.name}, ${addressSingleLine}`,
)}`

export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  addressSingleLine,
)}&output=embed`

/** Where "See the listing on Google" points. */
export const googleListingUrl =
  business.rating.googleProfileUrl ??
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${business.name}, ${addressSingleLine}`,
  )}`

/** "11:00" -> "11:00 AM" */
export function formatTime(time24) {
  if (!time24) return null
  const [hourStr, minute] = time24.split(':')
  const hour = Number(hourStr)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${minute} ${suffix}`
}

/** "11:00 AM – 9:00 PM" or "Closed" */
export function formatHourRange(entry) {
  if (entry.closed) return 'Closed'
  return `${formatTime(entry.open)} – ${formatTime(entry.close)}`
}

/** "2026-08-09" -> "August 9, 2026". Parsed as a plain date, not UTC midnight. */
export function formatDate(isoDate) {
  if (!isoDate) return null
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(year, month - 1, day))
}

/**
 * Weekday name in the restaurant's own timezone, so a late-night visitor on the
 * west coast still sees the correct day highlighted.
 */
export function getRestaurantWeekday(now = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      weekday: 'long',
    }).format(now)
  } catch {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now)
  }
}
