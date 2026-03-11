import type { Product } from '~/shared/types'
import { formatKES } from '~/utils/formatters'

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
  function priceDisplay(product: Product): string {
    const est = product.price_range_est
    const hint = product.price_hint
    if (est?.price_display) return est.price_display
    if (hint?.price_display) return hint.price_display
    if (est?.lowest?.total) return `From ${formatKES(est.lowest.total)}`
    if (hint?.min_price != null) return `From ${formatKES(hint.min_price)}`
    // #region agent log
    if (typeof fetch !== 'undefined') fetch('http://127.0.0.1:7849/ingest/b9715b76-1be8-4df8-8834-bd23c89fb22c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8ad3d3'},body:JSON.stringify({sessionId:'8ad3d3',hypothesisId:'H2',location:'useProductPriceDisplay.ts:priceDisplay',message:'priceDisplay returns Price on request',data:{productId:product.id,hasEst:!!est,hasHint:!!hint,estPriceDisplay:est?.price_display,hintPriceDisplay:hint?.price_display,estLowestTotal:est?.lowest?.total,hintMinPrice:hint?.min_price},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return 'Price on request'
  }

  function priceDisplaySummary(product: Product): { totalLine: string; perUnitLine: string } | null {
    const est = product.price_range_est
    const hint = product.price_hint
    const src = est ?? hint
    if (!src?.can_calculate) return null
    const qty = src.quantity_used ?? product.min_quantity ?? 1
    const totalLow = src.total_low ?? src.min_price ?? (est?.lowest?.total ? parseFloat(est.lowest.total) : null)
    const totalHigh = src.total_high ?? src.max_price ?? (est?.highest?.total ? parseFloat(est.highest.total) : null)
    const perLow = src.per_unit_low ?? (totalLow != null && qty ? totalLow / qty : null)
    const perHigh = src.per_unit_high ?? (totalHigh != null && qty ? totalHigh / qty : null)
    const unitLabel = src.unit_label ?? 'per item'
    if (totalLow == null) return null
    const totalLine = totalHigh != null && Math.abs((totalHigh ?? 0) - totalLow) >= 0.01
      ? `${formatKES(totalLow)} – ${formatKES(totalHigh)}`
      : formatKES(totalLow)
    const perUnitLine = perLow != null
      ? (perHigh != null && Math.abs(perHigh - perLow) >= 0.01
        ? `${formatKES(perLow)} – ${formatKES(perHigh)} ${unitLabel}`
        : `${formatKES(perLow)} ${unitLabel}`)
      : ''
    const totalWithQty = qty > 1 ? `${totalLine} (${qty} pcs)` : totalLine
    return { totalLine: totalWithQty, perUnitLine }
  }

  /**
   * Precise price for tweak modal when all options are selected.
   * Returns single value (no min–max range) since paper, material, finishings are chosen.
   */
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
    const totalLow = src.total_low ?? src.min_price ?? (est?.lowest?.total ? parseFloat(est.lowest.total) : null)
    const totalHigh = src.total_high ?? src.max_price ?? (est?.highest?.total ? parseFloat(est.highest.total) : null)
    const baseTotal = totalLow ?? totalHigh ?? 0
    if (baseTotal <= 0) return null

    let total = baseTotal * (form.quantity / defaultQty)

    if (form.sides === 'DUPLEX' && product.default_sides !== 'DUPLEX') {
      total *= 1.4
    }

    for (const f of form.finishings) {
      const rate = finishingRates.find((r) => r.id === f.finishing_rate)
      if (rate) {
        const price = parseFloat(rate.price) || 0
        if (rate.charge_unit === 'FLAT') {
          total += price
        } else {
          total += price * form.quantity
        }
      }
    }

    const rounded = Math.round(total)
    const perUnit = form.quantity > 0 ? Math.round((total / form.quantity) * 100) / 100 : 0
    return {
      totalLine: formatKES(rounded),
      perUnitLine: `${formatKES(perUnit)} per item`,
    }
  }

  /**
   * Diagnostics when price cannot be calculated (Price on request).
   * Returns reason, missing_fields, and suggestions for UI display.
   */
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
