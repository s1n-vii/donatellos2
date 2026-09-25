import { business, formatHourRange, getRestaurantWeekday } from '../data/business'

/**
 * Renders owner-confirmed hours. When hours are not verified yet, shows a call prompt.
 */
export function Hours({ variant = 'full', className = '' }) {
  if (!business.hoursVerified || !business.hours.length) {
    return (
      <p className={`hours hours--unverified ${className}`.trim()}>
        Hours are not listed on this site yet. Call{' '}
        <a href={business.phone.href}>{business.phone.display}</a> for today&apos;s hours.
      </p>
    )
  }

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
