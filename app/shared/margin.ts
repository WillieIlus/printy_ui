import type { ManagerPricingBreakdown } from '~/shared/types'

export interface MarginRow {
  key: string
  label: string
  value: string
  strong: boolean
}

const EMPTY = '—'

function firstValue(breakdown: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    const value = breakdown[key]
    if (value !== null && value !== undefined && value !== '') return value
  }
  return null
}

/** Display-only money formatting; the amount itself always comes from the API. */
export function formatMarginMoney(value: unknown, currency = 'KES'): string {
  if (value === null || value === undefined || value === '') return EMPTY
  const amount = Number(value)
  if (!Number.isFinite(amount)) return String(value)
  return `${currency} ${new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`
}

function formatPercent(value: unknown): string {
  if (value === null || value === undefined || value === '') return EMPTY
  const amount = Number(value)
  if (!Number.isFinite(amount)) return String(value)
  return `${amount.toFixed(2)}%`
}

/**
 * The six figures the manager margin panel always shows. Every value is read
 * straight from the backend breakdown — nothing is recalculated in the browser.
 */
export function marginRows(
  breakdown: ManagerPricingBreakdown | null | undefined,
  currency = 'KES',
): MarginRow[] {
  const source = (breakdown ?? {}) as Record<string, unknown>
  return [
    {
      key: 'printer_total',
      label: "Printer's quote",
      value: formatMarginMoney(firstValue(source, ['printer_total', 'production_cost']), currency),
      strong: false,
    },
    {
      key: 'markup_pct',
      label: 'Markup %',
      value: formatPercent(firstValue(source, ['markup_pct'])),
      strong: false,
    },
    {
      key: 'markup_amount',
      label: 'Markup amount',
      value: formatMarginMoney(firstValue(source, ['markup_amount', 'gross_margin']), currency),
      strong: false,
    },
    {
      key: 'printy_fee',
      label: 'Printy fee',
      value: formatMarginMoney(firstValue(source, ['printy_fee', 'platform_fee']), currency),
      strong: false,
    },
    {
      key: 'client_total',
      label: 'Total to client',
      value: formatMarginMoney(firstValue(source, ['manager_total_to_client', 'client_total']), currency),
      strong: true,
    },
    {
      key: 'per_piece',
      label: 'Per piece',
      value: formatMarginMoney(firstValue(source, ['per_piece']), currency),
      strong: false,
    },
  ]
}
