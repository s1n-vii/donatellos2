import { useEffect, useRef } from 'react'

/**
 * Sticky category jump list. Plain in-page anchors, so it works without JS,
 * keeps keyboard behaviour and honours the user's reduced-motion setting
 * through the global scroll-behavior rule. Vertical offset for the sticky
 * header comes from scroll-margin-top on each section.
 */
export function MenuCategoryNav({ categories, activeId }) {
  const listRef = useRef(null)

  // Keep the active category visible in the horizontally scrolling mobile list
  // by scrolling the strip itself, never the page.
  useEffect(() => {
    const list = listRef.current
    if (!list || !activeId) return

    const active = list.querySelector(`[data-category="${activeId}"]`)
    if (!active) return

    const listBox = list.getBoundingClientRect()
    const activeBox = active.getBoundingClientRect()
    const overflowsRight = activeBox.right > listBox.right - 12
    const overflowsLeft = activeBox.left < listBox.left + 12
    if (!overflowsRight && !overflowsLeft) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.scrollTo({
      left: list.scrollLeft + (activeBox.left - listBox.left) - 16,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [activeId])

  return (
    <nav className="category-nav" aria-label="Menu categories">
      <ul className="category-nav__list" ref={listRef}>
        {categories.map((category) => {
          const isActive = category.id === activeId
          return (
            <li key={category.id}>
              <a
                href={`#${category.id}`}
                data-category={category.id}
                className={isActive ? 'category-nav__link category-nav__link--active' : 'category-nav__link'}
                aria-current={isActive ? 'true' : undefined}
              >
                {category.name}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
