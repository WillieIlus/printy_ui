import type { MoneyString } from '~/types/pricing'

export function formatMoneyString(value?: MoneyString | null, currency = 'KES') {
  if (value === null || value === undefined || value === '') {
    return `${currency} -`
  }

  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return `${currency} ${value}`
  }

  return `${currency} ${new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numeric)}`
}

export function isPositiveMoneyString(value?: MoneyString | null) {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0
}
