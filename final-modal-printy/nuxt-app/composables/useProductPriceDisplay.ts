import type { Product } from '~/shared/types'

export function useProductPriceDisplay() {
  function priceDisplay(product: Product): string {
    return product.price_hint?.price_display || 'Get Quote'
  }

  function priceDisplaySummary(product: Product): { totalLine: string; perUnitLine: string | null } | null {
    const hint = product.price_hint || product.price_range_est
    if (!hint?.can_calculate || !hint.total) return null
    return {
      totalLine: `KES ${hint.total.toLocaleString()}`,
      perUnitLine: hint.per_unit ? `KES ${hint.per_unit.toFixed(2)} / pc` : null,
    }
  }

  return { priceDisplay, priceDisplaySummary }
}
