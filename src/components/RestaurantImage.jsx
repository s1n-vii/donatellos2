import { useState } from 'react'

/**
 * Photography wrapper for the whole site.
 *
 * - Reserves space with aspect-ratio, so a missing or slow photo causes no shift.
 * - Accepts separate desktop/mobile object-position values, because the same
 *   crop rarely works in both a wide band and a tall phone frame.
 * - If the file is not on disk yet, renders a neutral placeholder block instead
 *   of a broken image icon. During development the block names the file that
 *   belongs there.
 */
export function RestaurantImage({
  src,
  srcSet,
  sizes,
  alt,
  ratio = '4 / 3',
  ratioMobile,
  objectPosition = 'center',
  objectPositionMobile,
  priority = false,
  placeholderLabel,
  className = '',
}) {
  const [failed, setFailed] = useState(false)

  const style = {
    '--image-ratio': ratio,
    '--image-ratio-mobile': ratioMobile ?? ratio,
    '--image-position': objectPosition,
    '--image-position-mobile': objectPositionMobile ?? objectPosition,
  }

  if (!src || failed) {
    return (
      <div className={`media media--empty ${className}`.trim()} style={style} role="presentation">
        <span className="media__empty-mark" aria-hidden="true" />
        {import.meta.env.DEV && (
          <span className="media__empty-label">
            Photo slot: {placeholderLabel ?? alt ?? 'image'}
            {src && <em>{src}</em>}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`media ${className}`.trim()} style={style}>
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className="media__img"
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
