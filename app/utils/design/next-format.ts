const TZ = 'Africa/Nairobi'

const intl = new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 })
const intl2 = new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function kes(value: number): string {
  return `KES ${intl.format(Math.round(value))}`
}

export function kesUnit(value: number): string {
  return `KES ${intl2.format(value)}`
}

function partsInTz(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function formatDue(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const time = new Intl.DateTimeFormat('en-KE', {
    timeZone: TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d).toUpperCase().replace(' ', '')

  const oneDay = 86_400_000
  const dDay = partsInTz(d)
  const today = partsInTz(new Date())
  const tomorrow = partsInTz(new Date(Date.now() + oneDay))

  let dayLabel: string
  if (dDay === today) dayLabel = 'Today'
  else if (dDay === tomorrow) dayLabel = 'Tomorrow'
  else {
    dayLabel = new Intl.DateTimeFormat('en-KE', {
      timeZone: TZ,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(d)
  }

  return `${dayLabel} · ${time}`
}

export function formatHours(hours: number): string {
  if (hours >= 48) {
    const d = Math.floor(hours / 24)
    const h = Math.round(hours - d * 24)
    return h > 0 ? `${d}d ${h}h` : `${d}d`
  }
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatLeft(target: Date | string, from = new Date()): string {
  const t = typeof target === 'string' ? new Date(target) : target
  const ms = t.getTime() - from.getTime()
  if (ms <= 0) return 'overdue'
  const h = ms / 3_600_000
  if (h >= 48) return `${Math.floor(h / 24)}d ${Math.round(h % 24)}h left`
  const hh = Math.floor(h)
  const mm = Math.round((h - hh) * 60)
  if (hh === 0) return `${mm}m left`
  if (mm === 0) return `${hh}h left`
  return `${hh}h ${mm}m left`
}
