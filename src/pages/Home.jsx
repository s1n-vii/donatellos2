import { Link } from 'react-router-dom'
import { Button, CallToOrderButton, DeliveryButton } from '../components/Button'
import { Hours } from '../components/Hours'
import { RestaurantImage } from '../components/RestaurantImage'
import { ReviewQuote } from '../components/ReviewQuote'
import { addressLines, business, directionsUrl } from '../data/business'
import { featuredCategoryIds, formatPrice, menu } from '../data/menu'
import { getDisplayReviews } from '../data/reviews'
import { hasSpecials, specials } from '../data/specials'
import { PAGE_META } from '../data/seo'
import { EVENTS, track } from '../lib/analytics'
import { usePageMeta } from '../lib/usePageMeta'

/** Quick links into the menu until category photography is wired (see public/images/README). */
const MENU_CATEGORY_LINKS = [
  { name: 'Pizza', to: '/menu#fresh-hot-pizzas' },
  { name: 'Cheesesteaks', to: '/menu#hot-subs' },
  { name: 'Cheeseburger subs', to: '/menu#hot-subs' },
  { name: 'Wings', to: '/menu#wings' },
]

const MADE_HERE_PHOTO = null

const MADE_HERE = [
  'Pizza dough made in-house.',
  'Bread dough made in-house.',
  'Sauce made in-house.',
  'Ingredients prepared fresh.',
  'Meats not frozen.',
]

export function Home() {
  usePageMeta(PAGE_META.home)

  return (
    <>
      <Hero />
      <HomePractical />
      {hasSpecials && <SpecialsSection />}
      <MenuCategories />
      <MadeHere />
      <MenuPreview />
      <DineIn />
      <ReviewsPreview />
      <LocationBlock />
    </>
  )
}

function Hero() {
  return (
    <section className="hero hero--no-photo on-dark" aria-labelledby="hero-heading">
      <div className="hero__panel">
        <h1 className="hero__title" id="hero-heading">
          Pizza, subs &amp; wings made fresh in Abbottstown.
        </h1>
        <p className="hero__body">
          Dough, bread and sauce made in-house. Meats never frozen. Dine in or call ahead for
          pickup.
        </p>

        <div className="hero__actions">
          <CallToOrderButton size="lg" location="hero" />
          <Button to="/menu" variant="secondary-inverse" size="lg">
            View Menu
          </Button>
        </div>

        <p className="hero__tertiary">
          <DeliveryButton variant="link-inverse" location="hero" label="Order Delivery Online" />
        </p>
      </div>
    </section>
  )
}

