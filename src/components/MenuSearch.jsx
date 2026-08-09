import { useId } from 'react'

export function MenuSearch({ value, onChange, resultCount, isFiltering }) {
  const inputId = useId()

  return (
    <div className="menu-search">
      <label className="menu-search__label label" htmlFor={inputId}>
        Search the menu
      </label>
      <div className="menu-search__field">
        <input
          id={inputId}
          type="search"
          className="menu-search__input"
          placeholder="Search the menu"
          value={value}
          autoComplete="off"
          onChange={(event) => onChange(event.target.value)}
        />
        {value && (
          <button type="button" className="menu-search__clear" onClick={() => onChange('')}>
            Clear
            <span className="visually-hidden"> menu search</span>
          </button>
        )}
      </div>
      <p className="menu-search__status" role="status" aria-live="polite">
        {isFiltering
          ? `${resultCount} ${resultCount === 1 ? 'item' : 'items'} match “${value}”.`
          : ''}
      </p>
    </div>
  )
}
