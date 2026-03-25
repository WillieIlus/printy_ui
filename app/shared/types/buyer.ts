/**
 * Printy_API buyer flow types.
 * ShopPublic and Product from base.ts.
 */

/** Quote draft (cart-like, one per shop) */
export interface QuoteDraft {
  id: number
  shop: number
  shop_name: string
  shop_slug?: string
  shop_currency?: string
  quote_draft_file_id?: number | null
  status: 'draft' | 'submitted' | 'viewed' | 'quoted' | 'accepted' | 'closed' | 'cancelled'
  items: QuoteItem[]
  /** Backend may return number (total) or { subtotal, total } */
  totals?: Record<string, string> | number
}

/** Quote item — PRODUCT or CUSTOM */
export interface QuoteItem {
  id: number
  item_type: 'PRODUCT' | 'CUSTOM'
  created_at?: string
  product?: number
  product_name?: string
  product_slug?: string
  title?: string
  spec_text?: string
  quantity: number
  pricing_mode?: string
  chosen_width_mm?: number | null
  chosen_height_mm?: number | null
  paper?: number | null
  material?: number | null
  machine?: number | null
  sides?: string
  color_mode?: string
  special_instructions?: string
  finishings?: { finishing_rate: number }[]
  finishing_rate_ids?: number[]
  has_artwork?: boolean
  unit_price?: string | null
  line_total?: string | null
}

/** Preview price response */
export interface PreviewPriceResponse {
  currency: string
  total: string | number
  lines: { label: string; amount: string }[]
  hasNegotiable: boolean
  can_calculate?: boolean
  reason?: string
  suggestions?: { code?: string; message?: string }[]
}

export interface QuoteDraftShopGroup {
  draft_id: number
  quote_request_id?: number
  shop_id: number
  shop_name: string
  shop_slug: string
  shop_currency: string
  status: QuoteDraft['status']
  item_count: number
  items: QuoteItem[]
  subtotal: string
  total?: string
  can_recalculate?: boolean
  can_submit?: boolean
  latest_sent_quote?: {
    id: number
    status: string
    total?: string | null
    turnaround_days?: number | null
    note?: string | null
    sent_at?: string | null
    revision_number?: number
    whatsapp_message?: string | null
  } | null
  created_at?: string | null
  updated_at?: string | null
}

export interface QuoteDraftFile {
  id: number
  file_kind?: 'grouped_quote_file'
  customer?: {
    label?: string
    company_name?: string
    contact_name?: string
    contact_email?: string
    contact_phone?: string
  }
  customer_name?: string
  company_name: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  notes?: string
  status: 'open' | 'closed'
  shop_count: number
  draft_count: number
  quote_count?: number
  item_count: number
  total_value?: string
  has_draft?: boolean
  shop_groups: QuoteDraftShopGroup[]
  created_at?: string | null
  updated_at?: string | null
}