function SpecialsSection() {
  return (
    <section className="specials" aria-labelledby="specials-heading">
      <div className="page page--content">
        <h2 className="specials__title" id="specials-heading">
          Specials
        </h2>
        <ul className="specials__list">
          {specials.map((special) => (
            <li className="specials__item" key={special.id}>
              <h3 className="specials__name">{special.title}</h3>
              {special.description && <p className="specials__desc">{special.description}</p>}
              {(special.price != null || special.priceNote) && (
                <p className="specials__price">
                  {special.price != null ? formatPrice(special.price) : special.priceNote}
                </p>
              )}
              {special.days && <p className="specials__days text-muted">{special.days}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function HomePractical() {
  return (
    <section className="home-practical" aria-labelledby="home-practical-heading">
      <div className="page home-practical__inner">
        <div className="home-practical__where">
          <h2 className="visually-hidden" id="home-practical-heading">
            Location and ordering
          </h2>
          <p className="home-practical__kicker">{business.areaLine}</p>
          <address className="home-practical__address">
            {addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <a
            className="home-practical__directions"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.DIRECTIONS_CLICK, { location: 'home_info_strip' })}
          >
            Get directions
            <span aria-hidden="true"> ↗</span>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>

        <div className="home-practical__order">
          <p className="home-practical__lead">
            Dine in and pickup by phone. Delivery through Slice.
          </p>
          <div className="home-practical__actions">
            <CallToOrderButton location="home_info_strip" />
            <DeliveryButton variant="ghost" location="home_info_strip" label="Order delivery" />
          </div>
        </div>
      </div>
    </section>
  )
}

function MenuCategories() {
  return (
    <section className="menu-categories" aria-labelledby="menu-categories-heading">
      <div className="page menu-categories__inner">
        <div className="menu-categories__intro">
          <h2 className="menu-categories__title" id="menu-categories-heading">
            Pizza, cheesesteaks, subs, wings
          </h2>
          <p className="menu-categories__sub">New York-style pizza and hot subs from the menu.</p>
        </div>

        <ul className="menu-categories__list">
          {MENU_CATEGORY_LINKS.map((item) => (
            <li key={item.name}>
              <Link className="menu-categories__link" to={item.to}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function MadeHere() {
  return (
    <section className="made" aria-labelledby="made-heading">
      <div className="page made__inner">
        <div className="made__lead">
          <h2 className="made__title" id="made-heading">
            Our dough. Our bread. Our sauce.
          </h2>
          <p className="made__tagline">Made here. Served hot.</p>
        </div>

        <ul className="made__list">
          {MADE_HERE.map((fact) => (
            <li className="made__fact" key={fact}>
              {fact}
            </li>
          ))}
        </ul>

        {MADE_HERE_PHOTO && (
          <div className="made__photo">
            <RestaurantImage
              src={MADE_HERE_PHOTO.src}
              srcSet={MADE_HERE_PHOTO.srcSet}
              sizes="(min-width: 900px) 26rem, 100vw"
              alt={MADE_HERE_PHOTO.alt}
              ratio="3 / 2"
            />
          </div>
        )}
      </div>
    </section>
  )
}

function MenuPreview() {
  const categories = featuredCategoryIds
    .map((id) => menu.find((category) => category.id === id))
    .filter(Boolean)

  return (
    <section className="menu-preview on-dark" aria-labelledby="menu-preview-heading">
      <div className="page menu-preview__inner">
        <div className="menu-preview__head">
          <h2 className="menu-preview__title" id="menu-preview-heading">
            On the menu
          </h2>
          <Button to="/menu" variant="secondary-inverse">
            See full menu
          </Button>
        </div>

        <ul className="menu-preview__list">
          {categories.map((category) => (
            <li key={category.id}>
              <Link className="menu-preview__row" to={`/menu#${category.id}`}>
                <span className="menu-preview__name">{category.name}</span>
                <span className="menu-preview__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function DineIn() {
  return (
    <section className="dine-in dine-in--copy-only" aria-labelledby="dine-in-heading">
      <div className="page dine-in__inner">
        <h2 className="dine-in__title" id="dine-in-heading">
          Stay for a slice.
        </h2>
        <p className="dine-in__text">
          Dine in at {business.name} on {business.address.street} or call ahead for pickup.
        </p>
        <Button to="/visit" variant="primary">
          Visit us in Abbottstown
        </Button>
      </div>
    </section>
  )
}

function ReviewsPreview() {
  const displayed = getDisplayReviews(3)
  if (displayed.length === 0) return null

  const { googleRating, googleReviewCount } = business.rating
  const showRating = googleRating != null && googleReviewCount != null

  return (
    <section className="home-reviews" aria-labelledby="home-reviews-heading">
      <div className="page page--content">
        <div className="home-reviews__head">
          <h2 className="home-reviews__title" id="home-reviews-heading">
            From our customers
          </h2>
          <Link className="home-reviews__more" to="/reviews">
            Read reviews
          </Link>
        </div>

        {showRating && (
          <p className="home-reviews__rating">
            <strong>{googleRating} out of 5</strong>
            <span className="text-muted"> · {googleReviewCount} Google reviews</span>
          </p>
        )}

        <div className="home-reviews__grid">
          {displayed.map((review) => (
            <ReviewQuote key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LocationBlock() {
  return (
    <section className="home-location" aria-labelledby="home-location-heading">
      <div className="page home-location__inner">
        <div className="home-location__details">
          <h2 className="home-location__title" id="home-location-heading">
            {business.name}
          </h2>
          <address className="home-location__address">
            {addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <p className="home-location__service">Dine in. Pick it up. Delivery through Slice.</p>
          <div className="home-location__actions">
            <Button
              href={directionsUrl}
              variant="secondary"
              external
              onClick={() => track(EVENTS.DIRECTIONS_CLICK, { location: 'home_location' })}
            >
              Get directions
            </Button>
            <Button to="/visit" variant="ghost">
              Hours &amp; map
            </Button>
          </div>
        </div>

        <div className="home-location__hours">
          <h3 className="label">Hours</h3>
          <Hours />
        </div>
      </div>
    </section>
  )
}
