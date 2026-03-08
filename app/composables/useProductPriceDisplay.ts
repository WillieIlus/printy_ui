import type { Product } from '~/shared/types'
import { formatKES } from '~/utils/formatters'

export function useProductPriceDisplay() {
  function priceDisplay(product: Product): string {
    const est = product.price_range_est
    const hint = product.price_hint
    if (est?.price_display) return est.price_display
    if (hint?.price_display) return hint.price_display
    if (est?.lowest?.total) return `From ${formatKES(est.lowest.total)}`
    if (hint?.min_price != null) return `From ${formatKES(hint.min_price)}`
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

  return { priceDisplay, priceDisplaySummary }
}
