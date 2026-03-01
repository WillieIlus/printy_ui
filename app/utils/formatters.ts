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

export function formatCurrency(value: string | number | null | undefined, currency = 'USD'): string {
  if (value === null || value === undefined) return '—'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (Number.isNaN(num)) return String(value)
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(num)
}

/** Kenyan Shilling — consistent business formatting */
export function formatKES(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (Number.isNaN(num)) return '—'
  return `KES ${num.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatPhone(value: string | null | undefined): string {
  if (!value) return '—'
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return value
}
