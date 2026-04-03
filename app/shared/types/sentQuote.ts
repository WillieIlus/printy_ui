/**
 * Shop sent quote types — matches backend ShopQuote* serializers.
 */

export type SentQuoteStatus = 'sent' | 'revised' | 'accepted'

export interface SentQuoteList {
  id: number
  quote_request_id: number
  shop: number
  shop_name: string
  shop_currency?: string | null
  customer_name?: string
  status: SentQuoteStatus
  total: string | number | null
  turnaround_days: number | null
  turnaround_hours?: number | null
  estimated_ready_at?: string | null
  human_ready_text?: string | null
  turnaround_label?: string | null
  revision_number: number
  sent_at: string | null
  created_at: string
}

export interface QuoteRequestSummary {
  id: number
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  status: string
}

export interface SentQuoteItem {
  id: number
  item_type?: string
  product_name?: string
  title?: string
  spec_text?: string
  quantity: number
  line_total?: string | null
  [key: string]: unknown
}

export interface SentQuoteDetail extends SentQuoteList {
  quote_request: number
  quote_request_summary: QuoteRequestSummary
  shop_currency?: string
  note?: string | null
  pricing_locked_at?: string | null
  whatsapp_message?: string | null
  whatsapp_summary?: string
  items: SentQuoteItem[]
  attachments?: { id: number; file: string; name: string; created_at: string }[]
  updated_at: string
}
