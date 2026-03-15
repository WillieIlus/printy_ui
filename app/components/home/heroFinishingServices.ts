/**
 * Hero calculator finishing services — structured model for additive pricing.
 * Replace with API data when backend finishing-rates are available.
 */

export type FinishingPricingMode = 'per_sheet' | 'per_piece' | 'flat'

export interface HeroFinishingService {
  id: string
  label: string
  pricing_mode: FinishingPricingMode
  rate: number
  /** Product keys this applies to; '*' = all */
  products: string[]
}

/** All available finishing services. Swap for API fetch when wired. */
export const HERO_FINISHING_SERVICES: HeroFinishingService[] = [
  { id: 'lamination_front_gloss', label: 'Gloss lamination (front only)', pricing_mode: 'per_sheet', rate: 12, products: ['business_cards', 'flyers', 'brochures', 'stickers'] },
  { id: 'lamination_back_gloss', label: 'Gloss lamination (back only)', pricing_mode: 'per_sheet', rate: 12, products: ['business_cards', 'flyers', 'brochures'] },
  { id: 'lamination_both_gloss', label: 'Gloss lamination (both sides)', pricing_mode: 'per_sheet', rate: 25, products: ['business_cards', 'flyers', 'brochures', 'stickers'] },
  { id: 'lamination_front_matte', label: 'Matte lamination (front only)', pricing_mode: 'per_sheet', rate: 14, products: ['business_cards', 'flyers', 'brochures', 'stickers'] },
  { id: 'lamination_back_matte', label: 'Matte lamination (back only)', pricing_mode: 'per_sheet', rate: 14, products: ['business_cards', 'flyers', 'brochures'] },
  { id: 'lamination_both_matte', label: 'Matte lamination (both sides)', pricing_mode: 'per_sheet', rate: 28, products: ['business_cards', 'flyers', 'brochures', 'stickers'] },
  { id: 'cutting', label: 'Cutting / trimming', pricing_mode: 'flat', rate: 50, products: ['*'] },
  { id: 'folding', label: 'Folding', pricing_mode: 'per_piece', rate: 0.5, products: ['flyers', 'brochures'] },
  { id: 'creasing', label: 'Creasing', pricing_mode: 'per_piece', rate: 0.3, products: ['brochures', 'business_cards'] },
  { id: 'stapling', label: 'Stapling', pricing_mode: 'flat', rate: 80, products: ['flyers', 'brochures', 'receipt_books'] },
  { id: 'booklet_binding', label: 'Booklet binding', pricing_mode: 'flat', rate: 120, products: ['brochures'] },
  { id: 'eyelets', label: 'Eyelets', pricing_mode: 'per_piece', rate: 15, products: ['banners'] },
  { id: 'spot_uv', label: 'Spot UV', pricing_mode: 'flat', rate: 300, products: ['business_cards', 'flyers', 'brochures'] },
  { id: 'foil', label: 'Foil stamping', pricing_mode: 'flat', rate: 450, products: ['business_cards', 'flyers', 'brochures'] },
]

export function appliesToProduct(service: HeroFinishingService, productKey: string): boolean {
  return service.products.includes('*') || service.products.includes(productKey)
}

export function computeServiceCost(
  service: HeroFinishingService,
  sheetsEst: number,
  qty: number,
): number {
  switch (service.pricing_mode) {
    case 'per_sheet':
      return sheetsEst * service.rate
    case 'per_piece':
      return qty * service.rate
    case 'flat':
      return service.rate
    default:
      return 0
  }
}
