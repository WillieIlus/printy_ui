export interface QuoteItem {
  id: number
  quote: number
  product_template: number | null
  name: string
  description: string | null
  quantity: number
  unit_price: string
  total_price: string
}

/** Staff quote API — matches Printy_API QuoteRequest + QuoteItem */
export type StaffQuoteStatus = 'DRAFT' | 'SUBMITTED' | 'PRICED' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'

export interface StaffQuoteItemFinishing {
  finishing_rate: number
  coverage_qty?: number | null
  price_override?: string | null
}

export interface StaffQuoteItem {
  id: number
  item_type: 'PRODUCT' | 'CUSTOM'
  product: number | null
  product_name: string
  title?: string
  quantity: number
  pricing_mode: 'SHEET' | 'LARGE_FORMAT'
  paper: number | null
  material: number | null
  chosen_width_mm: number | null
  chosen_height_mm: number | null
  sides: string
  color_mode: string
  machine: number | null
  unit_price: string | null
  line_total: string | null
  pricing_snapshot: StaffPricingSnapshot | null
  pricing_locked_at: string | null
  finishings: StaffQuoteItemFinishing[]
}

export interface StaffPricingSnapshot {
  can_calculate: boolean
  pricing_mode: string
  currency?: string | null
  copies_per_sheet?: number
  sheets_needed?: number
  area_m2?: string
  paper_cost?: string
  print_cost?: string
  material_cost?: string
  finishing_total?: string
  services_total?: string
  unit_price?: string
  line_total?: string
  paper_label?: string
  machine_label?: string
  finishing_lines?: { name: string; charge_unit: string; computed_cost: string }[]
}

export interface StaffQuote {
  id: number
  shop: number
  shop_name: string
  shop_slug?: string
  created_by: number | null
  customer_name: string
  customer_email: string
  customer_phone: string
  status: StaffQuoteStatus
  notes: string
  total: string | null
  pricing_locked_at: string | null
  whatsapp_message: string
  sent_at: string | null
  created_at: string
  updated_at: string
  items: StaffQuoteItem[]
}

export interface Quote {
  id: number
  shop: number
  customer_name: string
  customer_email: string
  customer_phone: string | null
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed'
  notes: string | null
  subtotal: string
  tax: string
  discount: string
  total: string
  valid_until: string | null
  items: QuoteItem[]
  created_at: string
  updated_at: string
}

export interface ProductTemplate {
  id: number
  shop?: number
  name: string
  description: string | null
  base_price?: string
  unit?: string
  defaults?: Record<string, unknown>
  is_active: boolean
}
