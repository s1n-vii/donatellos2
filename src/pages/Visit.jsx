import { Button, CallToOrderButton, DeliveryButton } from '../components/Button'
import { Hours } from '../components/Hours'
import {
  addressLines,
  addressSingleLine,
  business,
  directionsUrl,
  mapEmbedUrl,
} from '../data/business'
import { EVENTS, track } from '../lib/analytics'
import { PAGE_META } from '../data/seo'
import { usePageMeta } from '../lib/usePageMeta'

const ORDER_METHODS = [
  {
    id: 'dine-in',
    label: 'Dine in',
    text: `Sit down at the restaurant on ${business.address.street} and enjoy your meal in the dining room.`,
  },
  {
    id: 'pickup',
    label: 'Pickup',
    text: 'Call the shop, place your order, and pick it up at the counter.',
  },
  {
    id: 'delivery',
    label: 'Delivery',
    text: 'Delivery is handled online through Slice, a third-party ordering platform.',
  },
]

export function Visit() {
  usePageMeta(PAGE_META.visit)

  return (
    <div className="visit-page">
      <section className="visit-head" aria-labelledby="visit-heading">
        <div className="page visit-head__inner">
          <div className="visit-head__copy">
            <h1 className="visit-head__title" id="visit-heading">
              Visit {business.name} in Abbottstown
            </h1>
            <address className="visit-head__address">
              {addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <div className="visit-head__actions">
              <CallToOrderButton location="visit_header" />
              <Button
                href={directionsUrl}
                variant="secondary"
                external
                onClick={() => track(EVENTS.DIRECTIONS_CLICK, { location: 'visit_header' })}
              >
                Get Directions
              </Button>
            </div>
          </div>

          <div className="visit-head__hours">
            <h2 className="label">Hours</h2>
            <Hours />
          </div>
        </div>
      </section>

      <section className="visit-ordering" aria-labelledby="visit-ordering-heading">
        <div className="page page--content">
          <h2 className="visit-ordering__title" id="visit-ordering-heading">
            Dine in. Pick it up. Delivery through Slice.
          </h2>
          <dl className="visit-ordering__list">
            {ORDER_METHODS.map((method) => (
              <div className="visit-ordering__row" key={method.id}>
                <dt className="visit-ordering__label">{method.label}</dt>
                <dd className="visit-ordering__text">{method.text}</dd>
              </div>
            ))}
          </dl>
          <div className="visit-ordering__actions">
            <CallToOrderButton location="visit_ordering" showNumber />
            <DeliveryButton variant="ghost" location="visit_ordering" label="Order Delivery Online" />
          </div>
        </div>
      </section>

      <section className="visit-map" aria-labelledby="visit-map-heading">
        <div className="page visit-map__inner">
          <div className="visit-map__copy">
            <h2 className="visit-map__title" id="visit-map-heading">
              Finding us
            </h2>
            <p className="visit-map__text">
              On York Road in Abbottstown, convenient for Hanover, Gettysburg and the surrounding
              York-Adams county area.
            </p>
            <p className="visit-map__address-line text-muted">{addressSingleLine}</p>
            <Button
              href={directionsUrl}
              variant="primary"
              external
              onClick={() => track(EVENTS.DIRECTIONS_CLICK, { location: 'visit_map' })}
            >
              Get Directions
            </Button>
          </div>

          <div className="visit-map__frame">
            <iframe
              title={`Google Map showing ${business.name} at ${addressSingleLine}`}
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </div>
  )
}
