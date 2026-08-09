import { Link } from 'react-router-dom'
import { addressLines, business, directionsUrl } from '../data/business'
import { EVENTS, track } from '../lib/analytics'
import { CallToOrderButton, DeliveryButton } from './Button'
import { Hours } from './Hours'

export function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="page site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__name">
            Donatellos <span className="wordmark__numeral">2</span>
          </p>
          <address className="site-footer__address">
            {addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <a
              href={business.phone.href}
              onClick={() => track(EVENTS.CALL_ORDER_CLICK, { location: 'footer' })}
            >
              {business.phone.display}
            </a>
          </address>
          <a
            className="site-footer__directions"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.DIRECTIONS_CLICK, { location: 'footer' })}
          >
            Get Directions
            <span aria-hidden="true"> ↗</span>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>

        <div className="site-footer__hours">
          <h2 className="label">Hours</h2>
          <Hours variant="compact" />
        </div>

        <div className="site-footer__links">
          <h2 className="label">Pages</h2>
          <ul className="site-footer__nav">
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/visit">Visit</Link>
            </li>
            <li>
              <Link to="/reviews">Reviews</Link>
            </li>
          </ul>
        </div>

        <div className="site-footer__actions">
          <CallToOrderButton location="footer" showNumber />
          <DeliveryButton variant="ghost-inverse" location="footer" label="Order Delivery" />
          <p className="site-footer__note text-muted">
            Delivery is handled through Slice. For dine-in and pickup, call the restaurant.
          </p>
        </div>
      </div>

      <div className="page site-footer__legal">
        <p>© {new Date().getFullYear()} Donatellos 2</p>
        <p>{business.areaLine}</p>
      </div>
    </footer>
  )
}
