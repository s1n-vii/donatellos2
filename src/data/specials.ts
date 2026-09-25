/**
 * Abbottstown-only specials. Section hidden on the homepage when this list is empty.
 * Do not invent deals — add entries only after the owner confirms name, price and terms.
 */

export type Special = {
  id: string
  title: string
  description?: string
  price?: number | null
  priceNote?: string
  days?: string
}

export const specials: Special[] = []

export const hasSpecials = specials.length > 0
