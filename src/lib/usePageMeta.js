import { useEffect } from 'react'
import { business } from '../data/business'
import { SHARE_IMAGE_PATH, absoluteSiteUrl } from '../data/seo'

function setMetaTag(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!content) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

/**
 * Keeps metadata correct after client-side navigation. The production build
 * also writes the same values into route-specific initial HTML, so crawlers
 * and link-preview bots do not need to execute React first.
 */
export function usePageMeta({ title, description, path, robots = 'index, follow' }) {
  useEffect(() => {
    if (title) document.title = title
    setMetaTag('name', 'description', description)
    setMetaTag('name', 'robots', robots)
    setMetaTag('property', 'og:title', title)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:type', 'website')
    setMetaTag('property', 'og:site_name', business.name)
    setMetaTag('name', 'twitter:card', business.siteUrl ? 'summary_large_image' : null)
    setMetaTag('name', 'twitter:title', title)
    setMetaTag('name', 'twitter:description', description)

    const canonicalHref = path ? absoluteSiteUrl(path) : null
    const existing = document.head.querySelector('link[rel="canonical"]')

    if (canonicalHref) {
      const link = existing ?? document.createElement('link')
      link.setAttribute('rel', 'canonical')
      link.setAttribute('href', canonicalHref)
      if (!existing) document.head.appendChild(link)
      setMetaTag('property', 'og:url', canonicalHref)
      setMetaTag('property', 'og:image', `${business.siteUrl}${SHARE_IMAGE_PATH}`)
      setMetaTag('name', 'twitter:image', `${business.siteUrl}${SHARE_IMAGE_PATH}`)
    } else if (existing) {
      existing.remove()
      setMetaTag('property', 'og:url', null)
      setMetaTag('property', 'og:image', null)
      setMetaTag('name', 'twitter:image', null)
    }
  }, [title, description, path, robots])
}
