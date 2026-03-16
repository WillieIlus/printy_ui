/**
 * Customer quote request types — matches backend QuoteRequestCustomer* serializers.
 */

export type QuoteRequestStatus =
  | 'draft'
  | 'submitted'
  | 'viewed'
  | 'quoted'
  | 'accepted'
  | 'closed'
  | 'cancelled'

export interface QuoteRequestItem {
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
  material?: number | null
  sides?: string
  color_mode?: string
  unit_price?: string | null
  line_total?: string | null
  finishings?: { finishing_rate: number; finishing_rate_name?: string }[]
}

export interface ShopQuoteSummary {
  id: number
  status: string
  total: string | null
  turnaround_days: number | null
  note: string | null
  revision_number: number
  sent_at: string | null
  created_at: string
}

export interface QuoteRequest {
  id: number
  shop: number
  shop_name: string
  shop_slug: string
  shop_currency?: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  status: QuoteRequestStatus
  notes?: string
  delivery_preference?: string
  delivery_address?: string
  delivery_location?: number | null
  delivery_location_name?: string
  items: QuoteRequestItem[]
  services?: unknown[]
  attachments?: { id: number; file: string; name: string; created_at: string }[]
  latest_sent_quote: ShopQuoteSummary | null
  whatsapp_summary?: string
  created_at: string
  updated_at: string
}

export interface QuoteRequestListResponse {
  results?: QuoteRequest[]
}
