import { formatPrice } from '../data/menu'

/**
 * A single menu row: name on the left, price right, held together by a leader
 * rule the way a printed menu does it. Not a card.
 *
 * `columns` is set when every item in the category shares the same sizes
 * (Stromboli, for example), so the prices line up under one shared header
 * instead of repeating "Medium"/"Large" on every line.
 */
export function MenuItem({ item, columns }) {
  const hasSizeColumns = columns && item.prices

  return (
    <li className="menu-item">
      <div className="menu-item__row">
        <span className="menu-item__name">{item.name}</span>
        <span className="menu-item__leader" aria-hidden="true" />

        {hasSizeColumns ? (
          <span className="menu-item__prices menu-item__prices--columns">
            {columns.map((label) => {
              const match = item.prices.find((price) => price.label === label)
              return (
                <span className="menu-item__price" key={label}>
                  <span className="visually-hidden">{label}: </span>
                  {match ? formatPrice(match.price) : '—'}
                </span>
              )
            })}
          </span>
        ) : item.prices ? (
          <span className="menu-item__prices">
            {item.prices.map((price) => (
              <span className="menu-item__price-pair" key={price.label}>
                <span className="menu-item__size">{price.label}</span>
                <span className="menu-item__price">{formatPrice(price.price)}</span>
              </span>
            ))}
          </span>
        ) : item.price != null ? (
          <span className="menu-item__price">{formatPrice(item.price)}</span>
        ) : item.priceNote ? (
          <span className="menu-item__price menu-item__price--note">{item.priceNote}</span>
        ) : null}
      </div>

      {item.description && <p className="menu-item__description">{item.description}</p>}

      {import.meta.env.DEV && item.verify && (
        <p className="dev-note">Verify size/format of this item before launch.</p>
      )}
    </li>
  )
}
