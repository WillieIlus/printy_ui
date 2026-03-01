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
