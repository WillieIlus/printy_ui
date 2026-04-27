import type { PreviewPriceResponse } from '~/shared/types/buyer'

type MaybeRecord = Record<string, unknown> | null | undefined
type CalculationLineItem = {
  code?: string
  amount?: string | number | null
}

function asRecord(value: unknown): MaybeRecord {
  return value && typeof value === 'object' ? value as Record<string, unknown> : null
}

function normalizeMoney(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || null
  }
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return null
}

function getCalculationLineItems(preview: PreviewPriceResponse | MaybeRecord): CalculationLineItem[] {
  const record = asRecord(preview)
  const calculationResult = asRecord(record?.calculation_result)
  const lineItems = calculationResult?.line_items
  return Array.isArray(lineItems) ? lineItems as CalculationLineItem[] : []
}

function getCalculationLineAmount(
  preview: PreviewPriceResponse | MaybeRecord,
  matcher: (line: CalculationLineItem) => boolean
): string | null {
  const line = getCalculationLineItems(preview).find(matcher)
  return normalizeMoney(line?.amount)
}

export function extractCalculationResult(
  preview: PreviewPriceResponse | MaybeRecord
): MaybeRecord {
  const record = asRecord(preview)
  return asRecord(record?.calculation_result)
}

export function getPreviewMoney(
  preview: PreviewPriceResponse | MaybeRecord,
  key: 'subtotal' | 'finishing_total' | 'grand_total' | 'unit_price' | 'paper_cost' | 'print_cost' | 'vat'
): string | null {
  const record = asRecord(preview)
  const totals = asRecord(record?.totals)
  const calculationResult = extractCalculationResult(record)

  if (key === 'paper_cost') {
    return normalizeMoney(totals?.paper_cost)
      ?? getCalculationLineAmount(record, line => line.code === 'paper')
  }

  if (key === 'print_cost') {
    return normalizeMoney(totals?.print_cost)
      ?? getCalculationLineAmount(record, line => line.code === 'printing')
  }

  if (key === 'vat') {
    return normalizeMoney(totals?.vat)
      ?? normalizeMoney(totals?.vat_amount)
      ?? getCalculationLineAmount(record, line => line.code === 'vat')
      ?? normalizeMoney(asRecord(record?.vat)?.amount)
  }

  if (key === 'finishing_total') {
    return normalizeMoney(totals?.finishing_total)
      ?? normalizeMoney(calculationResult?.finishing_total)
  }

  if (key === 'grand_total') {
    return normalizeMoney(totals?.grand_total)
      ?? normalizeMoney(calculationResult?.grand_total)
      ?? normalizeMoney(record?.total)
  }

  if (key === 'subtotal') {
    return normalizeMoney(totals?.subtotal)
      ?? normalizeMoney(calculationResult?.subtotal)
  }

  if (key === 'unit_price') {
    return normalizeMoney(totals?.unit_price)
      ?? normalizeMoney(calculationResult?.unit_price)
  }

  return null
}

export function extractBookletSummary(
  preview: PreviewPriceResponse | MaybeRecord
): {
  inputPages: number | null
  normalizedPages: number | null
  blankPagesAdded: number | null
  coverPages: number | null
  insertPages: number | null
  coverSheets: number | null
  insertSheets: number | null
  assumptions: string[]
  warnings: string[]
} {
  const record = asRecord(preview)
  const breakdown = asRecord(record?.breakdown)
  const booklet = asRecord(breakdown?.booklet)

  const asNumber = (value: unknown): number | null =>
    typeof value === 'number' && Number.isFinite(value)
      ? value
      : typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))
        ? Number(value)
        : null

  const assumptions = Array.isArray(record?.assumptions) ? record.assumptions.filter((item): item is string => typeof item === 'string') : []
  const warnings = Array.isArray(record?.warnings) ? record.warnings.filter((item): item is string => typeof item === 'string') : []

  return {
    inputPages: asNumber(record?.input_pages) ?? asNumber(booklet?.requested_pages),
    normalizedPages: asNumber(record?.normalized_pages) ?? asNumber(booklet?.normalized_pages),
    blankPagesAdded: asNumber(record?.blank_pages_added) ?? asNumber(booklet?.blank_pages_added) ?? asNumber(booklet?.blanks_added),
    coverPages: asNumber(record?.cover_pages) ?? asNumber(booklet?.cover_pages),
    insertPages: asNumber(record?.insert_pages) ?? asNumber(booklet?.insert_pages),
    coverSheets: asNumber(record?.cover_sheets) ?? asNumber(booklet?.cover_sheets),
    insertSheets: asNumber(record?.insert_sheets) ?? asNumber(booklet?.insert_sheets),
    assumptions,
    warnings,
  }
}
