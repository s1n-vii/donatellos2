/**
 * Conversion tracking with no dependency and no provider assumptions.
 *
 * If Google Analytics / GTM / Plausible is added later, it is picked up
 * automatically. With nothing installed every call is a silent no-op, so the
 * site behaves identically whether or not analytics exists.
 */

export const EVENTS = {
  CALL_ORDER_CLICK: 'call_order_click',
  MENU_VIEW: 'menu_view',
  DELIVERY_CLICK: 'delivery_click',
  DIRECTIONS_CLICK: 'directions_click',
}

export function track(eventName, params = {}) {
  if (typeof window === 'undefined') return

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params)
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params })
    } else if (typeof window.plausible === 'function') {
      window.plausible(eventName, { props: params })
    }
  } catch {
    // Analytics must never break an ordering action.
  }
}
