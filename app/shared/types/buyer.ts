/**
 * Printy_API buyer flow types.
 * ShopPublic and Product from base.ts.
 */

/** Quote draft (cart-like, one per shop) */
export interface QuoteDraft {
  id: number
  shop: number
  shop_name: string
  status: 'DRAFT' | 'SUBMITTED' | 'PRICED' | 'SENT' | 'ACCEPTED' | 'REJECTED'
  items: QuoteItem[]
  totals?: Record<string, string>
}

/** Quote item — PRODUCT or CUSTOM */
export interface QuoteItem {
  id: number
  item_type: 'PRODUCT' | 'CUSTOM'
  product?: number
  product_name?: string
  title?: string
  spec_text?: string
  quantity: number
  pricing_mode?: string
  chosen_width_mm?: number | null
  chosen_height_mm?: number | null
  paper?: number | null
  sides?: string
  color_mode?: string
  finishing_rate_ids?: number[]
  has_artwork?: boolean
  unit_price?: string | null
  line_total?: string | null
}

/** Preview price response */
export interface PreviewPriceResponse {
  currency: string
  total: string
  lines: { label: string; amount: string }[]
  hasNegotiable: boolean
}
