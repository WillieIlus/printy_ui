/**
 * Law 10.1 / 6.2 — timestamps are stored in UTC and shown in Africa/Nairobi.
 *
 * Every timestamp the track page and the stage timeline render goes through
 * here, so the timezone is decided in exactly one place.
 */

export const NAIROBI_TIME_ZONE = 'Africa/Nairobi'

export function formatNairobi(
  value: string | null | undefined,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' },
): string {
  if (!value) {
    return ''
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return date.toLocaleString('en-KE', { ...options, timeZone: NAIROBI_TIME_ZONE })
}

/** Date only (no time), shown in Africa/Nairobi. */
export function formatNairobiDate(value: string | null | undefined): string {
  return formatNairobi(value, { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Date + time, shown in Africa/Nairobi. */
export function formatNairobiDateTime(value: string | null | undefined): string {
  return formatNairobi(value)
}
