import { formatPrice } from '../data/menu'
import { MenuItem } from './MenuItem'

/** Long categories read better split into two columns on wide screens. */
const TWO_COLUMN_THRESHOLD = 8

export function MenuSection({ category }) {
  const headingId = `${category.id}-heading`
  const useColumns = category.items.length >= TWO_COLUMN_THRESHOLD

  return (
    <section className="menu-section" id={category.id} aria-labelledby={headingId}>
      <div className="menu-section__head">
        <h2 className="menu-section__title" id={headingId}>
          {category.name}
        </h2>
        {category.blurb && <p className="menu-section__blurb">{category.blurb}</p>}
        {category.note && <p className="menu-section__note">{category.note}</p>}
        {category.priceColumns && (
          <div className="menu-section__columns-key" aria-hidden="true">
            {category.priceColumns.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        )}
      </div>

      <ul className="menu-list" data-columns={useColumns ? 'two' : 'one'}>
        {category.items.map((item) => (
          <MenuItem key={item.id} item={item} columns={category.priceColumns} />
        ))}
      </ul>

      {category.modifiers && category.modifiers.items.length > 0 && (
        <div className="menu-modifiers">
          <h3 className="menu-modifiers__title label">{category.modifiers.title}</h3>
          <ul className="menu-modifiers__list">
            {category.modifiers.items.map((modifier) => (
              <li key={modifier.id}>
                <span>{modifier.name}</span>
                <span className="menu-modifiers__price">{formatPrice(modifier.price)}</span>
              </li>
            ))}
          </ul>
          {category.modifiers.note && (
            <p className="menu-modifiers__note text-muted">{category.modifiers.note}</p>
          )}
        </div>
      )}

      {category.choices && (
        <div className="menu-choices">
          <h3 className="menu-choices__title label">{category.choices.title}</h3>
          <ul className="menu-choices__list">
            {category.choices.items.map((choice) => (
              <li key={choice}>{choice}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
