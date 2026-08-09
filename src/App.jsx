import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { MobileActionBar } from './components/MobileActionBar'
import { StructuredData } from './components/StructuredData'
import { Home } from './pages/Home'
import { Menu } from './pages/Menu'
import { NotFound } from './pages/NotFound'
import { Reviews } from './pages/Reviews'
import { Visit } from './pages/Visit'

/**
 * Start each route at the top, or at the linked section when the URL carries a
 * hash. The browser's own hash handling runs before React has rendered the
 * target, so the scroll is repeated once the content exists. `scrollIntoView`
 * picks up each section's scroll-margin-top, which keeps the sticky header and
 * category bar from covering the heading.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    let secondFrame
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (!target) return
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        })
      })
    })

    return () => {
      cancelAnimationFrame(firstFrame)
      if (secondFrame) cancelAnimationFrame(secondFrame)
    }
  }, [pathname, hash])

  return null
}

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollManager />
      <Header />
      <main className="site-main" id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileActionBar />
      <StructuredData />
    </>
  )
}
