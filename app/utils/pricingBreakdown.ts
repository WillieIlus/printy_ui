import type { PreviewPriceResponse } from '~/shared/types/buyer'

type MaybeRecord = Record<string, unknown> | null | undefined

export interface PerSheetBreakdown {
  paperPrice: string | null
  frontPrint: string | null
  backPrint: string | null
  duplexSurcharge: string | null
  printTotalPerSheet: string | null
  totalPerSheet: string | null
  formula: string | null
  explanation: string | null
}

function normalizeMoney(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || null
  }
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return null
}

export function extractPreviewRecord(
  preview: PreviewPriceResponse | MaybeRecord
): MaybeRecord {
  if (!preview || typeof preview !== 'object') return null
  return preview as MaybeRecord
}

export function extractPerSheetBreakdown(
  preview: PreviewPriceResponse | MaybeRecord
): PerSheetBreakdown {
  const record = extractPreviewRecord(preview)
  const breakdown = (record?.breakdown as MaybeRecord) ?? record
  const perSheet = (breakdown?.per_sheet_pricing as MaybeRecord) ?? null
  const paper = (breakdown?.paper as MaybeRecord) ?? null
  const printing = (breakdown?.printing as MaybeRecord) ?? null
  const totals = (record?.totals as MaybeRecord) ?? null

  const paperPrice =
    normalizeMoney(perSheet?.paper_price)
    ?? normalizeMoney(paper?.paper_price)
    ?? normalizeMoney(paper?.paper_price_per_sheet)
    ?? normalizeMoney(paper?.cost_per_sheet)

  const frontPrint =
    normalizeMoney(perSheet?.print_price_front)
    ?? normalizeMoney(printing?.print_price_front)

  const backPrint =
    normalizeMoney(perSheet?.print_price_back)
    ?? normalizeMoney(printing?.print_price_back)

  const duplexSurcharge =
    normalizeMoney(perSheet?.duplex_surcharge)
    ?? normalizeMoney(printing?.duplex_surcharge)

  const printTotalPerSheet =
    normalizeMoney(perSheet?.print_total_per_sheet)
    ?? normalizeMoney(printing?.print_total_per_sheet)
    ?? normalizeMoney(printing?.total_per_sheet)

  const totalPerSheet =
    normalizeMoney(perSheet?.total_per_sheet)
    ?? normalizeMoney(totals?.total_per_sheet)
    ?? normalizeMoney(printing?.total_per_sheet_including_paper)
    ?? normalizeMoney(printing?.total_per_sheet)

  const formula =
    typeof perSheet?.formula === 'string'
      ? perSheet.formula
      : typeof printing?.formula === 'string'
        ? printing.formula
        : null

  const explanation =
    typeof perSheet?.explanation === 'string'
      ? perSheet.explanation
      : typeof printing?.explanation === 'string'
        ? printing.explanation
        : null

  return {
    paperPrice,
    frontPrint,
    backPrint,
    duplexSurcharge,
    printTotalPerSheet,
    totalPerSheet,
    formula,
    explanation,
  }
}
