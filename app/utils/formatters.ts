/** Format values for display */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return 'N/A'
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function normalizeCurrencyCode(currency?: string | null): string {
  const normalized = String(currency ?? '').trim().toUpperCase()
  if (!normalized) return 'KES'
  if (normalized === 'KSH') return 'KES'
  if (/^[A-Z]{3}$/.test(normalized)) return normalized
  return 'KES'
}

export function parseCurrencyAmount(value: string | number | null | undefined): {
  amount: number | null
  currency: string | null
} {
  if (value === null || value === undefined) return { amount: null, currency: null }
  if (typeof value === 'number') {
    return { amount: Number.isFinite(value) ? value : null, currency: null }
  }

  const raw = String(value).trim()
  if (!raw) return { amount: null, currency: null }

  const prefixMatch = raw.match(/^([A-Za-z]{3})\s+/)
  const suffixMatch = raw.match(/\s+([A-Za-z]{3})$/)
  const numericPart = raw
    .replace(/^([A-Za-z]{3})\s+/, '')
    .replace(/\s+([A-Za-z]{3})$/, '')
    .replace(/,/g, '')
    .trim()
  const parsed = Number.parseFloat(numericPart)

  return {
    amount: Number.isFinite(parsed) ? parsed : null,
    currency: prefixMatch || suffixMatch ? normalizeCurrencyCode(prefixMatch?.[1] ?? suffixMatch?.[1] ?? null) : null,
  }
}

export function formatCurrency(
  value: string | number | null | undefined,
  currency = 'KES',
  fallback = 'N/A'
): string {
  if (value === null || value === undefined) return fallback
  const parsed = parseCurrencyAmount(value)
  if (parsed.amount === null) return typeof value === 'string' && !value.trim() ? fallback : String(value)
  const code = normalizeCurrencyCode(parsed.currency ?? currency)
  if (code === 'KES') {
    return `KES ${parsed.amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: code }).format(parsed.amount)
}

/** Kenyan Shilling â€” consistent business formatting */
export function formatKES(value: string | number | null | undefined): string {
  return formatCurrency(value, 'KES')
}

export function formatCurrencyRange(
  minValue: string | number | null | undefined,
  maxValue: string | number | null | undefined,
  currency?: string | null
): string | null {
  if (minValue === null || minValue === undefined) return null
  const low = formatCurrency(minValue, currency ?? 'KES')
  if (maxValue === null || maxValue === undefined) return low
  const high = formatCurrency(maxValue, currency ?? 'KES')
  return low === high ? low : `${low} - ${high}`
}

/**
 * Format item price for display. Tweaked items have exact options (paper, etc.)
 * so we show a single value. If backend returns a range (e.g. "100 â€“ 200" or "100-200"),
 * show the first value as the precise estimate while preserving backend currency when supplied.
 */
export function formatItemPrice(
  value: string | number | null | undefined,
  currency?: string | null
): string {
  if (value === null || value === undefined) return 'N/A'
  const str = String(value).trim()
  if (!str) return 'N/A'
  const parsed = parseCurrencyAmount(str)
  const resolvedCurrency = normalizeCurrencyCode(parsed.currency ?? currency)
  const rangeMatch = str.match(/^(?:([A-Za-z]{3})\s+)?([\d,.\s]+)\s*[â€“-]\s*[\d,.\s]+(?:\s+([A-Za-z]{3}))?$/)
  if (rangeMatch) {
    const first = parseFloat((rangeMatch[2] ?? '').replace(/,/g, '').trim())
    const rangeCurrency = rangeMatch[1] ?? rangeMatch[3] ?? resolvedCurrency
    if (!Number.isNaN(first)) return formatCurrency(first, rangeCurrency)
  }
  if (parsed.amount !== null) return formatCurrency(parsed.amount, resolvedCurrency)
  return str
}

export function formatPhone(value: string | null | undefined): string {
  if (!value) return 'N/A'
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return value
}
