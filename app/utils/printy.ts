/**
 * Shared display helpers for Printy.
 *
 * Every value here is formatting only: prices, times and lateness arrive from
 * the API already decided. Nothing in this file recalculates a price, a stage
 * state or a due date.
 */

const NAIROBI = 'Africa/Nairobi'

export function formatKES(value: number | string | null | undefined, fractionDigits = 0): string {
  const amount = Number(value ?? 0)
  if (!Number.isFinite(amount)) return 'KSh —'
  return `KSh ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`
}

export function formatDuration(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined || !Number.isFinite(Number(minutes))) return ''
  const total = Math.max(0, Math.round(Number(minutes)))
  if (total < 60) return `${total} min`
  const hours = Math.floor(total / 60)
  const rest = total % 60
  return rest ? `${hours}h ${rest}m` : `${hours}h`
}

export function formatLeft(minutes: number | null | undefined): string {
  const label = formatDuration(minutes)
  return label ? `~${label} left` : ''
}

export function formatClock(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-KE', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: NAIROBI,
  }).format(date)
}

/** "Today 4:30 PM", "Tue 4:30 PM", "3 Nov 4:30 PM" in Africa/Nairobi. */
export function formatWhen(value: string | null | undefined, now: Date = new Date()): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const dayKey = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: NAIROBI }).format(d)
  const clock = formatClock(value)
  if (dayKey(date) === dayKey(now)) return `Today ${clock}`
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  if (dayKey(date) === dayKey(tomorrow)) return `Tomorrow ${clock}`
  const weekday = new Intl.DateTimeFormat('en-KE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: NAIROBI,
  }).format(date)
  return `${weekday} ${clock}`
}

/** "just now", "2 min ago", "3h ago", "2 days ago". */
export function timeAgo(value: string | null | undefined, now: number = Date.now()): string {
  if (!value) return ''
  const stamp = new Date(value).getTime()
  if (Number.isNaN(stamp)) return ''
  const minutes = Math.max(0, Math.floor((now - stamp) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes === 1) return '1 min ago'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? '1 day ago' : `${days} days ago`
}

export function formatStageCount(current: number | null | undefined, total: number | null | undefined): string {
  const position = Number(current ?? 0)
  const count = Number(total ?? 0)
  if (!position || !count) return ''
  return `${position} of ${count}`
}
