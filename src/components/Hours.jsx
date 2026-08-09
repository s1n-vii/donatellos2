import { business, formatHourRange, getRestaurantWeekday } from '../data/business'

/**
 * Renders the owner-confirmed hours from business config. Today's row is marked
 * with both weight and a text label, never colour alone.
 * `variant="compact"` uses short day names for tight columns.
 */
export function Hours({ variant = 'full', className = '' }) {
  const today = getRestaurantWeekday()

  return (
    <dl className={`hours hours--${variant} ${className}`.trim()}>
      {business.hours.map((entry) => {
        const isToday = entry.day === today
        return (
          <div
            key={entry.day}
            className={isToday ? 'hours__row hours__row--today' : 'hours__row'}
          >
            <dt className="hours__day">
              {variant === 'compact' ? entry.short : entry.day}
              {isToday && <span className="hours__today-flag"> · Today</span>}
            </dt>
            <dd className={entry.closed ? 'hours__time hours__time--closed' : 'hours__time'}>
              {formatHourRange(entry)}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
