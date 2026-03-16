/**
 * Shop incoming request types — matches backend QuoteRequestShop* serializers.
 */

export type IncomingRequestStatus =
  | 'draft'
  | 'submitted'
  | 'viewed'
  | 'quoted'
  | 'accepted'
  | 'closed'
  | 'cancelled'

export interface IncomingRequestItem {
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
  needs_review?: boolean
  finishings?: { finishing_rate: number; finishing_rate_name?: string }[]
}

export interface SentQuoteSummary {
  id: number
  status: string
  total: string | null
  turnaround_days: number | null
  note: string | null
  revision_number: number
  sent_at: string | null
  created_at: string
}

export interface IncomingRequestList {
  id: number
  shop: number
  shop_name: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  status: IncomingRequestStatus
  delivery_preference?: string
  delivery_address?: string
  items_count: number
  has_sent_quote: boolean
  created_at: string
}

export interface IncomingRequestDetail extends IncomingRequestList {
  shop_currency?: string
  created_by?: number
  customer_inquiry?: unknown
  notes?: string
  delivery_location?: number | null
  delivery_location_name?: string
  items: IncomingRequestItem[]
  services?: unknown[]
  attachments?: { id: number; file: string; name: string; created_at: string }[]
  sent_quotes: SentQuoteSummary[]
  whatsapp_summary?: string
  updated_at: string
}
