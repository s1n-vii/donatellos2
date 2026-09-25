import { Link } from 'react-router-dom'
import { business } from '../data/business'
import { EVENTS, track } from '../lib/analytics'

/**
 * One button/link primitive. Renders a router Link, an anchor or a button
 * depending on which destination prop is supplied, so semantics always match
 * behaviour: navigation is a link, actions are buttons.
 */
export function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  external = false,
  className = '',
  ...rest
}) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, className].filter(Boolean).join(' ')

  const content = external ? (
    <>
      {children}
      <span className="btn__external" aria-hidden="true">
        ↗
      </span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </>
  ) : (
    children
  )

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
      <a href={href} className={classes} onClick={onClick} {...externalProps} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} onClick={onClick} {...rest}>
      {content}
    </button>
  )
}

/** Primary conversion. Calling is how the restaurant prefers to take orders. */
export function CallToOrderButton({ variant = 'primary', size = 'md', location, showNumber = false }) {
  return (
    <Button
      href={business.phone.href}
      variant={variant}
      size={size}
      onClick={() => track(EVENTS.CALL_ORDER_CLICK, { location })}
    >
      Call to Order
      {showNumber && <span className="btn__number">{business.phone.display}</span>}
    </Button>
  )
}

/** Third-party delivery. Labelled explicitly so it never reads as the only way to order. */
export function DeliveryButton({ variant = 'ghost', size = 'md', location, label = 'Order Delivery' }) {
  return (
    <Button
      href={business.orderUrl}
      variant={variant}
      size={size}
      external
      onClick={() => track(EVENTS.DELIVERY_CLICK, { location })}
    >
      {label}
    </Button>
  )
}
