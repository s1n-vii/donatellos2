/**
 * Single source of truth for Donatello's Pizzeria & Grill — Abbottstown, PA.
 *
 * Verified fields: address, phone, Slice ordering URL, owner-confirmed hours.
 * Google rating is owner-confirmed only — left unset until supplied.
 */

import { confirmedHours, type HourEntry } from './hours.ts'

export type { HourEntry }

export const siteConfig = {
  name: "Donatello's Pizzeria & Grill",
  locationName: 'Abbottstown',
  areaLine: 'Abbottstown, PA',

  address: {
    street: '6945 York Rd',
    city: 'Abbottstown',
    region: 'PA',
    regionName: 'Pennsylvania',
    postalCode: '17301',
    country: 'US',
  },

  phone: {
    display: '(717) 624-7930',
    href: 'tel:+17176247930',
    e164: '+1-717-624-7930',
  },

  service: {
    dineIn: true,
    pickup: true,
    deliveryViaSlice: true,
  },

  /** Owner-confirmed hours — see `src/data/hours.ts`. */
  hoursVerified: true,
  hours: confirmedHours,

  /**
   * Verified Slice ordering page for 6945 York Rd, Abbottstown 17301.
   * Calling the shop remains the primary way to order.
   */
  orderUrl:
    'https://slicelife.com/restaurants/pa/abbottstown/17301/divino-pizzeria-grill-abbottstown/menu',

  /**
   * Production origin, no trailing slash. Update when a custom domain is live
   * and match ORIGIN in scripts/prod-check.mjs.
   */
  siteUrl: 'https://donatellos-abbottstown.vercel.app',

  rating: {
    googleRating: null as number | null,
    googleReviewCount: null as number | null,
    ratingLastVerified: null as string | null,
    googleProfileUrl: null as string | null,
  },
}

/** Legacy alias used across components and scripts. */
export const business = {
  ...siteConfig,
  get sliceOrderingUrl() {
    return siteConfig.orderUrl
  },
}

export const addressLines = [
  siteConfig.address.street,
  `${siteConfig.address.city}, ${siteConfig.address.region} ${siteConfig.address.postalCode}`,
]

export const addressSingleLine = `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.region} ${siteConfig.address.postalCode}`

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${siteConfig.name}, ${addressSingleLine}`,
)}`

export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  addressSingleLine,
)}&output=embed`

export const googleListingUrl =
  siteConfig.rating.googleProfileUrl ??
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${siteConfig.name}, ${addressSingleLine}`,
  )}`

export function formatTime(time24: string | null) {
  if (!time24) return null
  const [hourStr, minute] = time24.split(':')
  const hour = Number(hourStr)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${minute} ${suffix}`
}

export function formatHourRange(entry: HourEntry) {
  if (entry.closed) return 'Closed'
  return `${formatTime(entry.open)} – ${formatTime(entry.close)}`
}

export function formatDate(isoDate: string | null) {
  if (!isoDate) return null
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(year, month - 1, day))
}

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
