/**
 * Customer reviews.
 *
 * RULE: review text is never written by us. Every entry is copied verbatim from
 * a publicly posted review, including its original spelling and punctuation.
 *
 * To add a review:
 *   1. Copy the text exactly as posted. Trim with an ellipsis if needed, never reword.
 *   2. Add the reviewer name exactly as it appears publicly.
 *   3. Set `verified: true`.
 *
 * Unverified entries render only during development. Production builds drop
 * them, so an unfinished review can never ship looking like a real one.
 *
 * `quote` is the full posted text, one string per paragraph, shown on the
 * Reviews page. `excerpt` is a shorter run of the same words for the homepage,
 * where space is tight — it must stay a verbatim slice of `quote`.
 *
 * `trustDimension` is an internal note to keep the selection varied (taste,
 * portions, freshness, friendliness). It is not rendered.
 *
 * Relative timestamps ("2 months ago") are deliberately not stored: they go
 * stale the moment they are written down.
 */

export const reviews = [
  {
    id: 'glenn-ford',
    verified: true,
    trustDimension: 'taste and portions',
    author: 'Glenn Ford (318 MEDIA)',
    source: 'Google',
    rating: 5,
    quote: [
      "The food is fantastic. So far I've tried the pizza, chicken parmigiana and spaghetti & meatballs. The pizza is delicious. The pasta dishes have a tasty sauce that is slightly sweet and robust with flavor. Portion sizes are generous. Staff is helpful and polite. It's a little outside of my usual area of travel but well worth the drive into West York.",
    ],
    excerpt:
      'The pizza is delicious. The pasta dishes have a tasty sauce that is slightly sweet and robust with flavor. Portion sizes are generous.',
  },
  {
    id: 'david-stout',
    verified: true,
    trustDimension: 'freshness',
    author: 'David Stout',
    source: 'Google',
    rating: 5,
    quote: [
      'Stopped in and ate lunch with my kid after a soccer tournament. Kid got tenders and fries, like 6+ larger tenders and double fried "diner fries". I got a slice of pepperoni. Cant complain about anything. Nice little shop. Top notch non-sysco food. Will come back next time we are in area.',
    ],
    excerpt: 'Cant complain about anything. Nice little shop. Top notch non-sysco food.',
  },
  {
    id: 'david-bickford',
    verified: true,
    trustDimension: 'friendliness',
    author: 'David Bickford',
    source: 'Google',
    rating: 5,
    quote: [
      'A 5 star experience tonight. Great food, the pizza had a very unique and great taste. Very flavorful and I could tell the sauce and cheese were what made it unique. The garlic bread was fantastic.',
      'The pasta dinners, 5 stars, and largely proportioned. We eat at a lot of restaurants, and felt the owner had prepared pasta that we felt exceeded national chain Italian restaurant main dishes. We were very happy with the selection.',
      'The Hospitality was a capital H. Very helpful, kind and generous.',
      'My daughter mentioned by the end of the family meal, she would like to bring her friends here for her upcoming birthday party as the place she takes them for dinner. Over any other choice.',
      'The family really enjoyed the experience, and are glad you opened this new restaurant and pizza shop in West York and closer to us.',
      'We highly recommend eating here.',
    ],
    excerpt: 'The Hospitality was a capital H. Very helpful, kind and generous.',
  },
]

/** Reviews safe to render: everything in dev, verified only in production. */
export function getDisplayReviews(limit) {
  const list = import.meta.env.PROD ? reviews.filter((review) => review.verified) : reviews
  return typeof limit === 'number' ? list.slice(0, limit) : list
}

export const hasVerifiedReviews = reviews.some((review) => review.verified)
