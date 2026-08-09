import { Link } from 'react-router-dom'
import { Button, CallToOrderButton, DeliveryButton } from '../components/Button'
import { Hours } from '../components/Hours'
import { RestaurantImage } from '../components/RestaurantImage'
import { ReviewQuote } from '../components/ReviewQuote'
import { addressLines, business, directionsUrl } from '../data/business'
import { featuredCategoryIds, menu } from '../data/menu'
import { getDisplayReviews } from '../data/reviews'
import { PAGE_META } from '../data/seo'
import { EVENTS, track } from '../lib/analytics'
import { usePageMeta } from '../lib/usePageMeta'

/**
 * Hero photograph. The owner chose the interior shot for version one.
 * To lead with food later, point `src` and `srcSet` at a food image and adjust
 * the focal points — the section layout, height and text placement stay exactly
 * as they are.
 */
const HERO_IMAGE = {
  src: '/images/interior/interior-02.webp',
  srcSet: '/images/interior/interior-02-640.webp 640w, /images/interior/interior-02.webp 1024w',
  sizes: '(min-width: 1400px) 1400px, 100vw',
  alt: 'The dining room at Donatellos 2, with wooden tables, black metal chairs, reclaimed wood walls and the pizza counter at the back',
  // The text panel covers the left of the frame on wide screens, so this shot
  // is used for the hero: it keeps the pizza counter visible beside the panel.
  // The floor fills the bottom, so the wide crop sits high.
  objectPosition: 'center 34%',
  objectPositionMobile: 'center 40%',
  placeholderLabel: 'interior-02 — dining room and counter',
}

/**
 * Food categories. `src` stays null until a real photograph of that item
 * exists; tiles without a photo render as typographic blocks rather than empty
 * frames. To add one, drop the file in public/images/food/ (run
 * `npm run images -- <source> public/images/food/<name> 640 1024`) and set
 * `src`, `srcSet` and a literal `alt`.
 */
const FOOD_TILES = [
  {
    id: 'pizza',
    name: 'Pizza',
    to: '/menu#fresh-hot-pizzas',
    src: null,
    alt: 'A whole pizza from Donatellos 2, cut into slices',
    area: 'pizza',
    ratioMobile: '4 / 5',
  },
  {
    id: 'cheesesteak',
    name: 'Cheesesteaks',
    to: '/menu#hot-subs',
    src: null,
    alt: 'A cheesesteak sub on a roll from Donatellos 2',
    area: 'cheesesteak',
    ratioMobile: '16 / 9',
  },
  {
    id: 'cheeseburger-sub',
    name: 'Cheeseburger Subs',
    to: '/menu#hot-subs',
    src: null,
    alt: 'A cheeseburger sub from Donatellos 2',
    area: 'burger',
    ratioMobile: '4 / 3',
  },
  {
    id: 'wings',
    name: 'Wings',
    to: '/menu#wings',
    src: null,
    alt: 'A basket of wings from Donatellos 2',
    area: 'wings',
    ratioMobile: '2 / 1',
  },
]

/** Set to a file path once a kitchen or dough photo exists. */
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
      <InfoStrip />
      <FoodFeature />
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
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__media">
        <RestaurantImage {...HERO_IMAGE} ratio="16 / 9" ratioMobile="4 / 3" priority />
      </div>

      <div className="hero__panel on-dark">
        <h1 className="hero__title" id="hero-heading">
          Pizza, subs &amp; wings made fresh in West York.
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

        <p className="hero__phone">
          <a
            href={business.phone.href}
            onClick={() => track(EVENTS.CALL_ORDER_CLICK, { location: 'hero_number' })}
          >
            {business.phone.display}
          </a>
        </p>

        <p className="hero__tertiary">
          <DeliveryButton variant="link-inverse" location="hero" label="Order Delivery Online" />
        </p>
      </div>
    </section>
  )
}

