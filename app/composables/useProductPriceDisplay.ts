import type { Product } from '~/shared/types'
import { formatCurrency, formatCurrencyRange } from '~/utils/formatters'

export interface TweakFormContext {
  quantity: number
  sides: 'SIMPLEX' | 'DUPLEX'
  color_mode: 'BW' | 'COLOR'
  paper: number | null
  material: number | null
  finishings: { finishing_rate: number }[]
}

export interface FinishingRateContext {
  id: number
  price: string
  charge_unit?: string
}

export function useProductPriceDisplay() {
  function toNumber(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined) return null
    const parsed = typeof value === 'number' ? value : Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  function resolveProductCurrency(product: Product): string | null {
    return product.price_range_est?.currency ?? product.price_hint?.currency ?? product.shop?.currency ?? null
  }

  function priceDisplay(product: Product): string {
    const est = product.price_range_est
    const hint = product.price_hint
    const currency = resolveProductCurrency(product)
    if (est?.price_display) return est.price_display
    if (hint?.price_display) return hint.price_display
    if (est?.lowest?.total) return `From ${formatCurrency(est.lowest.total, currency ?? 'KES')}`
    if (hint?.min_price != null) return `From ${formatCurrency(hint.min_price, currency ?? 'KES')}`
    return 'Price on request'
  }

  function priceDisplaySummary(product: Product): { totalLine: string; perUnitLine: string } | null {
    const est = product.price_range_est
    const hint = product.price_hint
    const src = est ?? hint
    if (!src?.can_calculate) return null

    const currency = resolveProductCurrency(product)
    const qty = src.quantity_used ?? product.min_quantity ?? 1
    const totalLow = src.total_low ?? hint?.min_price ?? toNumber(est?.lowest?.total)
    const totalHigh = src.total_high ?? hint?.max_price ?? toNumber(est?.highest?.total)
    const perLow = src.per_unit_low ?? (totalLow != null && qty ? totalLow / qty : null)
    const perHigh = src.per_unit_high ?? (totalHigh != null && qty ? totalHigh / qty : null)
    const unitLabel = src.unit_label ?? 'per item'

    if (totalLow == null) return null

    const totalLine = totalHigh != null && Math.abs((totalHigh ?? 0) - totalLow) >= 0.01
      ? (formatCurrencyRange(totalLow, totalHigh, currency ?? 'KES') ?? formatCurrency(totalLow, currency ?? 'KES'))
      : formatCurrency(totalLow, currency ?? 'KES')

    const perUnitLine = perLow != null
      ? (perHigh != null && Math.abs(perHigh - perLow) >= 0.01
        ? `${formatCurrencyRange(perLow, perHigh, currency ?? 'KES')} ${unitLabel}`
        : `${formatCurrency(perLow, currency ?? 'KES')} ${unitLabel}`)
      : ''

    const totalWithQty = qty > 1 ? `${totalLine} (${qty} pcs)` : totalLine
    return { totalLine: totalWithQty, perUnitLine }
  }

  function tweakPriceDisplaySummary(
    product: Product,
    _form: TweakFormContext,
    _finishingRates: FinishingRateContext[] = []
  ): { totalLine: string; perUnitLine: string } | null {
    return priceDisplaySummary(product)
  }

  function priceDiagnostics(product: Product): { reason?: string; missingFields?: string[]; suggestions?: { message?: string }[] } | null {
    const est = product.price_range_est
    const hint = product.price_hint
    const src = est ?? hint
    if (!src || src.can_calculate) return null
    return {
      reason: src.reason ?? undefined,
      missingFields: src.missing_fields,
      suggestions: src.suggestions,
    }
  }

  return { priceDisplay, priceDisplaySummary, tweakPriceDisplaySummary, priceDiagnostics }
}
