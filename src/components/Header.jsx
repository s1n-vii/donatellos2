import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { business } from '../data/business'
import { EVENTS, track } from '../lib/analytics'
import { CallToOrderButton, DeliveryButton } from './Button'

const NAV_LINKS = [
  { to: '/menu', label: 'Menu' },
  { to: '/visit', label: 'Visit' },
  { to: '/reviews', label: 'Reviews' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()
  const toggleRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <header className="site-header">
      <div className="site-header__inner page">
        <Link to="/" className="wordmark" aria-label={`${business.name} home`}>
          <span className="wordmark__name">Donatello&apos;s</span>
          <span className="wordmark__place">{business.areaLine}</span>
        </Link>

        <nav className="site-nav" aria-label="Main">
          <ul className="site-nav__list">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link'
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <a
            className="site-header__phone"
            href={business.phone.href}
            onClick={() => track(EVENTS.CALL_ORDER_CLICK, { location: 'header_number' })}
          >
            {business.phone.display}
          </a>
          <CallToOrderButton size="sm" location="header" />
        </div>

        <button
          type="button"
          ref={toggleRef}
          className="nav-toggle"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="nav-toggle__bars" aria-hidden="true">
            <span data-open={isOpen} />
            <span data-open={isOpen} />
          </span>
          {isOpen ? 'Close' : 'Menu'}
          <span className="visually-hidden"> navigation</span>
        </button>
      </div>

      <div className="mobile-nav" id={panelId} hidden={!isOpen}>
        <nav aria-label="Mobile">
          <ul className="mobile-nav__list">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? 'mobile-nav__link mobile-nav__link--active' : 'mobile-nav__link'
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-nav__actions">
          <CallToOrderButton size="md" location="mobile_nav" showNumber />
          <DeliveryButton variant="ghost-inverse" location="mobile_nav" label="Order Delivery Online" />
        </div>
      </div>
    </header>
  )
}
