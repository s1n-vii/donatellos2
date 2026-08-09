import { useEffect, useMemo, useRef, useState } from 'react'
import { CallToOrderButton, DeliveryButton } from '../components/Button'
import { MenuCategoryNav } from '../components/MenuCategoryNav'
import { MenuSearch } from '../components/MenuSearch'
import { MenuSection } from '../components/MenuSection'
import { business } from '../data/business'
import { countItems, filterMenu, menu } from '../data/menu'
import { PAGE_META } from '../data/seo'
import { EVENTS, track } from '../lib/analytics'
import { usePageMeta } from '../lib/usePageMeta'

export function Menu() {
  usePageMeta(PAGE_META.menu)

  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(menu[0].id)
  const sectionsRef = useRef(null)
  const navRef = useRef(null)

  const filtered = useMemo(() => filterMenu(query), [query])
  const isFiltering = query.trim().length > 0
  const resultCount = countItems(filtered)

  useEffect(() => {
    track(EVENTS.MENU_VIEW)
  }, [])

  /**
   * The category bar wraps onto a variable number of rows depending on width,
   * so the offset a jump link needs is measured rather than assumed.
   */
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const update = () => {
      const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
      const offset = Math.round(header + nav.getBoundingClientRect().height + 24)
      document.documentElement.style.setProperty('--menu-scroll-offset', `${offset}px`)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(nav)
    window.addEventListener('resize', update)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
      document.documentElement.style.removeProperty('--menu-scroll-offset')
    }
  }, [filtered.length])

  /**
   * Highlight whichever category has passed under the sticky navigation.
   * The IntersectionObserver wakes the check when a section enters or leaves the
   * viewport; the scroll listener keeps it exact in between. Both are throttled
   * to one animation frame.
   */
  useEffect(() => {
    const container = sectionsRef.current
    if (!container) return

    const sections = Array.from(container.querySelectorAll('.menu-section'))
    if (sections.length === 0) return

    let frame = 0

    const computeActive = () => {
      frame = 0
      const offset =
        Number.parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--menu-scroll-offset'),
          10,
        ) || 150

      let current = sections[0].id
      for (const section of sections) {
        if (section.getBoundingClientRect().top - offset > 1) break
        current = section.id
      }
      setActiveId(current)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(computeActive)
    }

    const observer = new IntersectionObserver(schedule, { threshold: [0, 1] })
    sections.forEach((section) => observer.observe(section))
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    computeActive()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [filtered])

  return (
    <div className="menu-page">
      <div className="menu-page__head">
        <div className="page page--content">
          <h1 className="menu-page__title">Menu</h1>
          <p className="menu-page__intro">
            Everything we make, at {business.address.street}. Dine in, call ahead for pickup, or
            order delivery through Slice.
          </p>

          <div className="menu-page__actions">
            <CallToOrderButton location="menu_header" showNumber />
            <DeliveryButton variant="ghost" location="menu_header" />
          </div>

          <MenuSearch
            value={query}
            onChange={setQuery}
            resultCount={resultCount}
            isFiltering={isFiltering}
          />
        </div>
      </div>

      {filtered.length > 0 && (
        <div className="menu-page__nav" ref={navRef}>
          <div className="page page--content">
            <MenuCategoryNav categories={filtered} activeId={isFiltering ? null : activeId} />
          </div>
        </div>
      )}

      <div className="page page--content menu-page__body" ref={sectionsRef}>
        {filtered.length === 0 ? (
          <div className="menu-empty">
            <p className="menu-empty__message">No menu items match that search.</p>
            <button type="button" className="btn btn--secondary btn--md" onClick={() => setQuery('')}>
              Show the full menu
            </button>
          </div>
        ) : (
          filtered.map((category) => <MenuSection key={category.id} category={category} />)
        )}
      </div>

      <div className="menu-page__foot on-dark">
        <div className="page page--content menu-page__foot-inner">
          <p className="menu-page__foot-text">Ready to order? Call the shop to place your order.</p>
          <div className="menu-page__foot-actions">
            <CallToOrderButton location="menu_footer" showNumber />
            <DeliveryButton
              variant="ghost-inverse"
              location="menu_footer"
              label="Order Delivery Online"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
