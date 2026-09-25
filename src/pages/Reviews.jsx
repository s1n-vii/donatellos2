import { CallToOrderButton } from '../components/Button'
import { ReviewQuote } from '../components/ReviewQuote'
import { business, formatDate, googleListingUrl } from '../data/business'
import { getDisplayReviews } from '../data/reviews'
import { PAGE_META } from '../data/seo'
import { usePageMeta } from '../lib/usePageMeta'

export function Reviews() {
  usePageMeta(PAGE_META.reviews)

  const displayed = getDisplayReviews()
  const { googleRating, googleReviewCount, ratingLastVerified } = business.rating
  const showRating = googleRating != null && googleReviewCount != null

  return (
    <div className="reviews-page">
      <section className="reviews-head" aria-labelledby="reviews-heading">
        <div className="page page--content">
          <h1 className="reviews-head__title" id="reviews-heading">
            What customers say
          </h1>
          <p className="reviews-head__intro">
            Reviews are shown exactly as they were posted publicly. Nothing here is written by us.
          </p>

          {showRating && (
            <div className="rating">
              <p className="rating__score">
                <span className="rating__number">{googleRating}</span>
                <span className="rating__scale"> out of 5</span>
              </p>
              <p className="rating__meta text-muted">
                Based on {googleReviewCount} Google reviews
                {ratingLastVerified && ` · Last checked ${formatDate(ratingLastVerified)}`}
              </p>
              <a
                className="rating__link"
                href={googleListingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                See the listing on Google
                <span aria-hidden="true"> ↗</span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </div>
          )}

          {import.meta.env.DEV && !showRating && (
            <p className="dev-note">
              Development only: set googleRating, googleReviewCount and ratingLastVerified in
              src/data/siteConfig.ts after checking the Google listing. The rating block is hidden
              until then.
            </p>
          )}
        </div>
      </section>

      {displayed.length > 0 ? (
        <section className="reviews-list" aria-label="Customer reviews">
          <div className="page page--content">
            {import.meta.env.DEV && displayed.some((review) => !review.verified) && (
              <p className="dev-note">
                Development only: replace each placeholder in src/data/reviews.js with a real
                posted review and set verified: true. Unverified entries do not appear in a
                production build.
              </p>
            )}
            <ul className="reviews-list__items">
              {displayed.map((review) => (
                <li key={review.id}>
                  <ReviewQuote review={review} size="lg" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className="reviews-empty reviews-empty--solo" aria-label="Reviews">
          <div className="page page--content reviews-empty__inner">
            <p className="reviews-empty__text">
              Review excerpts are being added. In the meantime, the best way to judge the food is
              to come in or call an order through.
            </p>
          </div>
        </section>
      )}

      <section className="reviews-cta" aria-label="Order">
        <div className="page page--content reviews-cta__inner">
          <p className="reviews-cta__text">Order pizza, subs and wings from Abbottstown.</p>
          <CallToOrderButton location="reviews_page" showNumber />
        </div>
      </section>
    </div>
  )
}
