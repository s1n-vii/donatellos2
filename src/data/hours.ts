/** Owner-confirmed pickup / dine-in hours for Abbottstown (America/New_York). */

export type HourEntry = {
  day: string
  short: string
  schemaDay: string
  closed: boolean
  open: string | null
  close: string | null
}

export const confirmedHours: HourEntry[] = [
  {
    day: 'Monday',
    short: 'Mon',
    schemaDay: 'Monday',
    closed: false,
    open: '11:00',
    close: '21:00',
  },
  {
    day: 'Tuesday',
    short: 'Tue',
    schemaDay: 'Tuesday',
    closed: true,
    open: null,
    close: null,
  },
  {
    day: 'Wednesday',
    short: 'Wed',
    schemaDay: 'Wednesday',
    closed: false,
    open: '11:00',
    close: '21:00',
  },
  {
    day: 'Thursday',
    short: 'Thu',
    schemaDay: 'Thursday',
    closed: false,
    open: '11:00',
    close: '21:00',
  },
  {
    day: 'Friday',
    short: 'Fri',
    schemaDay: 'Friday',
    closed: false,
    open: '11:00',
    close: '22:00',
  },
  {
    day: 'Saturday',
    short: 'Sat',
    schemaDay: 'Saturday',
    closed: false,
    open: '11:00',
    close: '22:00',
  },
  {
    day: 'Sunday',
    short: 'Sun',
    schemaDay: 'Sunday',
    closed: false,
    open: '11:00',
    close: '20:00',
  },
]
