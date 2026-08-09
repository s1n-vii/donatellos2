import { Link } from 'react-router-dom'
import { business } from '../data/business'
import { EVENTS, track } from '../lib/analytics'

/**
 * Fixed bottom bar on small screens. The three things a phone visitor actually
 * wants, in priority order: call, menu, delivery.
 * Page content reserves space for it via .site-main padding-bottom.
 */
export function MobileActionBar() {
  return (
    <div className="mobile-bar">
      <nav className="mobile-bar__inner" aria-label="Quick actions">
        <a
          className="mobile-bar__action mobile-bar__action--call"
          href={business.phone.href}
          onClick={() => track(EVENTS.CALL_ORDER_CLICK, { location: 'mobile_bar' })}
        >
          Call
          <span className="visually-hidden"> {business.name} at {business.phone.display}</span>
        </a>
        <Link className="mobile-bar__action" to="/menu">
          Menu
        </Link>
        <a
          className="mobile-bar__action"
          href={business.sliceOrderingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(EVENTS.DELIVERY_CLICK, { location: 'mobile_bar' })}
        >
          Delivery
          <span className="visually-hidden"> — order through Slice (opens in a new tab)</span>
        </a>
      </nav>
    </div>
  )
}
