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
    const totalLow = src.total_low ?? hint?.min_price ?? (est?.lowest?.total ? parseFloat(est.lowest.total) : null)
    const totalHigh = src.total_high ?? hint?.max_price ?? (est?.highest?.total ? parseFloat(est.highest.total) : null)
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
    form: TweakFormContext,
    finishingRates: FinishingRateContext[] = []
  ): { totalLine: string; perUnitLine: string } | null {
    const hint = product.price_hint
    const est = product.price_range_est
    const src = est ?? hint
    if (!src?.can_calculate) return null

    const defaultQty = src.quantity_used ?? product.min_quantity ?? 100
    const totalLow = src.total_low ?? hint?.min_price ?? (est?.lowest?.total ? parseFloat(est.lowest.total) : null)
    const totalHigh = src.total_high ?? hint?.max_price ?? (est?.highest?.total ? parseFloat(est.highest.total) : null)
    const baseTotal = totalLow ?? totalHigh ?? 0
    if (baseTotal <= 0) return null

    let total = baseTotal * (form.quantity / defaultQty)

    if (form.sides === 'DUPLEX' && product.default_sides !== 'DUPLEX') {
      total *= 1.4
    }

    for (const f of form.finishings) {
      const rate = finishingRates.find((r) => r.id === f.finishing_rate)
      if (!rate) continue
      const price = parseFloat(rate.price) || 0
      if (rate.charge_unit === 'FLAT') total += price
      else total += price * form.quantity
    }

    const rounded = Math.round(total)
    const perUnit = form.quantity > 0 ? Math.round((total / form.quantity) * 100) / 100 : 0
    const currency = resolveProductCurrency(product)

    return {
      totalLine: formatCurrency(rounded, currency ?? 'KES'),
      perUnitLine: `${formatCurrency(perUnit, currency ?? 'KES')} per item`,
    }
  }

  function priceDiagnostics(product: Product): { reason?: string; missingFields?: string[]; suggestions?: { message?: string }[] } | null {
    const est = product.price_range_est
    const hint = product.price_hint
    const src = est ?? hint
    if (!src || src.can_calculate) return null
    return {
      reason: src.reason,
      missingFields: src.missing_fields,
      suggestions: src.suggestions,
    }
  }

  return { priceDisplay, priceDisplaySummary, tweakPriceDisplaySummary, priceDiagnostics }
}
