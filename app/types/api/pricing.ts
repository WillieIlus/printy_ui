export interface PricingPreviewRequest {
  shop?: number | null
  product?: number | null
  quantity: number
  paper?: number | null
  machine?: number | null
  color_mode?: 'BW' | 'COLOR'
  sides?: 'SIMPLEX' | 'DUPLEX'
  width_mm?: number | null
  height_mm?: number | null
  turnaround_hours?: number | null
}

export interface PricingBreakdownLine {
  code?: string
  label?: string
  amount?: string | number | null
  formula?: string | null
}

export interface PricingPreviewResponse {
  can_calculate?: boolean
  product_type?: string | null
  pricing_mode?: string | null
  price_mode?: string | null
  quantity?: number | null
  currency?: string | null
  warnings?: string[]
  assumptions?: string[]
  missing_fields?: string[]
  message?: string | null
  totals?: Record<string, unknown>
  breakdown?: Record<string, unknown> | null
  calculation_result?: {
    billing_type?: string | null
    line_items?: PricingBreakdownLine[]
    explanation_blocks?: Array<{ title?: string; text?: string }>
  } & Record<string, unknown>
}
