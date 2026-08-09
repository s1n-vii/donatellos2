/**
 * A single review excerpt. Text is always someone else's words — see
 * data/reviews.js. Unverified entries render with a visible development marker
 * so they can never be mistaken for real customer feedback.
 *
 * The large size prints the full posted review; smaller sizes fall back to the
 * short verbatim excerpt so homepage cards stay even in height.
 */
export function ReviewQuote({ review, size = 'md' }) {
  const full = Array.isArray(review.quote) ? review.quote : [review.quote]
  const paragraphs = size === 'lg' ? full : [review.excerpt ?? full[0]]

  return (
    <figure
      className={`review review--${size} ${review.verified ? '' : 'review--placeholder'}`.trim()}
    >
      <blockquote className="review__quote">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </blockquote>
      <figcaption className="review__meta">
        <span className="review__author">{review.author}</span>
        {review.source && <span className="review__source"> · {review.source}</span>}
        {review.rating != null && (
          <span className="review__rating"> · {review.rating} out of 5</span>
        )}
      </figcaption>
    </figure>
  )
}
