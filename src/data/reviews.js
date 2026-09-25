/**
 * Customer reviews for Abbottstown.
 *
 * West York review excerpts must not appear here. Add only verbatim public reviews
 * for this location with verified: true.
 */

export const reviews = []

export function getDisplayReviews(limit) {
  const list = import.meta.env.PROD ? reviews.filter((review) => review.verified) : reviews
  return typeof limit === 'number' ? list.slice(0, limit) : list
}

export const hasVerifiedReviews = reviews.some((review) => review.verified)
