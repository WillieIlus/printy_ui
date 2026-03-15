/**
 * Hero calculator product-aware constraints.
 * Defines defaults and allowed options per product type.
 */

export type ProductKey =
  | 'business_cards'
  | 'flyers'
  | 'brochures'
  | 'stickers'
  | 'banners'
  | 'receipt_books'

export type SizeKey =
  | 'a4'
  | 'a5'
  | 'a6'
  | 'a7'
  | 'bcards'
  | 'letter'
  | 'dl'
  | 'a3'
  | 'custom'

export interface ProductConfig {
  defaultSize: SizeKey
  defaultQty: number
  defaultSides: 1 | 2
  defaultGsm: number
  allowedSizes: SizeKey[]
  allowedGsm: number[]
  /** Quantity options for dropdown; omit to use default set. */
  qtyOptions?: number[]
  /** Finishing service ids that apply; used to filter options. */
  finishingIds: string[]
}

const ALL_SIZES: SizeKey[] = ['a4', 'a5', 'a6', 'a7', 'bcards', 'letter', 'dl', 'a3', 'custom']

/** Product-specific configuration. */
export const HERO_PRODUCT_CONFIG: Record<ProductKey, ProductConfig> = {
  business_cards: {
    defaultSize: 'bcards',
    defaultQty: 500,
    defaultSides: 2,
    defaultGsm: 300,
    allowedSizes: ['bcards', 'a6', 'a7'],
    allowedGsm: [250, 300, 350],
    finishingIds: [
      'lamination_front_gloss',
      'lamination_back_gloss',
      'lamination_both_gloss',
      'lamination_front_matte',
      'lamination_back_matte',
      'lamination_both_matte',
      'cutting',
      'creasing',
      'spot_uv',
      'foil',
    ],
  },
  flyers: {
    defaultSize: 'a5',
    defaultQty: 1000,
    defaultSides: 2,
    defaultGsm: 130,
    allowedSizes: ['a4', 'a5', 'a6', 'dl'],
    allowedGsm: [80, 100, 130, 150],
    finishingIds: [
      'lamination_front_gloss',
      'lamination_back_gloss',
      'lamination_both_gloss',
      'lamination_front_matte',
      'lamination_back_matte',
      'lamination_both_matte',
      'cutting',
      'folding',
      'creasing',
      'stapling',
      'spot_uv',
      'foil',
    ],
  },
  brochures: {
    defaultSize: 'a4',
    defaultQty: 500,
    defaultSides: 2,
    defaultGsm: 150,
    allowedSizes: ['a4', 'a5', 'a6', 'dl'],
    allowedGsm: [130, 150, 250, 300],
    finishingIds: [
      'lamination_front_gloss',
      'lamination_back_gloss',
      'lamination_both_gloss',
      'lamination_front_matte',
      'lamination_back_matte',
      'lamination_both_matte',
      'cutting',
      'folding',
      'creasing',
      'stapling',
      'booklet_binding',
      'spot_uv',
      'foil',
    ],
  },
  stickers: {
    defaultSize: 'a4',
    defaultQty: 500,
    defaultSides: 1,
    defaultGsm: 130,
    allowedSizes: ['a4', 'a5', 'a6'],
    allowedGsm: [80, 100, 130, 150],
    finishingIds: [
      'lamination_front_gloss',
      'lamination_both_gloss',
      'lamination_front_matte',
      'lamination_both_matte',
      'cutting',
    ],
  },
  banners: {
    defaultSize: 'custom',
    defaultQty: 1,
    defaultSides: 1,
    defaultGsm: 250,
    allowedSizes: ['a3', 'custom'],
    allowedGsm: [250, 300, 350],
    qtyOptions: [1, 2, 5, 10, 20, 50],
    finishingIds: ['cutting', 'eyelets'],
  },
  receipt_books: {
    defaultSize: 'custom',
    defaultQty: 50,
    defaultSides: 1,
    defaultGsm: 80,
    allowedSizes: ['a4', 'a5', 'custom'],
    allowedGsm: [80, 100],
    qtyOptions: [10, 25, 50, 100, 200, 500],
    finishingIds: ['cutting', 'stapling'],
  },
}

export function getProductConfig(product: string): ProductConfig | null {
  if (product in HERO_PRODUCT_CONFIG) {
    return HERO_PRODUCT_CONFIG[product as ProductKey]
  }
  return null
}

export function getSizeOptionsForProduct(product: string): { value: SizeKey; label: string }[] {
  const labels: Record<SizeKey, string> = {
    a4: 'A4',
    a5: 'A5',
    a6: 'A6',
    a7: 'A7',
    bcards: 'Business cards',
    letter: 'Letter',
    dl: 'DL',
    a3: 'A3',
    custom: 'Custom',
  }
  const config = getProductConfig(product)
  const sizes = config?.allowedSizes ?? ALL_SIZES
  return sizes.map((s) => ({ value: s, label: labels[s] ?? s }))
}

export function getGsmOptionsForProduct(product: string): number[] {
  const config = getProductConfig(product)
  return config?.allowedGsm ?? [80, 100, 130, 150, 250, 300, 350]
}

const DEFAULT_QTY_OPTIONS = [100, 250, 500, 1000, 2500, 5000]

export function getQtyOptionsForProduct(product: string): number[] {
  const config = getProductConfig(product)
  return config?.qtyOptions ?? DEFAULT_QTY_OPTIONS
}
