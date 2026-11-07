const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY

const RELATIVE_UNITS: Array<{ limit: number; ms: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { limit: HOUR, ms: MINUTE, unit: 'minute' },
  { limit: DAY, ms: HOUR, unit: 'hour' },
  { limit: WEEK, ms: DAY, unit: 'day' },
  { limit: 30 * DAY, ms: WEEK, unit: 'week' },
]

export function jobRelativeTime(value: string | null | undefined, now: number = Date.now()): string {
  if (!value) {
    return ''
  }
  const then = new Date(value).getTime()
  if (!Number.isFinite(then)) {
    return ''
  }
  const delta = then - now
  const absolute = Math.abs(delta)
  if (absolute < MINUTE) {
    return 'just now'
  }
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const sign = delta < 0 ? -1 : 1
  const match = RELATIVE_UNITS.find((candidate) => absolute < candidate.limit)
  if (match) {
    const amount = Math.max(1, Math.floor(absolute / match.ms))
    return formatter.format(sign * amount, match.unit)
  }
  return new Date(then).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })
}

export function formatJobDuration(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return ''
  }
  const minutes = Math.max(0, Math.round(value))
  const days = Math.floor(minutes / (24 * 60))
  const hours = Math.floor((minutes % (24 * 60)) / 60)
  const mins = minutes % 60
  if (days > 0) {
    if (hours === 0 && mins === 0) {
      return `${days} day${days === 1 ? '' : 's'}`
    }
    return `${days}d ${hours}h`
  }
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export function jobExpectedTime(
  minutes: number | null | undefined,
  isLate: boolean,
  completed = false,
): string {
  if (completed) {
    return 'Completed'
  }
  if (minutes === null || minutes === undefined) {
    return ''
  }
  if (minutes <= 0) {
    return isLate ? `Overdue by ${formatJobDuration(Math.abs(minutes)) || '0m'}` : 'Due now'
  }
  return `Expected in ${formatJobDuration(minutes)}`
}
