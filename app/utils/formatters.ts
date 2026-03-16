/** Format values for display */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCurrency(value: string | number | null | undefined, currency = 'KES'): string {
  if (value === null || value === undefined) return '—'
  const num = typeof value === 'string' ? parseFloat(String(value).replace(/,/g, '')) : value
  if (Number.isNaN(num)) return String(value)
  const c = (currency || 'KES').toUpperCase()
  if (c === 'KES' || c === 'KSH') {
    return `KES ${num.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: c }).format(num)
}

/** Kenyan Shilling — consistent business formatting */
export function formatKES(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (Number.isNaN(num)) return '—'
  return `KES ${num.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Format item price for display. Tweaked items have exact options (paper, etc.)
 * so we show a single value. If backend returns a range (e.g. "100 – 200" or "100-200"),
 * show the first value as the precise estimate. Normalizes USD to KES for Kenya market.
 */
export function formatItemPrice(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  const str = String(value).trim()
  if (!str) return '—'
  const rangeMatch = str.match(/^([\d,.\s]+)\s*[–\-]\s*[\d,.\s]+/)
  if (rangeMatch) {
    const first = parseFloat(rangeMatch[1].replace(/,/g, '').trim())
    if (!Number.isNaN(first)) return formatKES(first)
  }
  const cleaned = str.replace(/,/g, '').replace(/\s*USD\s*$/i, '').trim()
  const num = parseFloat(cleaned)
  if (!Number.isNaN(num)) return formatKES(num)
  return str
}

export function formatPhone(value: string | null | undefined): string {
  if (!value) return '—'
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return value
}