function InfoStrip() {
  return (
    <section className="info-strip" aria-label="Location, service and phone">
      <div className="page info-strip__inner">
        <div className="info-strip__item">
          <h2 className="label">Find us</h2>
          <address className="info-strip__address">
            {addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <a
            className="info-strip__link"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.DIRECTIONS_CLICK, { location: 'home_info_strip' })}
          >
            Get Directions
            <span aria-hidden="true"> ↗</span>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>

        <div className="info-strip__item">
          <h2 className="label">How to order</h2>
          <p className="info-strip__lead">Dine In + Pickup</p>
          <p className="info-strip__sub text-muted">Delivery through Slice.</p>
        </div>

        <div className="info-strip__item">
          <h2 className="label">Call the shop</h2>
          <p className="info-strip__phone">
            <a
              href={business.phone.href}
              onClick={() => track(EVENTS.CALL_ORDER_CLICK, { location: 'home_info_strip' })}
            >
              {business.phone.display}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

function FoodFeature() {
  const hasPhotos = FOOD_TILES.some((tile) => tile.src)

  return (
    <section className="food" aria-labelledby="food-heading">
      <div className="page">
        <div className="food__head">
          <h2 className="food__title" id="food-heading">
            Pizza. Cheesesteaks. Subs. Wings.
          </h2>
          <p className="food__sub">New York-style pizza, subs, wings and more.</p>
        </div>

        <ul className={`food__grid ${hasPhotos ? '' : 'food__grid--type'}`.trim()}>
          {FOOD_TILES.map((tile) => (
            <li className="food__tile" key={tile.id} data-area={tile.area}>
              <Link className="food__link" to={tile.to}>
                {tile.src ? (
                  <>
                    <RestaurantImage
                      src={tile.src}
                      srcSet={tile.srcSet}
                      sizes={tile.sizes}
                      alt={tile.alt}
                      ratio="4 / 3"
                      ratioMobile={tile.ratioMobile}
                      className="media--fill"
                    />
                    <span className="food__label">
                      <span className="food__name">{tile.name}</span>
                      <span className="food__cue" aria-hidden="true">
                        On the menu →
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="food__plate">
                    <span className="food__name">{tile.name}</span>
                    <span className="food__cue" aria-hidden="true">
                      On the menu →
                    </span>
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {import.meta.env.DEV && FOOD_TILES.some((tile) => !tile.src) && (
          <p className="dev-note">
            Development only: these categories have no photograph yet, so they render as type. Add
            files under public/images/food/ and set src on the matching tile in Home.jsx.
          </p>
        )}
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

        <ol className="made__list">
          {MADE_HERE.map((fact, index) => (
            <li className="made__fact" key={fact}>
              <span className="made__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="made__text">{fact}</span>
            </li>
          ))}
        </ol>

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
            On the Menu
          </h2>
          <Button to="/menu" variant="secondary-inverse">
            See Full Menu
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
    <section className="dine-in" aria-labelledby="dine-in-heading">
      <div className="dine-in__media">
        <RestaurantImage
          src="/images/interior/interior-01.webp"
          srcSet="/images/interior/interior-01-640.webp 640w, /images/interior/interior-01.webp 1024w"
          sizes="(min-width: 900px) 50vw, 100vw"
          alt="Long wooden tables and bench seating under strings of warm bulbs inside Donatellos 2 on W Market St"
          ratio="5 / 4"
          ratioMobile="16 / 10"
          objectPosition="60% 45%"
        />
      </div>
      <div className="dine-in__copy">
        <h2 className="dine-in__title" id="dine-in-heading">
          Stay for a slice.
        </h2>
        <p className="dine-in__text">
          Dine in at Donatellos 2 on W Market St or call ahead for pickup. Grab a table or call it
          in.
        </p>
        <Button to="/visit" variant="primary">
          Visit Donatellos 2
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

        {import.meta.env.DEV && displayed.some((review) => !review.verified) && (
          <p className="dev-note">
            Development only: paste real, publicly posted reviews into src/data/reviews.js and set
            verified: true. Unverified entries are removed from production builds.
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
            Donatellos 2
          </h2>
          <address className="home-location__address">
            {addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <p className="home-location__phone">
            <a
              href={business.phone.href}
              onClick={() => track(EVENTS.CALL_ORDER_CLICK, { location: 'home_location' })}
            >
              {business.phone.display}
            </a>
          </p>
          <p className="home-location__service">Dine in. Pick it up. Delivery through Slice.</p>
          <div className="home-location__actions">
            <Button
              href={directionsUrl}
              variant="secondary"
              external
              onClick={() => track(EVENTS.DIRECTIONS_CLICK, { location: 'home_location' })}
            >
              Get Directions
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
