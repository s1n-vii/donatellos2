import { Link } from 'react-router-dom'
import { CallToOrderButton } from '../components/Button'
import { PAGE_META } from '../data/seo'
import { usePageMeta } from '../lib/usePageMeta'

export function NotFound() {
  usePageMeta(PAGE_META.notFound)

  return (
    <section className="notfound">
      <div className="page page--content">
        <h1 className="notfound__title">That page isn’t here.</h1>
        <p className="notfound__text">
          The page you were looking for doesn’t exist. Here’s where to go instead.
        </p>
        <ul className="notfound__links">
          <li>
            <Link to="/menu">See the full menu</Link>
          </li>
          <li>
            <Link to="/visit">Hours and directions</Link>
          </li>
          <li>
            <Link to="/">Back to the home page</Link>
          </li>
        </ul>
        <CallToOrderButton location="not_found" showNumber />
      </div>
    </section>
  )
}
